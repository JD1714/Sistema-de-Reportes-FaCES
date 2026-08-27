/**
 * Backend Google Apps Script - FaCES UCV (Staging & Macro Archivo)
 */

var DEFAULT_MACRO_SPREADSHEET_ID = "1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju";
var DEFAULT_STAGING_SPREADSHEET_ID = "18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4";
var STAGING_SHEET_NAME = "Zona de Staging";

var STAGING_HEADERS = [
  "ID_Transaccion",
  "Fecha_Emision",
  "Departamento_Emisor",
  "Estado",
  "Payload_Datos"
];

var MONTH_COLUMN_MAP = {
  "Enero": { col1: 7, col2: 8 },
  "Febrero": { col1: 10, col2: 11 },
  "Marzo": { col1: 13, col2: 14 },
  "Abril": { col1: 16, col2: 17 },
  "Mayo": { col1: 19, col2: 20 },
  "Junio": { col1: 22, col2: 23 },
  "Julio": { col1: 25, col2: 26 },
  "Agosto": { col1: 28, col2: 29 },
  "Septiembre": { col1: 30, col2: 31 },
  "Octubre": { col1: 34, col2: 35 },
  "Noviembre": { col1: 37, col2: 38 },
  "Diciembre": { col1: 40, col2: 41 }
};

// Mapeo flexible de palabras clave a texto oficial en las filas del Macro Archivo
function matchKeywordInText(searchedText, textInRow) {
  var s = searchedText.toLowerCase();
  var r = textInRow.toLowerCase();

  // Match directo de substring
  if (r.indexOf(s) !== -1 || s.indexOf(r) !== -1) return true;

  // Normalización para Carreras de Control de Estudios (Pregrado y Postgrado)
  if ((s.indexOf("administrador") !== -1 || s.indexOf("contador") !== -1) && (r.indexOf("administración") !== -1 || r.indexOf("contaduría") !== -1)) return true;
  if (s.indexOf("economista") !== -1 && r.indexOf("economía") !== -1) return true;
  if ((s.indexOf("estadista") !== -1 || s.indexOf("actuario") !== -1) && (r.indexOf("estadística") !== -1 || r.indexOf("actuarial") !== -1)) return true;
  if (s.indexOf("internacionalista") !== -1 && r.indexOf("estudios internacionales") !== -1) return true;
  if (s.indexOf("sociól") !== -1 && r.indexOf("sociología") !== -1) return true;
  if (s.indexOf("trabajador") !== -1 && r.indexOf("trabajo social") !== -1) return true;
  if (s.indexOf("antropól") !== -1 && r.indexOf("antropología") !== -1) return true;

  // Normalización para Biblioteca y Providencias Estudiantiles
  if ((s.indexOf("biblioteca") !== -1 || s.indexOf("atención") !== -1 || s.indexOf("atendidos") !== -1) && r.indexOf("atención de los estudiantes") !== -1) return true;

  return false;
}

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

function escribirReporteEnMacroArchivo(payload, spreadsheetId) {
  try {
    if (!payload || !payload.registros || !Array.isArray(payload.registros)) {
      throw new Error("Payload inválido o sin registros para escribir.");
    }

    var macroSs = getSpreadsheet(spreadsheetId || DEFAULT_MACRO_SPREADSHEET_ID);
    var stagingSs = getSpreadsheet(DEFAULT_STAGING_SPREADSHEET_ID);

    var mesReportado = payload.mes_reportado || "Enero";
    var colInfo = MONTH_COLUMN_MAP[mesReportado] || MONTH_COLUMN_MAP["Enero"];
    var celdasEscritas = 0;

    payload.registros.forEach(function(registro) {
      var nombreHoja = registro.hoja_destino;
      var targetSheet = macroSs.getSheetByName(nombreHoja);
      
      // Hojas donde buscar
      var sheetsToSearch = [];
      if (targetSheet) {
        sheetsToSearch.push(targetSheet);
      }
      var allSheets = macroSs.getSheets();
      for (var s = 0; s < allSheets.length; s++) {
        if (allSheets[s].getName() !== STAGING_SHEET_NAME && (!targetSheet || allSheets[s].getName() !== targetSheet.getName())) {
          sheetsToSearch.push(allSheets[s]);
        }
      }

      registro.detalles.forEach(function(detalle) {
        var nombreBuscado = (detalle.sub_bloque || detalle.actividad || detalle.descripcion_item || detalle.descripcion || "").toString().trim();
        if (!nombreBuscado) return;

        var foundSheet = null;
        var targetRowIndex = -1;

        // 1. Buscar coincidencia exacta o por palabras clave en las hojas
        for (var shIdx = 0; shIdx < sheetsToSearch.length; shIdx++) {
          var currSheet = sheetsToSearch[shIdx];
          if (currSheet.getLastRow() <= 1) continue;

          var rowRange = currSheet.getRange(1, 1, currSheet.getLastRow(), 5).getValues();
          for (var r = 0; r < rowRange.length; r++) {
            var textInRow = rowRange[r].join(" ");
            if (textInRow && matchKeywordInText(nombreBuscado, textInRow)) {
              targetRowIndex = r + 1;
              foundSheet = currSheet;
              break;
            }
          }
          if (targetRowIndex > 0) break;
        }

        // 2. Si no se encontró fila fija pero hay hoja destino, buscar la primera fila disponible del bloque
        if (targetRowIndex === -1 && targetSheet && targetSheet.getLastRow() > 1) {
          foundSheet = targetSheet;
          // Buscar fila disponible (con ceros o vacía)
          var rowsInTarget = targetSheet.getRange(1, 1, targetSheet.getLastRow(), 5).getValues();
          for (var r = 0; r < rowsInTarget.length; r++) {
            var textInRow = rowsInTarget[r].join(" ").toLowerCase();
            if (textInRow.indexOf("describa la actividad") !== -1 || textInRow.indexOf("descripción") !== -1) {
              targetRowIndex = r + 2; // Fila justo después del encabezado
              break;
            }
          }
        }

        // Escribir valores en el Macro Archivo
        if (foundSheet && targetRowIndex > 0 && detalle.variables) {
          var vars = detalle.variables;
          var val1 = vars.nuevos_ingresos || vars.nro_actividades || vars.nro_proyectos || vars.nro_acompanamientos_realizados || vars.estudiantes_atendidos || vars.nro_eventos || 0;
          var val2 = vars.egresados || vars.nro_beneficiados || vars.nro_personas_beneficiadas || vars.nro_estudiantes || vars.usuarios_beneficiados || 0;

          // Si la fila estaba vacía, escribir la descripción en Columna A/B
          var currentValColA = String(foundSheet.getRange(targetRowIndex, 1).getValue() || "").trim();
          if (!currentValColA || currentValColA === "0") {
            foundSheet.getRange(targetRowIndex, 1).setValue(nombreBuscado);
          }

          foundSheet.getRange(targetRowIndex, colInfo.col1).setValue(val1);
          if (colInfo.col2 && val2 > 0) {
            foundSheet.getRange(targetRowIndex, colInfo.col2).setValue(val2);
          }
          celdasEscritas++;
        }
      });
    });

    actualizarEstadoStaging(stagingSs, payload.id_transaccion, "Aprobado");

    return {
      status: "success",
      id_transaccion: payload.id_transaccion,
      celdas_actualizadas: celdasEscritas,
      message: "Reporte " + (payload.id_transaccion || "") + " aprobado y escrito exitosamente en el Macro Archivo (" + celdasEscritas + " métricas actualizadas)."
    };
  } catch (err) {
    return { status: "error", message: "Error en Macro Archivo: " + err.toString() };
  }
}

function actualizarEstadoStaging(ss, idTransaccion, nuevoEstado) {
  try {
    if (!idTransaccion || !ss) return;
    var sheet = ss.getSheetByName(STAGING_SHEET_NAME);
    if (!sheet || sheet.getLastRow() <= 1) return;

    var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
    for (var i = 0; i < data.length; i++) {
      if (String(data[i][0]).trim() === String(idTransaccion).trim()) {
        sheet.getRange(i + 2, 4).setValue(nuevoEstado);
        break;
      }
    }
  } catch (e) {
    console.warn("No se pudo actualizar estado en Staging:", e);
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
      responseData = escribirReporteEnMacroArchivo(payload.payload || payload, payload.spreadsheetId);
    } else {
      responseData = guardarReporteEnStaging(payload);
    }
  } catch (err) {
    responseData = { status: "error", message: "Error: " + err.toString() };
  }

  return ContentService.createTextOutput(JSON.stringify(responseData))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var html = "<h1>Backend FaCES UCV (Staging & Macro Archivo)</h1><p>Estado: Activo.</p>";
  return ContentService.createTextOutput(html).setMimeType(ContentService.MimeType.TEXT);
}
