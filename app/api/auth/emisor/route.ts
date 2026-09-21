import { NextResponse } from 'next/server'

const DEFAULT_STAGING_SPREADSHEET_ID = '18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4'
const DEFAULT_INITIAL_PIN = '123456'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { departamento, pin, spreadsheetId } = body

    if (!departamento || typeof departamento !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Debe seleccionar un departamento válido.' },
        { status: 400 }
      )
    }

    if (!pin || typeof pin !== 'string') {
      return NextResponse.json(
        { valid: false, message: 'Debe ingresar el PIN de acceso.' },
        { status: 400 }
      )
    }

    const cleanDept = departamento.trim()
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
          action: 'validarPinEmisor',
          departamento: cleanDept,
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
          message: data.message || (data.valid ? 'Acceso concedido.' : 'PIN incorrecto.'),
        })
      }
    } catch (gasError) {
      console.warn('Error al conectar con Google Apps Script para validar emisor:', gasError)
    }

    // Respaldo de seguridad en caso de fallo de red o versión previa en Apps Script:
    if (cleanPin === DEFAULT_INITIAL_PIN) {
      return NextResponse.json({
        valid: true,
        message: 'Acceso autorizado (modo respaldo inicial).',
      })
    }

    return NextResponse.json({
      valid: false,
      message: 'PIN incorrecto para ' + cleanDept + '. Verifique con la Administración.',
    })
  } catch (error: any) {
    console.error('Error en autenticación de emisor:', error)
    return NextResponse.json(
      { valid: false, message: 'Error interno del servidor al verificar credenciales.' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { departamento, pinActual, pinNuevo, spreadsheetId } = body

    if (!departamento || typeof departamento !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Debe seleccionar un departamento válido.' },
        { status: 400 }
      )
    }

    if (!pinActual || !pinNuevo) {
      return NextResponse.json(
        { success: false, message: 'Debe ingresar el PIN actual y el nuevo PIN.' },
        { status: 400 }
      )
    }

    const cleanDept = departamento.trim()
    const cleanActual = String(pinActual).trim()
    const cleanNuevo = String(pinNuevo).trim()

    if (!/^\d{6}$/.test(cleanNuevo)) {
      return NextResponse.json(
        { success: false, message: 'El nuevo PIN debe contener exactamente 6 dígitos numéricos.' },
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
        action: 'cambiarPinEmisor',
        departamento: cleanDept,
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
        message: data.message || 'No se pudo actualizar el PIN del departamento.',
      })
    }
  } catch (error: any) {
    console.error('Error al cambiar PIN de emisor:', error)
    return NextResponse.json(
      { success: false, message: 'Error de conexión al intentar cambiar el PIN del departamento.' },
      { status: 500 }
    )
  }
}

