/**
 * Backend Google Apps Script - FaCES UCV (Staging & Aprobación)
 */

var DEFAULT_STAGING_SPREADSHEET_ID = "18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4";
var STAGING_SHEET_NAME = "Zona de Staging";

var STAGING_HEADERS = [
  "ID_Transaccion",
  "Fecha_Emision",
  "Departamento_Emisor",
  "Estado",
  "Payload_Datos"
];

function getSpreadsheet(id) {
  var targetId = id || DEFAULT_STAGING_SPREADSHEET_ID;
  if (targetId && targetId.trim() !== "") {
    try { return SpreadsheetApp.openById(targetId); } catch (e) {}
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

function setupStagingSheet(ss) {
  var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(STAGING_SHEET_NAME);
  }
  if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, STAGING_HEADERS.length).setValues([STAGING_HEADERS]);
    sheet.getRange(1, 1, 1, STAGING_HEADERS.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function generateTransactionId() {
  var now = new Date();
  var dateStr = Utilities.formatDate(now, Session.getScriptTimeZone() || "GMT-4", "yyyyMMdd");
  var randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return "REQ-" + dateStr + "-" + randomSuffix;
}

function guardarReporteEnStaging(payload) {
  try {
    if (!payload || typeof payload !== 'object') {
      throw new Error("Payload inválido.");
    }
    var ss = getSpreadsheet(DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = setupStagingSheet(ss);

    var idTransaccion = generateTransactionId();
    var fechaEmision = new Date().toISOString();
    var departamentoEmisor = payload.departamento_emisor || "Desconocido";
    var estado = "Pendiente de Revisión";
    var payloadJson = JSON.stringify(payload);

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
    return { status: "error", message: error.toString() };
  }
}

/**
 * RECEPTOR: Actualiza el estado del reporte a "Aprobado" en la Zona de Staging
 */
function aprobarReporteEnStaging(payload) {
  try {
    var idTransaccion = payload.id_transaccion || (payload.payload && payload.payload.id_transaccion);
    if (!idTransaccion) {
      throw new Error("ID de transacción no especificado.");
    }

    var ss = getSpreadsheet(DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      throw new Error("No se encontró la pestaña Zona de Staging.");
    }

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    var encontrado = false;

    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(idTransaccion).trim()) {
        sheet.getRange(i + 2, 4).setValue("Aprobado");
        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      return { status: "error", message: "Transacción no encontrada en Staging: " + idTransaccion };
    }

    return {
      status: "success",
      id_transaccion: idTransaccion,
      message: "Reporte " + idTransaccion + " marcado como Aprobado en la Zona de Staging."
    };
  } catch (err) {
    return { status: "error", message: "Error al aprobar en Staging: " + err.toString() };
  }
}

/**
 * RECEPTOR: Borra todas las filas de la Zona de Staging (conservando encabezados)
 */
function limpiarStagingSheet(spreadsheetId) {
  try {
    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet) {
      return { status: "success", message: "La Zona de Staging ya está limpia." };
    }

    var lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      sheet.deleteRows(2, lastRow - 1);
    }

    return {
      status: "success",
      message: "Zona de Staging limpiada exitosamente."
    };
  } catch (err) {
    return { status: "error", message: "Error al limpiar Staging: " + err.toString() };
  }
}

/**
 * RECEPTOR: Borra un reporte específico de la Zona de Staging por su ID_Transaccion
 */
function eliminarReporteStaging(idTransaccion, spreadsheetId) {
  try {
    if (!idTransaccion) {
      throw new Error("ID de transacción no especificado.");
    }

    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) {
      throw new Error("No se encontró la pestaña Zona de Staging o está vacía.");
    }

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    var encontrado = false;

    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(idTransaccion).trim()) {
        sheet.deleteRow(i + 2);
        encontrado = true;
        break;
      }
    }

    if (!encontrado) {
      return { status: "error", message: "Transacción no encontrada en Staging: " + idTransaccion };
    }

    return {
      status: "success",
      id_transaccion: idTransaccion,
      message: "Reporte " + idTransaccion + " eliminado exitosamente de la Zona de Staging."
    };
  } catch (err) {
    return { status: "error", message: "Error al eliminar de Staging: " + err.toString() };
  }
}

function doPost(e) {
  var responseData;
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Petición POST sin datos de contenido.");
    }
    var postData = e.postData.contents;
    var payload = JSON.parse(postData);

    if (payload && payload.action === 'aprobarReporte') {
      responseData = aprobarReporteEnStaging(payload);
    } else if (payload && payload.action === 'limpiarStaging') {
      responseData = limpiarStagingSheet(payload.spreadsheetId);
    } else if (payload && payload.action === 'eliminarReporteStaging') {
      responseData = eliminarReporteStaging(payload.id_transaccion, payload.spreadsheetId);
    } else if (payload && (!payload.action || payload.action === 'guardarReporte')) {
      responseData = guardarReporteEnStaging(payload);
    } else {
      responseData = { status: "error", message: "Acción no reconocida: " + (payload && payload.action) };
    }
  } catch (err) {
    responseData = { status: "error", message: "Error: " + err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var html = "<h1>Backend FaCES UCV (Staging & Aprobación)</h1><p>Estado: Activo.</p>";
  return ContentService.createTextOutput(html).setMimeType(ContentService.MimeType.TEXT);
}
