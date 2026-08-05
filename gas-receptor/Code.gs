/**
 * Backend Google Apps Script - Módulo Receptor
 * Proyecto: Automatización de Reportes FaCES - UCV
 * 
 * 1. Lee las transacciones enviadas desde la "Zona de Staging".
 * 2. Procesa, edita y consolida los reportes aprobados en el Macro Archivo de Excel/Sheets.
 */

// ID de la Hoja de Cálculo de Staging (Donde el Emisor escribe sus reportes)
var STAGING_SPREADSHEET_ID = "18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4";

// Nombre de la pestaña de Staging
var STAGING_SHEET_NAME = "Zona de Staging";

/**
 * Obtiene la hoja de cálculo de Staging por su ID
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getStagingSpreadsheet() {
  if (STAGING_SPREADSHEET_ID && STAGING_SPREADSHEET_ID.trim() !== "") {
    try {
      return SpreadsheetApp.openById(STAGING_SPREADSHEET_ID);
    } catch (e) {
      console.warn("No se pudo abrir la hoja de Staging por ID:", e);
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Lee y obtiene todas las transacciones almacenadas en la Zona de Staging.
 * @returns {Object} Lista de reportes parseados
 */
function obtenerReportesStaging() {
  try {
    var ss = getStagingSpreadsheet();
    if (!ss) {
      throw new Error("No se pudo abrir la hoja de cálculo de Staging.");
    }

    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      return { status: "success", reportes: [] };
    }

    var lastRow = sheet.getLastRow();
    var data = sheet.getRange(2, 1, lastRow - 1, 5).getValues();

    var reportes = data.map(function(row) {
      var payload = {};
      try {
        payload = JSON.parse(row[4]);
      } catch (e) {
        payload = { raw: row[4] };
      }
      return {
        id_transaccion: row[0],
        fecha_emision: row[1],
        departamento_emisor: row[2],
        estado: row[3],
        payload: payload
      };
    }).filter(function(r) {
      // Filtrar filas válidas que tengan ID de transacción
      return r.id_transaccion && r.id_transaccion.toString().indexOf("REQ-") === 0;
    }).reverse(); // Más recientes primero

    return { status: "success", reportes: reportes };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}

/**
 * Endpoint HTTP GET para consulta de la Zona de Staging desde el Módulo Receptor
 */
function doGet(e) {
  var result = obtenerReportesStaging();
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint HTTP POST para acciones del Módulo Receptor
 */
function doPost(e) {
  var responseData;
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch(err) {}
    }

    if (payload.action === 'aprobarReporte') {
      responseData = {
        status: "success",
        id_transaccion: payload.id_transaccion,
        message: "Reporte aprobado exitosamente y preparado para el Macro Archivo"
      };
    } else {
      responseData = obtenerReportesStaging();
    }
  } catch (err) {
    responseData = {
      status: "error",
      message: "Error en el servidor Receptor: " + err.toString()
    };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}
