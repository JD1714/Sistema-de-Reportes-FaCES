/**
 * Backend Google Apps Script - Módulo Emisor
 * Proyecto: Automatización de Reportes FaCES - UCV
 * 
 * Recibe reportes enviados desde el frontend y los registra en la hoja "Zona de Staging".
 */

// Nombre oficial de la hoja de Staging
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
 * Función utilitaria para asegurar que la hoja "Zona de Staging" exista con sus cabeceras.
 * @param {GoogleAppsScript.Spreadsheet.Spreadsheet} ss Objeto de la hoja de cálculo activa
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} La pestaña de Staging
 */
function setupStagingSheet(ss) {
  if (!ss) {
    ss = SpreadsheetApp.getActiveSpreadsheet();
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
 * Procesa y guarda un payload recibido en la Zona de Staging.
 * @param {Object} payload Objeto de reporte enviado por el Emisor
 * @returns {Object} Respuesta estructurada con el ID generado y estado
 */
function guardarReporteEnStaging(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error("Payload inválido o no proporcionado.");
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = setupStagingSheet(ss);

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
 * Endpoint HTTP POST para recibir peticiones externas desde Axios o la Web App
 */
function doPost(e) {
  var responseData;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Petición POST sin datos de contenido.");
    }
    var postData = e.postData.contents;
    var payload = JSON.parse(postData);
    responseData = guardarReporteEnStaging(payload);
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
 * Endpoint HTTP GET (Health check / bienvenida)
 */
function doGet(e) {
  var html = "<h1>Backend Módulo Emisor - FaCES UCV</h1>" +
             "<p>Estado: Activo y listo para recibir reportes en la Zona de Staging.</p>";
  return ContentService.createTextOutput(html)
    .setMimeType(ContentService.MimeType.TEXT);
}
