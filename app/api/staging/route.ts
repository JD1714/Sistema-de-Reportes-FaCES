import { NextResponse } from 'next/server'

/**
 * GET: Lee directamente la pestaña "Zona de Staging" de la Hoja de Cálculo en Google Drive
 */
export async function GET() {
  try {
    const spreadsheetId = '18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4'
    const sheetName = encodeURIComponent('Zona de Staging')
    const targetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`

    const res = await fetch(targetUrl, { cache: 'no-store' })
    const textData = await res.text()

    // Extraer la cadena JSON del envoltorio google.visualization.Query.setResponse(...)
    const firstBrace = textData.indexOf('{')
    const lastBrace = textData.lastIndexOf('}')
    
    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error('No se pudo extraer el formato de datos de la hoja de cálculo.')
    }

    const jsonString = textData.substring(firstBrace, lastBrace + 1)
    const parsed = JSON.parse(jsonString)

    const rows = parsed.table?.rows || []
    const reportes = rows
      .map((r: any) => {
        const c = r.c || []
        const id_transaccion = c[0]?.v ? String(c[0].v) : ''
        const fecha_emision = c[1]?.v ? String(c[1].v) : ''
        const departamento_emisor = c[2]?.v ? String(c[2].v) : ''
        const estado = c[3]?.v ? String(c[3].v) : 'Pendiente de Revisión'
        const rawPayload = c[4]?.v ? String(c[4].v) : '{}'

        let payload = {}
        try {
          payload = JSON.parse(rawPayload)
        } catch {
          payload = { raw: rawPayload }
        }

        return {
          id_transaccion,
          fecha_emision,
          departamento_emisor,
          estado,
          payload,
        }
      })
      .filter((item: any) => item.id_transaccion && item.id_transaccion.startsWith('REQ-'))
      .reverse() // Más recientes primero

    return NextResponse.json({ status: 'success', reportes })
  } catch (err: any) {
    console.error('Error al leer directamente la hoja de Staging:', err)
    return NextResponse.json(
      { status: 'error', message: err.message || 'Error al obtener reportes de Staging' },
      { status: 500 }
    )
  }
}

/**
 * POST: Registra nuevos reportes desde el Módulo Emisor hacia Google Apps Script
 */
export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const targetUrl =
      process.env.NEXT_PUBLIC_STAGING_API_URL ||
      'https://script.google.com/macros/s/AKfycbzA7ZKnRMDypgClzva7G1lEz54zTTHr-z7mt2bH-dv0GEl4Z2XRSpa_ubcIS-KNfesk/exec'

    // Enviar petición de servidor a servidor (evita restricciones CORS del navegador)
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify(payload),
      redirect: 'follow',
    })

    const textData = await res.text()
    let data
    try {
      data = JSON.parse(textData)
    } catch {
      data = { status: 'success', message: textData }
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Proxy Error:', err)
    return NextResponse.json(
      { status: 'error', message: err.message || 'Error al conectar con Google Apps Script' },
      { status: 500 }
    )
  }
}
