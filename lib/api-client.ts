/**
 * Cliente API universal para el Sistema de Reportes FaCES UCV.
 * Diseñado para operar tanto en Next.js local como en HTML autónomo (Single-File)
 * cargado directamente dentro de Google Sheets / Apps Script sin requerir servidor proxy.
 */

export const DEFAULT_STAGING_SPREADSHEET_ID = '18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4'
export const DEFAULT_INITIAL_PIN = '123456'

export const APPS_SCRIPT_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_STAGING_API_URL) ||
  'https://script.google.com/macros/s/AKfycbzA7ZKnRMDypgClzva7G1lEz54zTTHr-z7mt2bH-dv0GEl4Z2XRSpa_ubcIS-KNfesk/exec'

/**
 * Realiza una petición POST segura a Google Apps Script usando text/plain
 * para evitar preflight OPTIONS de CORS en cualquier navegador o entorno.
 */
export async function postToAppsScript(payload: any): Promise<any> {
  const res = await fetch(APPS_SCRIPT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
    redirect: 'follow',
  })

  const textData = await res.text()
  try {
    return JSON.parse(textData)
  } catch {
    return { status: 'success', raw: textData }
  }
}

/**
 * EMISOR: Envía un reporte nuevo a la Zona de Staging
 */
export async function sendReportToStaging(payload: any): Promise<{ success: boolean; id_transaccion?: string; message?: string }> {
  try {
    const data = await postToAppsScript({
      action: 'guardarReporte',
      ...payload,
    })

    if (data.status === 'success' || data.id_transaccion) {
      return {
        success: true,
        id_transaccion: data.id_transaccion,
        message: data.message || 'Reporte registrado exitosamente en la Zona de Staging.',
      }
    }
    return {
      success: false,
      message: data.message || 'No se pudo registrar el reporte.',
    }
  } catch (err: any) {
    console.error('Error enviando reporte a Staging:', err)
    return {
      success: false,
      message: err.message || 'Error de conexión con Google Sheets.',
    }
  }
}

/**
 * RECEPTOR: Valida el PIN de acceso maestro
 */
export async function validateReceptorPin(pin: string, spreadsheetId?: string): Promise<{ valid: boolean; message?: string }> {
  const cleanPin = pin.trim()
  const activeSpreadsheetId = spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID

  try {
    const data = await postToAppsScript({
      action: 'validarPin',
      pin: cleanPin,
      spreadsheetId: activeSpreadsheetId,
    })

    if (data && data.status === 'success') {
      return {
        valid: Boolean(data.valid),
        message: data.message || (data.valid ? 'PIN verificado.' : 'PIN incorrecto.'),
      }
    }
  } catch (err) {
    console.warn('Fallo de conexión al validar PIN en Apps Script:', err)
  }

  // Respaldo de seguridad en caso de falla de red o script inicial
  if (cleanPin === DEFAULT_INITIAL_PIN) {
    return {
      valid: true,
      message: 'PIN por defecto aceptado (modo respaldo).',
    }
  }

  return {
    valid: false,
    message: 'El PIN ingresado es incorrecto.',
  }
}

/**
 * RECEPTOR: Actualiza el PIN maestro en la pestaña "Configuración"
 */
export async function changeReceptorPin(
  pinActual: string,
  pinNuevo: string,
  spreadsheetId?: string
): Promise<{ success: boolean; message?: string }> {
  const cleanActual = pinActual.trim()
  const cleanNuevo = pinNuevo.trim()

  if (!/^\d{6}$/.test(cleanNuevo)) {
    return { success: false, message: 'El nuevo PIN debe contener exactamente 6 dígitos numéricos.' }
  }

  try {
    const data = await postToAppsScript({
      action: 'cambiarPin',
      pinActual: cleanActual,
      pinNuevo: cleanNuevo,
      spreadsheetId: spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID,
    })

    if (data && data.status === 'success') {
      return { success: true, message: data.message || '¡PIN actualizado exitosamente!' }
    }
    return { success: false, message: data.message || 'No se pudo actualizar el PIN.' }
  } catch (err: any) {
    return { success: false, message: err.message || 'Error de conexión al cambiar PIN.' }
  }
}

/**
 * RECEPTOR: Obtiene la lista de reportes registrados en la Zona de Staging.
 * Utiliza múltiples estrategias en cascada para garantizar máxima compatibilidad:
 * 1. POST directo a Apps Script (action: 'obtenerReportes')
 * 2. Consulta directa a Google Visualization API (gviz/tq) compatible con navegador y Sheets
 * 3. Endpoint proxy local /api/staging si está en entorno Next.js
 */
export async function getStagingReports(spreadsheetId?: string): Promise<{ status: string; reportes: any[]; message?: string }> {
  const activeSpreadsheetId = spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID

  // Estrategia 1: Consulta directa por POST a Google Apps Script
  try {
    const data = await postToAppsScript({
      action: 'obtenerReportes',
      spreadsheetId: activeSpreadsheetId,
    })
    if (data && data.status === 'success' && Array.isArray(data.reportes)) {
      return data
    }
  } catch (e) {
    // Continuar a estrategia 2
  }

  // Estrategia 2: Consulta vía Google Visualization API (gviz/tq)
  try {
    const sheetName = encodeURIComponent('Zona de Staging')
    const targetUrl = `https://docs.google.com/spreadsheets/d/${activeSpreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`
    const res = await fetch(targetUrl, { cache: 'no-store' })
    const textData = await res.text()

    const firstBrace = textData.indexOf('{')
    const lastBrace = textData.lastIndexOf('}')

    if (firstBrace !== -1 && lastBrace !== -1) {
      const parsed = JSON.parse(textData.substring(firstBrace, lastBrace + 1))
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
        .reverse()

      return { status: 'success', reportes }
    }
  } catch (e) {
    // Continuar a estrategia 3
  }

  // Estrategia 3: Fallback a endpoint local /api/staging si existe
  try {
    const res = await fetch(`/api/staging?spreadsheetId=${activeSpreadsheetId}`, { cache: 'no-store' })
    const data = await res.json()
    if (data && data.status === 'success' && Array.isArray(data.reportes)) {
      return data
    }
  } catch (e) {
    // Falló
  }

  return { status: 'success', reportes: [] }
}

/**
 * RECEPTOR: Limpia todos los reportes de la Zona de Staging
 */
export async function clearStaging(spreadsheetId?: string): Promise<{ success: boolean; message?: string }> {
  try {
    const data = await postToAppsScript({
      action: 'limpiarStaging',
      spreadsheetId: spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID,
    })
    return {
      success: data.status === 'success',
      message: data.message,
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Error al limpiar la Zona de Staging.' }
  }
}

/**
 * RECEPTOR: Elimina un reporte específico de Staging
 */
export async function deleteStagingReport(id_transaccion: string, spreadsheetId?: string): Promise<{ success: boolean; message?: string }> {
  try {
    const data = await postToAppsScript({
      action: 'eliminarReporteStaging',
      id_transaccion,
      spreadsheetId: spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID,
    })
    return {
      success: data.status === 'success',
      message: data.message,
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Error al eliminar reporte.' }
  }
}

/**
 * RECEPTOR: Marca un reporte como Aprobado en Staging
 */
export async function approveStagingReport(id_transaccion: string, spreadsheetId?: string): Promise<{ success: boolean; message?: string }> {
  try {
    const data = await postToAppsScript({
      action: 'aprobarReporte',
      id_transaccion,
      spreadsheetId: spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID,
    })
    return {
      success: data.status === 'success',
      message: data.message,
    }
  } catch (err: any) {
    return { success: false, message: err.message || 'Error al aprobar reporte.' }
  }
}
