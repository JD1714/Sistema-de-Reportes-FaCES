import { NextResponse } from 'next/server'

const DEFAULT_STAGING_SPREADSHEET_ID = '18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4'
const DEFAULT_INITIAL_PIN = '123456'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { pin, spreadsheetId } = body

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json({ valid: false, message: 'PIN no proporcionado o formato inválido.' }, { status: 400 })
    }

    const cleanPin = pin.trim()
    const activeSpreadsheetId = spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID
    const targetUrl =
      process.env.NEXT_PUBLIC_STAGING_API_URL ||
      'https://script.google.com/macros/s/AKfycbzA7ZKnRMDypgClzva7G1lEz54zTTHr-z7mt2bH-dv0GEl4Z2XRSpa_ubcIS-KNfesk/exec'

    try {
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'validarPin',
          pin: cleanPin,
          spreadsheetId: activeSpreadsheetId,
        }),
        redirect: 'follow',
      })

      const textData = await res.text()
      let data: any
      try {
        data = JSON.parse(textData)
      } catch {
        data = null
      }

      if (data && data.status === 'success') {
        return NextResponse.json({
          valid: Boolean(data.valid),
          message: data.message || (data.valid ? 'PIN verificado.' : 'PIN incorrecto.'),
        })
      }
    } catch (gasError) {
      console.warn('Fallo de conexión con Google Apps Script para validar PIN:', gasError)
    }

    // Respaldo de seguridad: si aún no se actualizó el script en la nube o hay fallo de red,
    // se admite el PIN por defecto establecido inicialmente (123456).
    if (cleanPin === DEFAULT_INITIAL_PIN) {
      return NextResponse.json({
        valid: true,
        message: 'PIN por defecto aceptado (modo respaldo).',
      })
    }

    return NextResponse.json({
      valid: false,
      message: 'PIN incorrecto.',
    })
  } catch (error: any) {
    console.error('Error en endpoint de validación de PIN:', error)
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor al procesar la verificación.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { pinActual, pinNuevo, spreadsheetId } = body

    if (!pinActual || !pinNuevo) {
      return NextResponse.json(
        { success: false, message: 'Debe ingresar el PIN actual y el nuevo PIN.' },
        { status: 400 }
      )
    }

    const cleanActual = String(pinActual).trim()
    const cleanNuevo = String(pinNuevo).trim()

    if (!/^\d{6}$/.test(cleanNuevo)) {
      return NextResponse.json(
        { success: false, message: 'El nuevo PIN debe contener exactamente 6 números.' },
        { status: 400 }
      )
    }

    const activeSpreadsheetId = spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID
    const targetUrl =
      process.env.NEXT_PUBLIC_STAGING_API_URL ||
      'https://script.google.com/macros/s/AKfycbzA7ZKnRMDypgClzva7G1lEz54zTTHr-z7mt2bH-dv0GEl4Z2XRSpa_ubcIS-KNfesk/exec'

    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({
        action: 'cambiarPin',
        pinActual: cleanActual,
        pinNuevo: cleanNuevo,
        spreadsheetId: activeSpreadsheetId,
      }),
      redirect: 'follow',
    })

    const textData = await res.text()
    let data: any
    try {
      data = JSON.parse(textData)
    } catch {
      data = { status: 'error', message: textData }
    }

    if (data.status === 'success') {
      return NextResponse.json({
        success: true,
        message: data.message || '¡PIN actualizado exitosamente!',
      })
    } else {
      return NextResponse.json({
        success: false,
        message: data.message || 'No se pudo actualizar el PIN.',
      })
    }
  } catch (error: any) {
    console.error('Error al cambiar PIN:', error)
    return NextResponse.json(
      { success: false, message: 'Error de conexión al intentar cambiar el PIN.' },
      { status: 500 }
    )
  }
}
