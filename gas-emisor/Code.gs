/**
 * Backend Google Apps Script - Módulo Emisor (Container-Bound)
 * Proyecto: Automatización de Reportes FaCES - UCV
 * 
 * Recibe reportes enviados desde el frontend y los registra en la hoja "Zona de Staging".
 * Permite listar los reportes guardados en la Zona de Staging para el Módulo Receptor.
 */

// ID de respaldo de la Hoja de Cálculo en Google Drive
var SPREADSHEET_ID = "18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4";

// Nombre oficial de la pestaña de Staging
var STAGING_SHEET_NAME = "Zona de Staging";

// Cabeceras oficiales de la Zona de Staging
var STAGING_HEADERS = [
  "ID_Transaccion",
  "Fecha_Emision",
  "Departamento_Emisor",
  "Estado",
  "Payload_Datos"
];

/**
 * Obtiene la hoja de cálculo activa (Container-Bound) o por su ID
 * @returns {GoogleAppsScript.Spreadsheet.Spreadsheet}
 */
function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {}
  if (!ss && SPREADSHEET_ID && SPREADSHEET_ID.trim() !== "") {
    try {
      ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    } catch (e) {}
  }
  return ss;
}

/**
 * Función utilitaria para asegurar que la hoja "Zona de Staging" exista con sus cabeceras.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} La pestaña de Staging
 */
function setupStagingSheet() {
  var ss = getSpreadsheet();
  if (!ss) {
    throw new Error("No se pudo acceder a la hoja de cálculo de Google.");
  }
  
  var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(STAGING_SHEET_NAME);
  }
  
  // Si la hoja está vacía, colocar cabeceras oficiales
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, STAGING_HEADERS.length).setValues([STAGING_HEADERS]);
    sheet.getRange(1, 1, 1, STAGING_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * Genera un ID único para la transacción con formato REQ-YYYYMMDD-XXXX
 * @returns {string} ID único de transacción
 */
function generateTransactionId() {
  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT-4", "yyyyMMdd");
  var randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "REQ-" + dateStr + "-" + randomSuffix;
}

/**
 * Obtiene todos los reportes guardados en la Zona de Staging.
 * @returns {Object} Lista de reportes
 */
function obtenerReportesStaging() {
  try {
    var ss = getSpreadsheet();
    if (!ss) {
      throw new Error("No se pudo acceder a la hoja de cálculo.");
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
    }).reverse(); // Más recientes primero

    return { status: "success", reportes: reportes };
  } catch (err) {
    return { status: "error", message: err.toString() };
  }
}

/**
 * Procesa y guarda un payload recibido en la Zona de Staging.
 * @param {Object} payload Objeto de reporte enviado por el Emisor
 * @returns {Object} Respuesta estructurada con el ID generado y estado
 */
function guardarReporteEnStaging(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error("Payload inválido o no proporcionado.");
    }

    var sheet = setupStagingSheet();

    var idTransaccion = generateTransactionId();
    var fechaEmision = new Date().toISOString();
    var departamentoEmisor = payload.departamento_emisor || "Desconocido";
    var estado = "Pendiente de Revisión";
    var payloadJson = JSON.stringify(payload);

    // Agregar fila plana a la Zona de Staging
    sheet.appendRow([
      idTransaccion,
      fechaEmision,
      departamentoEmisor,
      estado,
      payloadJson
    ]);

    return {
      status: "success",
      id_transaccion: idTransaccion,
      fecha_emision: fechaEmision,
      departamento_emisor: departamentoEmisor,
      estado: estado,
      message: "Reporte registrado exitosamente en la Zona de Staging"
    };
  } catch (error) {
    return {
      status: "error",
      message: error.toString()
    };
  }
}

/**
 * Endpoint HTTP POST para recibir peticiones externas desde Axios o el Proxy local
 */
function doPost(e) {
  var responseData;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Petición POST sin datos de contenido.");
    }
    var postData = e.postData.contents;
    var payload = JSON.parse(postData);

    // Soporte para listar vía POST si es necesario
    if (payload.action === 'listar') {
      responseData = obtenerReportesStaging();
    } else {
      responseData = guardarReporteEnStaging(payload);
    }
  } catch (err) {
    responseData = {
      status: "error",
      message: "Error al procesar la solicitud: " + err.toString()
    };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Endpoint HTTP GET (Health check / Lectura de Staging)
 */
function doGet(e) {
  if (e && e.parameter && e.parameter.action === 'listar') {
    var result = obtenerReportesStaging();
    return ContentService.createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var html = "<h1>Backend Módulo Emisor / Receptor - FaCES UCV</h1>" +
             "<p>Estado: Activo y listo para sincronizar Staging.</p>";
  return ContentService.createTextOutput(html)
    .setMimeType(ContentService.MimeType.TEXT);
}
