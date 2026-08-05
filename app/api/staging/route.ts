import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const targetUrl =
      process.env.NEXT_PUBLIC_STAGING_API_URL ||
      'https://script.google.com/macros/s/AKfycbyfKTxRr-boflnrzHvTSm80P3D4VQskdT269Aqc6QZikLVJTQX0Hepm6nVho7XDAz7A/exec'

    // Obtener reportes de Staging enviando { action: 'listar' } vía POST
    const res = await fetch(targetUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'listar' }),
      redirect: 'follow',
      cache: 'no-store',
    })

    const textData = await res.text()
    let data
    try {
      data = JSON.parse(textData)
    } catch {
      data = { status: 'error', message: 'Respuesta no válida del servidor de Staging', raw: textData }
    }

    return NextResponse.json(data)
  } catch (err: any) {
    console.error('Proxy GET Error:', err)
    return NextResponse.json(
      { status: 'error', message: err.message || 'Error al obtener reportes de Staging' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json()
    const targetUrl =
      process.env.NEXT_PUBLIC_STAGING_API_URL ||
      'https://script.google.com/macros/s/AKfycbyfKTxRr-boflnrzHvTSm80P3D4VQskdT269Aqc6QZikLVJTQX0Hepm6nVho7XDAz7A/exec'

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
