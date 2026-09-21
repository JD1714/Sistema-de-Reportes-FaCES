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

/**
 * RECEPTOR: Obtiene o inicializa el PIN de acceso en la pestaña Configuración
 */
function obtenerOInicializarPin(spreadsheetId) {
  try {
    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Configuración");
    if (!sheet) {
      sheet = ss.insertSheet("Configuración");
      sheet.getRange(1, 1, 1, 2).setValues([["Clave", "Valor"]]).setFontWeight("bold");
      sheet.getRange(2, 1, 1, 2).setValues([["PIN_RECEPTOR", "123456"]]);
      return "123456";
    }

    var lastRow = sheet.getLastRow();
    if (lastRow >= 2) {
      var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === "PIN_RECEPTOR") {
          var stored = String(data[i][1]).trim();
          return stored || "123456";
        }
      }
    }

    sheet.appendRow(["PIN_RECEPTOR", "123456"]);
    return "123456";
  } catch (err) {
    console.warn("Error al obtener PIN de Configuración:", err);
    return "123456";
  }
}

/**
 * RECEPTOR: Valida el PIN ingresado contra la pestaña Configuración
 */
function validarPinReceptor(pinIngresado, spreadsheetId) {
  try {
    var pinAlmacenado = obtenerOInicializarPin(spreadsheetId);
    var ingresadoStr = String(pinIngresado || "").trim();
    var valido = (ingresadoStr === pinAlmacenado);

    return {
      status: "success",
      valid: valido,
      message: valido ? "PIN correcto." : "PIN incorrecto."
    };
  } catch (err) {
    return {
      status: "error",
      valid: false,
      message: "Error al validar PIN: " + err.toString()
    };
  }
}

/**
 * RECEPTOR: Cambia el PIN de acceso verificando el PIN actual
 */
function cambiarPinReceptor(pinActual, pinNuevo, spreadsheetId) {
  try {
    var pinAlmacenado = obtenerOInicializarPin(spreadsheetId);
    var actualLimpio = String(pinActual || "").trim();
    if (actualLimpio !== pinAlmacenado) {
      return {
        status: "error",
        message: "El PIN actual ingresado no es correcto."
      };
    }

    var nuevoLimpio = String(pinNuevo || "").trim();
    if (!nuevoLimpio || nuevoLimpio.length !== 6 || !/^\d{6}$/.test(nuevoLimpio)) {
      return {
        status: "error",
        message: "El nuevo PIN debe contener exactamente 6 dígitos numéricos."
      };
    }

    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Configuración");
    if (!sheet) {
      obtenerOInicializarPin(spreadsheetId);
      sheet = ss.getSheetByName("Configuración");
    }

    var lastRow = sheet.getLastRow();
    var actualizado = false;

    if (lastRow >= 2) {
      var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
      for (var i = 0; i < data.length; i++) {
        if (String(data[i][0]).trim() === "PIN_RECEPTOR") {
          sheet.getRange(i + 2, 2).setValue(nuevoLimpio);
          actualizado = true;
          break;
        }
      }
    }

    if (!actualizado) {
      sheet.appendRow(["PIN_RECEPTOR", nuevoLimpio]);
    }

    return {
      status: "success",
      message: "¡PIN de seguridad actualizado exitosamente!"
    };
  } catch (err) {
    return {
      status: "error",
      message: "Error al cambiar PIN en la hoja: " + err.toString()
    };
  }
}

// Departamentos emisores oficiales de FaCES UCV
var DEPARTAMENTOS_OFICIALES = [
  "Control de Estudios - Pregrado",
  "Control de Estudios - Postgrado",
  "Servicio Comunitario",
  "Biblioteca",
  "Desarrollo Estudiantil",
  "Coordinación de Extensión",
  "Departamento de Compras",
  "Centro de Extensión Profesional",
  "Instituto de Investigaciones"
];

/**
 * EMISOR: Obtiene o inicializa la pestaña Usuarios con los 9 departamentos y PIN 123456
 */
function obtenerOInicializarUsuarios(spreadsheetId) {
  try {
    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Usuarios");
    if (!sheet) {
      sheet = ss.insertSheet("Usuarios");
      sheet.getRange(1, 1, 1, 2).setValues([["Departamento", "PIN"]]).setFontWeight("bold");
      var defaultRows = DEPARTAMENTOS_OFICIALES.map(function(dept) {
        return [dept, "123456"];
      });
      sheet.getRange(2, 1, defaultRows.length, 2).setValues(defaultRows);
      sheet.setFrozenRows(1);
    }
    return sheet;
  } catch (err) {
    console.warn("Error al inicializar Usuarios:", err);
    return null;
  }
}

/**
 * EMISOR: Valida el PIN de un departamento contra la pestaña Usuarios
 */
function validarPinEmisor(departamento, pinIngresado, spreadsheetId) {
  try {
    if (!departamento) {
      return { status: "error", valid: false, message: "Debe especificar el departamento." };
    }

    obtenerOInicializarUsuarios(spreadsheetId);
    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Usuarios");
    if (!sheet || sheet.getLastRow() <= 1) {
      var esValido = String(pinIngresado || "").trim() === "123456";
      return { status: "success", valid: esValido, message: esValido ? "Acceso autorizado." : "PIN incorrecto." };
    }

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    var deptBuscado = String(departamento).trim().toLowerCase();
    var pinAlmacenado = null;

    for (var i = 0; i < data.length; i++) {
      var d = String(data[i][0] || "").trim().toLowerCase();
      if (d === deptBuscado || d.indexOf(deptBuscado) !== -1 || deptBuscado.indexOf(d) !== -1) {
        pinAlmacenado = String(data[i][1] || "").trim();
        break;
      }
    }

    if (!pinAlmacenado) {
      pinAlmacenado = "123456";
    }

    var valido = (String(pinIngresado || "").trim() === pinAlmacenado);
    return {
      status: "success",
      valid: valido,
      message: valido ? "Acceso autorizado." : "PIN incorrecto para " + departamento + "."
    };
  } catch (err) {
    return {
      status: "error",
      valid: false,
      message: "Error al validar PIN del emisor: " + err.toString()
    };
  }
}

/**
 * EMISOR: Cambia el PIN de acceso de un departamento en la pestaña Usuarios
 */
function cambiarPinEmisor(departamento, pinActual, pinNuevo, spreadsheetId) {
  try {
    if (!departamento) {
      return { status: "error", message: "Debe especificar el departamento." };
    }
    var nuevoStr = String(pinNuevo || "").trim();
    if (!/^\d{6}$/.test(nuevoStr)) {
      return { status: "error", message: "El nuevo PIN debe contener exactamente 6 dígitos numéricos." };
    }

    obtenerOInicializarUsuarios(spreadsheetId);
    var ss = getSpreadsheet(spreadsheetId || DEFAULT_STAGING_SPREADSHEET_ID);
    var sheet = ss.getSheetByName("Usuarios");
    if (!sheet) {
      return { status: "error", message: "No se encontró la pestaña Usuarios en la hoja de cálculo." };
    }

    var lastRow = sheet.getLastRow();
    if (lastRow <= 1) {
      return { status: "error", message: "La pestaña Usuarios no contiene registros." };
    }

    var data = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
    var deptBuscado = String(departamento).trim().toLowerCase();
    var filaEncontrada = -1;
    var pinAlmacenado = null;

    for (var i = 0; i < data.length; i++) {
      var d = String(data[i][0] || "").trim().toLowerCase();
      if (d === deptBuscado || d.indexOf(deptBuscado) !== -1 || deptBuscado.indexOf(d) !== -1) {
        filaEncontrada = i + 2;
        pinAlmacenado = String(data[i][1] || "").trim();
        break;
      }
    }

    if (filaEncontrada === -1) {
      return { status: "error", message: "No se encontró el departamento " + departamento + " en Usuarios." };
    }

    if (!pinAlmacenado) {
      pinAlmacenado = "123456";
    }

    var actualStr = String(pinActual || "").trim();
    if (actualStr !== pinAlmacenado) {
      return { status: "error", message: "El PIN actual ingresado es incorrecto." };
    }

    // Actualizar el PIN en la columna 2
    var cell = sheet.getRange(filaEncontrada, 2);
    cell.setNumberFormat('@');
    cell.setValue(nuevoStr);

    return {
      status: "success",
      message: "PIN actualizado exitosamente para " + departamento + "."
    };
  } catch (err) {
    return {
      status: "error",
      message: "Error al cambiar PIN de emisor: " + err.toString()
    };
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
    } else if (payload && payload.action === 'validarPin') {
      responseData = validarPinReceptor(payload.pin, payload.spreadsheetId);
    } else if (payload && payload.action === 'cambiarPin') {
      responseData = cambiarPinReceptor(payload.pinActual, payload.pinNuevo, payload.spreadsheetId);
    } else if (payload && payload.action === 'validarPinEmisor') {
      responseData = validarPinEmisor(payload.departamento, payload.pin, payload.spreadsheetId);
    } else if (payload && payload.action === 'cambiarPinEmisor') {
      responseData = cambiarPinEmisor(payload.departamento, payload.pinActual, payload.pinNuevo, payload.spreadsheetId);
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
