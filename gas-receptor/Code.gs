/**
 * Backend Google Apps Script - Módulo Receptor
 * Proyecto: Automatización de Reportes FaCES - UCV
 * 
 * 1. Lee las transacciones enviadas desde la "Zona de Staging".
 * 2. Busca las tablas correspondientes en el Macro Archivo (Academia, Extensión, Estudiantes, Otros Gastos).
 * 3. Escribe los valores numéricos de las variables sin sobreescribir fórmulas.
 * 4. Actualiza el estado a "Aprobado" en la Zona de Staging.
 */

// ID por defecto del Macro Archivo de FaCES
var DEFAULT_MACRO_SPREADSHEET_ID = "1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju";
var STAGING_SHEET_NAME = "Zona de Staging";

// Mapa de Meses a Índices de Columnas en el Macro Archivo
var MONTH_COLUMN_MAP = {
  "Enero": { col1: 7, col2: 8 },      // Col G, H
  "Febrero": { col1: 10, col2: 11 },   // Col J, K
  "Marzo": { col1: 13, col2: 14 },     // Col M, N
  "Abril": { col1: 16, col2: 17 },     // Col P, Q
  "Mayo": { col1: 19, col2: 20 },      // Col S, T
  "Junio": { col1: 22, col2: 23 },     // Col V, W
  "Julio": { col1: 25, col2: 26 },     // Col Y, Z
  "Agosto": { col1: 28, col2: 29 },    // Col \, ]
  "Septiembre": { col1: 30, col2: 31 },// Col ^, _
  "Octubre": { col1: 34, col2: 35 },   // Col b, c
  "Noviembre": { col1: 37, col2: 38 }, // Col e, f
  "Diciembre": { col1: 40, col2: 41 }  // Col h, i
};

/**
 * Obtiene la Hoja de Cálculo del Macro Archivo por ID o activa
 */
function getMacroSpreadsheet(spreadsheetId) {
  var targetId = spreadsheetId || DEFAULT_MACRO_SPREADSHEET_ID;
  if (targetId && targetId.trim() !== "") {
    try {
      return SpreadsheetApp.openById(targetId);
    } catch (e) {
      console.warn("No se pudo abrir por ID, intentando getActiveSpreadsheet:", e);
    }
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
 * Busca y escribe los datos aprobados de un reporte en el Macro Archivo
 */
function escribirReporteEnMacroArchivo(payload, spreadsheetId) {
  try {
    if (!payload || !payload.registros || !Array.isArray(payload.registros)) {
      throw new Error("Payload inválido o sin registros para escribir.");
    }

    var ss = getMacroSpreadsheet(spreadsheetId);
    if (!ss) {
      throw new Error("No se pudo acceder a la hoja de cálculo del Macro Archivo.");
    }

    var mesReportado = payload.mes_reportado || "Enero";
    var colInfo = MONTH_COLUMN_MAP[mesReportado] || MONTH_COLUMN_MAP["Enero"];
    var celdasEscritas = 0;

    // Recorrer los registros del payload (hoja_destino, bloque, detalles)
    payload.registros.forEach(function(registro) {
      var nombreHoja = registro.hoja_destino;
      var sheet = ss.getSheetByName(nombreHoja);
      
      if (!sheet) {
        console.warn("Hoja no encontrada en el Macro Archivo:", nombreHoja);
        return;
      }

      var lastRow = sheet.getLastRow();
      if (lastRow <= 1) return;

      // Obtener todos los valores de la columna A (nombres de sub-bloques / carreras / actividades)
      var colAValues = sheet.getRange(1, 1, lastRow, 1).getValues();

      registro.detalles.forEach(function(detalle) {
        var nombreBuscado = (detalle.sub_bloque || detalle.actividad || "").toString().trim().toLowerCase();
        if (!nombreBuscado) return;

        // Buscar la fila cuyo texto coincida con la carrera o actividad
        var targetRowIndex = -1;
        for (var r = 0; r < colAValues.length; r++) {
          var valA = String(colAValues[r][0] || "").trim().toLowerCase();
          if (valA && (valA === nombreBuscado || valA.indexOf(nombreBuscado) !== -1 || nombreBuscado.indexOf(valA) !== -1)) {
            targetRowIndex = r + 1;
            break;
          }
        }

        // Si se encontró la fila correspondiente en la tabla del Macro Archivo
        if (targetRowIndex > 0 && detalle.variables) {
          var vars = detalle.variables;
          var val1 = vars.nuevos_ingresos || vars.nro_actividades || vars.nro_proyectos || vars.nro_acompanamientos_realizados || vars.estudiantes_atendidos || 0;
          var val2 = vars.egresados || vars.nro_beneficiados || vars.nro_personas_beneficiadas || vars.nro_estudiantes || 0;

          // Escribir en la celda del mes correspondiente sin tocar fórmulas de totales
          sheet.getRange(targetRowIndex, colInfo.col1).setValue(val1);
          if (colInfo.col2 && val2 > 0) {
            sheet.getRange(targetRowIndex, colInfo.col2).setValue(val2);
          }
          celdasEscritas++;
        }
      });
    });

    // Actualizar estado en la Zona de Staging
    actualizarEstadoStaging(ss, payload.id_transaccion, "Aprobado");

    return {
      status: "success",
      id_transaccion: payload.id_transaccion,
      celdas_actualizadas: celdasEscritas,
      message: "Reporte " + (payload.id_transaccion || "") + " aprobado y escrito exitosamente en el Macro Archivo."
    };
  } catch (err) {
    return {
      status: "error",
      message: "Error al escribir en el Macro Archivo: " + err.toString()
    };
  }
}

/**
 * Actualiza el estado de una transacción en la pestaña "Zona de Staging"
 */
function actualizarEstadoStaging(ss, idTransaccion, nuevoEstado) {
  try {
    if (!idTransaccion) return;
    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) return;

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(idTransaccion).trim()) {
        sheet.getRange(i + 2, 4).setValue(nuevoEstado); // Columna 4 es "Estado"
        break;
      }
    }
  } catch (e) {
    console.warn("No se pudo actualizar estado en Staging:", e);
  }
}

/**
 * Endpoint HTTP GET para consulta de la Zona de Staging
 */
function doGet(e) {
  var spreadsheetId = (e && e.parameter && e.parameter.spreadsheetId) ? e.parameter.spreadsheetId : null;
  var ss = getMacroSpreadsheet(spreadsheetId);
  var sheet = ss.getSheetByName(STAGING_SHEET_NAME);

  if (!sheet || sheet.getLastRow() <= 1) {
    return ContentService.createTextOutput(JSON.stringify({ status: "success", reportes: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
  var reportes = data.map(function(row) {
    var payload = {};
    try { payload = JSON.parse(row[4]); } catch (err) { payload = { raw: row[4] }; }
    return {
      id_transaccion: row[0],
      fecha_emision: row[1],
      departamento_emisor: row[2],
      estado: row[3],
      payload: payload
    };
  }).filter(function(r) {
    return r.id_transaccion && String(r.id_transaccion).indexOf("REQ-") === 0;
  }).reverse();

  return ContentService.createTextOutput(JSON.stringify({ status: "success", reportes: reportes }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * RECEPTOR: Borra todas las filas de la Zona de Staging (conservando encabezados)
 */
function limpiarStagingSheet(spreadsheetId) {
  try {
    var ss = getMacroSpreadsheet(spreadsheetId || DEFAULT_MACRO_SPREADSHEET_ID);
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

    var ss = getMacroSpreadsheet(spreadsheetId || DEFAULT_MACRO_SPREADSHEET_ID);
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
    var ss = getMacroSpreadsheet(spreadsheetId || DEFAULT_MACRO_SPREADSHEET_ID);
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
 * Endpoint HTTP POST para acciones del Módulo Receptor (Aprobar y Escribir)
 */
function doPost(e) {
  var responseData;
  try {
    var payload = {};
    if (e && e.postData && e.postData.contents) {
      try { payload = JSON.parse(e.postData.contents); } catch(err) {}
    }

    if (payload.action === 'aprobarReporte') {
      responseData = escribirReporteEnMacroArchivo(payload.payload || payload, payload.spreadsheetId);
    } else if (payload.action === 'limpiarStaging') {
      responseData = limpiarStagingSheet(payload.spreadsheetId);
    } else if (payload.action === 'eliminarReporteStaging') {
      responseData = eliminarReporteStaging(payload.id_transaccion, payload.spreadsheetId);
    } else if (payload.action === 'validarPin') {
      responseData = validarPinReceptor(payload.pin, payload.spreadsheetId);
    } else {
      responseData = { status: "error", message: "Acción no reconocida" };
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
