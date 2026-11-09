const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ShadingType,
  ImageRun
} = require('docx');

// Paleta institucional FaCES
const COLOR_PRIMARY = '1E3A8A';   // Azul marino UCV
const COLOR_SECONDARY = '2563EB'; // Azul institucional
const COLOR_DARK = '0F172A';      // Slate oscuro para textos principales
const COLOR_MUTED = '475569';     // Slate gris para notas y subtítulos
const COLOR_BORDER = 'CBD5E1';    // Borde de tablas y cajas
const COLOR_BG_LIGHT = 'F8FAFC';  // Fondo gris suave para tablas y cards
const COLOR_SUCCESS = '10B981';   // Verde para comprobantes y copiado
const COLOR_AMBER = 'F59E0B';     // Ámbar para advertencias

function createCover(title, subtitle, tag, desc, destinatarios, version) {
  return [
    new Paragraph({
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: 'UNIVERSIDAD CENTRAL DE VENEZUELA',
          bold: true,
          size: 26,
          color: COLOR_PRIMARY,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 600 },
      children: [
        new TextRun({
          text: 'Facultad de Ciencias Económicas y Sociales • Sistema Institucional de Reportes',
          size: 20,
          color: COLOR_MUTED,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({
          text: `[ ${tag.toUpperCase()} ]`,
          bold: true,
          size: 18,
          color: COLOR_SECONDARY,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 200 },
      children: [
        new TextRun({
          text: title,
          bold: true,
          size: 44,
          color: COLOR_DARK,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: subtitle,
          bold: true,
          size: 24,
          color: COLOR_SECONDARY,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { after: 800 },
      alignment: AlignmentType.JUSTIFIED,
      children: [
        new TextRun({
          text: desc,
          size: 21,
          color: COLOR_MUTED,
          font: 'Segoe UI'
        })
      ]
    }),
    new Paragraph({
      spacing: { before: 1200, after: 100 },
      border: { top: { style: BorderStyle.SINGLE, size: 8, color: COLOR_BORDER } },
      children: [
        new TextRun({ text: 'Destinatarios: ', bold: true, size: 19, color: COLOR_DARK, font: 'Segoe UI' }),
        new TextRun({ text: destinatarios, size: 19, color: COLOR_MUTED, font: 'Segoe UI' })
      ]
    }),
    new Paragraph({
      spacing: { after: 100 },
      children: [
        new TextRun({ text: 'Versión del Sistema: ', bold: true, size: 19, color: COLOR_DARK, font: 'Segoe UI' }),
        new TextRun({ text: version, size: 19, color: COLOR_MUTED, font: 'Segoe UI' })
      ]
    }),
    new Paragraph({
      spacing: { after: 300 },
      children: [
        new TextRun({ text: 'Fecha de Emisión: ', bold: true, size: 19, color: COLOR_DARK, font: 'Segoe UI' }),
        new TextRun({ text: 'Noviembre 2026 (Oficial / Vigente)', size: 19, color: COLOR_MUTED, font: 'Segoe UI' })
      ],
      pageBreakBefore: false
    }),
    new Paragraph({
      text: '',
      pageBreakBefore: true
    })
  ];
}

function createH1(title) {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 12, color: COLOR_PRIMARY } },
    run: {
      bold: true,
      size: 28,
      color: COLOR_PRIMARY,
      font: 'Segoe UI'
    }
  });
}

function createH2(title) {
  return new Paragraph({
    text: title,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 120 },
    run: {
      bold: true,
      size: 23,
      color: COLOR_PRIMARY,
      font: 'Segoe UI'
    }
  });
}

function createP(text, boldPrefix = '') {
  const runs = [];
  if (boldPrefix) {
    runs.push(new TextRun({ text: boldPrefix, bold: true, size: 21, color: COLOR_DARK, font: 'Segoe UI' }));
  }
  runs.push(new TextRun({ text, size: 21, color: COLOR_DARK, font: 'Segoe UI' }));

  return new Paragraph({
    spacing: { after: 140 },
    alignment: AlignmentType.JUSTIFIED,
    children: runs
  });
}

function createBullet(text, boldPrefix = '') {
  const runs = [];
  if (boldPrefix) {
    runs.push(new TextRun({ text: boldPrefix, bold: true, size: 21, color: COLOR_DARK, font: 'Segoe UI' }));
  }
  runs.push(new TextRun({ text, size: 21, color: COLOR_DARK, font: 'Segoe UI' }));

  return new Paragraph({
    bullet: { level: 0 },
    spacing: { after: 100 },
    alignment: AlignmentType.JUSTIFIED,
    children: runs
  });
}

function createCallout(title, text, borderColor = COLOR_PRIMARY) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.NONE },
      right: { style: BorderStyle.NONE },
      bottom: { style: BorderStyle.NONE },
      left: { style: BorderStyle.SINGLE, size: 24, color: borderColor }
    },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            shading: { fill: 'F1F5F9', type: ShadingType.CLEAR },
            margins: { top: 120, bottom: 120, left: 180, right: 180 },
            children: [
              new Paragraph({
                spacing: { after: 60 },
                children: [new TextRun({ text: title, bold: true, size: 21, color: COLOR_DARK, font: 'Segoe UI' })]
              }),
              new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [new TextRun({ text, size: 20, color: COLOR_MUTED, font: 'Segoe UI' })]
              })
            ]
          })
        ]
      })
    ]
  });
}

function createImageBlock(filename, caption, width = 520, height = 334) {
  const imgPath = path.resolve('scripts', 'screenshots', filename);
  if (!fs.existsSync(imgPath)) {
    return [new Paragraph({ text: `[Imagen no encontrada: ${filename}]` })];
  }

  const imgBuffer = fs.readFileSync(imgPath);

  return [
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 60 },
      children: [
        new ImageRun({
          data: imgBuffer,
          transformation: { width, height }
        })
      ]
    }),
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 220 },
      children: [
        new TextRun({
          text: caption,
          italics: true,
          size: 18,
          color: COLOR_MUTED,
          font: 'Segoe UI'
        })
      ]
    })
  ];
}

function createTableBlock(headers, rows, colWidths = [30, 30, 40]) {
  const headerCells = headers.map((h, i) =>
    new TableCell({
      width: { size: colWidths[i], type: WidthType.PERCENTAGE },
      shading: { fill: 'E2E8F0', type: ShadingType.CLEAR },
      margins: { top: 100, bottom: 100, left: 120, right: 120 },
      children: [
        new Paragraph({
          children: [new TextRun({ text: h, bold: true, size: 20, color: COLOR_DARK, font: 'Segoe UI' })]
        })
      ]
    })
  );

  const tableRows = [new TableRow({ children: headerCells })];

  rows.forEach((r, rowIdx) => {
    const fill = rowIdx % 2 === 1 ? 'F8FAFC' : 'FFFFFF';
    const cells = r.map((c, i) =>
      new TableCell({
        width: { size: colWidths[i], type: WidthType.PERCENTAGE },
        shading: { fill, type: ShadingType.CLEAR },
        margins: { top: 90, bottom: 90, left: 120, right: 120 },
        children: [
          new Paragraph({
            children: [new TextRun({ text: c, size: 19, color: COLOR_DARK, font: 'Segoe UI' })]
          })
        ]
      })
    );
    tableRows.push(new TableRow({ children: cells }));
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      left: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      right: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: COLOR_BORDER }
    },
    rows: tableRows
  });
}

// -------------------------------------------------------------
// GENERAR MANUAL EMISOR (.DOCX)
// -------------------------------------------------------------
async function generateEmisorDocx() {
  console.log('Generando Manual_Usuario_Emisor_FaCES.docx...');

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
          }
        },
        children: [
          ...createCover(
            'Manual de Usuario: Módulo Emisor',
            'Registro y Envío Ágil de Métricas Académico-Administrativas',
            'Guía Práctica Departamental',
            'Este documento proporciona una guía visual, rápida y práctica para el personal de secretarías, coordinaciones e institutos de la Facultad. Detalla el procedimiento directo para acceder a la plataforma institucional, seleccionar su departamento sin necesidad de contraseñas, completar el formulario mensual y generar su comprobante digital de entrega.',
            'Secretarías, Escuelas, Coordinaciones e Institutos de FaCES',
            '2.1 (Acceso Directo y Despliegue Autónomo)'
          ),

          createH1('1. Introducción y Beneficios del Sistema'),
          createP('El Sistema de Reportes FaCES fue desarrollado para modernizar y agilizar la recolección periódica de datos estadísticos y administrativos de las distintas dependencias de la Facultad de Ciencias Económicas y Sociales (UCV).'),
          createP('Tradicionalmente, la consolidación requería transcribir datos de forma manual directamente sobre un macro archivo de cálculo compartido, lo cual generaba riesgos de sobrescritura accidental de fórmulas, pérdida de información y retrasos operativos. La nueva plataforma soluciona estos inconvenientes mediante un entorno web visual y seguro.'),
          createCallout(
            '✨ Ventajas Principales para su Departamento:',
            '• Acceso Directo sin Contraseñas: Ya no requiere memorizar ni gestionar claves o PINes. Basta con ingresar y pulsar sobre el nombre de su departamento.\n• Formularios a Medida: Cada dependencia visualiza exclusivamente los campos y carreras que le competen.\n• Comprobante Digital Único: Cada envío genera al instante un identificador alfanumérico irrepetible (ej. REQ-20261109-A4K2), el cual garantiza la recepción formal de su informe.\n• Protección Total: Usted no tiene que interactuar con hojas de cálculo pesadas ni manipular celdas institucionales protegidas.',
            COLOR_SUCCESS
          ),

          createH1('2. Acceso al Sistema y Selección de Rol (Hub)'),
          createP('Para ingresar, abra el enlace institucional provisto por la Administración en su navegador web (Chrome, Edge, Firefox u Opera) o abra la opción "🏛️ Sistema FaCES" si se encuentra dentro de Google Sheets.'),
          createP('La pantalla de bienvenida (Hub Principal) le presentará dos portales. Debe hacer clic en el botón azul "Acceder como Emisor" ubicado en la tarjeta izquierda:'),
          ...createImageBlock('01_hub_principal.png', 'Figura 1: Pantalla principal (Hub). Haga clic en "Acceder como Emisor" para ingresar a los formularios.'),

          createH1('3. Selección Directa de su Departamento'),
          createP('Al pulsar "Acceder como Emisor", se desplegará el catálogo oficial con las 9 dependencias de la facultad. Ubique la casilla correspondiente a su oficina y haga clic directamente sobre ella:'),
          ...createImageBlock('02_emisor_seleccion_departamentos.png', 'Figura 2: Cuadrícula con los 9 departamentos oficiales. Selección directa en un solo clic.'),

          createTableBlock(
            ['Departamento', 'Icono', 'Área de Enfoque Principal'],
            [
              ['Control de Estudios - Pregrado', '🎓 Birrete', 'Métricas de nuevo ingreso, egresados y retiros en las 7 carreras.'],
              ['Control de Estudios - Postgrado', '🏛️ Fachada', 'Especializaciones, Maestrías y Doctorados.'],
              ['Servicio Comunitario', '🤝 Manos', 'Proyectos de labor social y requisitos de graduación.'],
              ['Biblioteca', '📚 Libros', 'Atención a usuarios en sala de lectura y talleres de alfabetización.'],
              ['Desarrollo Estudiantil', '🌱 Planta', 'Orientación académica, asesorías y programas de bienestar.'],
              ['Coordinación de Extensión', '📣 Megáfono', 'Actividades socio-culturales, deportivas y actualización curricular.'],
              ['Departamento de Compras', '🛒 Carrito', 'Gestión administrativa y conservación de infraestructura.'],
              ['Centro de Extensión Profesional', '💼 Maletín', 'Acompañamiento profesional y formación continua.'],
              ['Instituto de Investigaciones', '🔬 Microscopio', 'Investigación científica y tecnologías para la enseñanza.']
            ],
            [35, 20, 45]
          ),

          createH1('4. Llenado del Formulario Mensual'),
          createP('Una vez seleccionado su departamento, el sistema cargará su formulario a la medida:'),
          createBullet('Seleccionar el Mes a Reportar: En la parte superior del formulario encontrará el menú desplegable con los meses del año (ej. Enero, Febrero, Octubre). Seleccione el período que está rindiendo.', 'Paso 1: '),
          createBullet('Ingresar los Datos Numéricos: Rellene los campos con las cifras oficiales de su oficina. Los campos aceptan números enteros positivos. Si para alguna variable no hubo movimiento en ese mes, conserve el valor en 0.', 'Paso 2: '),
          createBullet('Manejo de Casillas Dinámicas: En departamentos con pestañas o actividades múltiples (como Servicio Comunitario, Compras o Instituto de Investigaciones), puede agregar renglones de descripción o marcar la casilla "Nada que reportar en esta sección" si no se realizaron actividades.', 'Paso 3: '),
          ...createImageBlock('03_emisor_formulario_pregrado.png', 'Figura 3: Formulario especializado de Pregrado, estructurado por carreras y variables mensuales.'),
          ...createImageBlock('04_emisor_formulario_servicio_comunitario.png', 'Figura 4: Formulario con pestañas y casillas opcionales de reporte ("Nada que reportar").'),

          createH1('5. Envío y Generación de Comprobante'),
          createP('Al completar la carga de datos, diríjase al final de la página y haga clic en el botón azul "Enviar Reporte".'),
          createCallout(
            '⏳ Control Automático de Doble Clic:',
            'Para evitar envíos repetidos por doble pulsación accidental, el botón se desactiva de inmediato y mostrará un círculo animado con el mensaje "Enviando a Staging..." mientras los datos se registran en los servidores de Google Workspace. Espere un par de segundos.',
            COLOR_AMBER
          ),
          createP('Una vez procesado exitosamente, la pantalla le mostrará una ventana emergente de confirmación con los detalles de su entrega:'),
          createCallout(
            '📋 Comprobante Digital de Transacción:',
            '✅ ¡Reporte registrado exitosamente en la Zona de Staging!\n\n• ID Transacción: REQ-20261109-A4K2\n• Departamento: Control de Estudios - Pregrado\n• Estado: Pendiente de Revisión\n• Fecha: 09/11/2026, 10:15:24 AM',
            COLOR_PRIMARY
          ),
          createP('¿Desea reportar otro mes o cambiar de oficina? En la esquina superior derecha dispone de dos botones en todo momento:'),
          createBullet('← Cambiar Departamento: Le permite regresar a la lista de las 9 oficinas para enviar el reporte de otra coordinación sin cerrar la aplicación.'),
          createBullet('← Volver al Hub: Le regresa a la pantalla de bienvenida principal del sistema.'),

          createH1('6. Preguntas Frecuentes (FAQ)'),
          createP('No se preocupe. La información no cae directamente en el libro final de producción, sino en la Zona de Staging para ser auditada por la Administración. Puede enviar un nuevo reporte con las cifras corregidas o notificar al Administrador para que realice el ajuste antes de aprobarlo.', '¿Qué hago si me equivoqué en una cifra después de enviar el reporte? '),
          createP('Sí. La plataforma está totalmente adaptada para dispositivos móviles. Puede abrir el enlace desde cualquier navegador móvil y los formularios se adaptarán al tamaño de su pantalla.', '¿Puedo enviar reportes desde mi teléfono móvil o tablet? '),
          createP('Sí. Para no dañar las fórmulas del macro archivo institucional, el formulario emisor no le pide calcular sumatorias ni totales generales. Usted solo registra los valores brutos de cada variable y el sistema institucional calcula las sumatorias de manera automática.', '¿El sistema calcula automáticamente los totales? ')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Manual_Usuario_Emisor_FaCES.docx', buffer);
  console.log(`✓ Creado exitosamente: Manual_Usuario_Emisor_FaCES.docx (${(buffer.length / 1024).toFixed(1)} KB)`);
}

// -------------------------------------------------------------
// GENERAR MANUAL RECEPTOR (.DOCX)
// -------------------------------------------------------------
async function generateReceptorDocx() {
  console.log('Generando Manual_Usuario_Receptor_FaCES.docx...');

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 1000, bottom: 1000, left: 1000, right: 1000 }
          }
        },
        children: [
          ...createCover(
            'Manual de Usuario: Módulo Receptor (Revisor)',
            'Auditoría, Copiado Inteligente y Consolidación en la Hoja Institucional',
            'Manual Técnico-Operativo para Coordinadores y Revisores',
            'Guía integral y detallada para el personal de administración y revisión. Abarca desde la autenticación mediante PIN Maestro de 6 dígitos, la supervisión de la Zona de Staging en tiempo real, el procedimiento asistido de Copiado Inteligente para la inyección vertical de métricas sin tocar fórmulas institucionales, hasta la aprobación formal y el mantenimiento anual de la base de datos.',
            'Coordinadores de Planificación, Decanato y Administradores de FaCES',
            '2.1 (Seguridad Maestro, Staging y Asistencia de Pegado)'
          ),

          createH1('1. Arquitectura y Filosofía del Sistema'),
          createP('El macro archivo institucional "Seguimiento Físico" de la FaCES UCV es una herramienta compleja que contiene múltiples hojas especializadas (Academia, Extensión, Investigación, Estudiantes y Otros Gastos) con cabeceras jerárquicas multinivel, matrices por mes y fórmulas de consolidación matemática muy sensibles.'),
          createP('En el modelo operativo anterior, la manipulación de este archivo por diversos usuarios provocaba con frecuencia el borrado accidental de fórmulas y el desalineamiento de celdas. Para erradicar este problema definitivamente, el sistema fue diseñado bajo una arquitectura desacoplada en tres capas:'),
          createCallout(
            '🏛️ Las Tres Capas de la Solución Institucional:',
            '1. Capa de Captura (Portal Emisor): Formularios limpios donde las secretarías cargan únicamente valores numéricos directos sin tener acceso ni conocimiento del archivo de cálculo final.\n2. Capa de Aislamiento (Zona de Staging): Base de datos intermedia que actúa como un Firewall (cortafuegos). Los envíos quedan almacenados en espera de auditoría humana con identificador único (ID de transacción).\n3. Capa de Consolidación Asistida (Módulo Receptor): Dashboard administrativo donde el Revisor inspecciona la data, valida su coherencia y, mediante la herramienta de Copiado Inteligente, pega bloques completos de métricas en la hoja institucional de forma instantánea sin riesgo de dañar fórmulas.',
            COLOR_PRIMARY
          ),

          createTableBlock(
            ['Componente', 'Ubicación / Tecnología', 'Rol de Seguridad'],
            [
              ['Hub & Emisor', 'SPA Web / HTML Autónomo', 'Acceso abierto a secretarías para carga departamental. Cero acceso al archivo maestro.'],
              ['Zona de Staging', 'Pestaña oculta en Sheets', 'Almacena payloads en JSON con sellos de tiempo y estado de revisión.'],
              ['Dashboard Receptor', 'Interfaz privada con PIN', 'Solo accesible por la Administración para auditar y autorizar transacciones.'],
              ['Copiado Inteligente', 'Portapapeles vertical', 'Formatea vectores de datos con saltos de línea para pegado directo en 1 segundo.']
            ],
            [25, 35, 40]
          ),

          createH1('2. Acceso Seguro y Autenticación con PIN Maestro'),
          createP('El módulo receptor contiene funciones privilegiadas (auditoría, edición local, aprobación de datos y purga de base de datos). Por ende, su acceso se encuentra resguardado bajo un estricto control de seguridad por PIN numérico de 6 dígitos.'),
          createBullet('Ingreso desde el Hub: En la pantalla de bienvenida, pulse el botón azul oscuro "Acceder como Revisor".', 'Paso 1: '),
          ...createImageBlock('01_hub_principal.png', 'Figura 1: Selección de portal en el Hub Institucional. Pulse "Acceder como Revisor".'),
          createBullet('Digitación del PIN Maestro: Ingrese la clave de 6 dígitos numéricos. Puede utilizar el teclado físico de su computador o hacer clic sobre las teclas en pantalla. El sistema incluye avance y retroceso automático de cursor.', 'Paso 2: '),
          ...createImageBlock('05_receptor_login_pin.png', 'Figura 2: Interfaz segura de autenticación del receptor con PIN maestro.'),
          createCallout(
            '🔑 PIN Maestro Inicial:',
            'El sistema viene configurado de fábrica con el PIN maestro 123456. Este valor se encuentra respaldado en la celda B2 de la pestaña "Configuración" de la hoja de cálculo. En la Sección 5 de este manual se explica cómo cambiarlo por una clave secreta personalizada.',
            COLOR_AMBER
          ),

          createH1('3. El Dashboard Administrativo en Detalle'),
          createP('Al autenticarse con éxito, se despliega el panel de control del Revisor. La interfaz ha sido organizada en bloques ergonómicos para agilizar la labor de inspección:'),
          ...createImageBlock('06_receptor_dashboard_principal.png', 'Figura 3: Panel administrativo con tarjetas de conteo, barra de filtros y listado de transacciones de Staging.'),

          createH2('3.1. Tarjetas de Resumen de Métricas'),
          createBullet('Total de Reportes: Número acumulado de transacciones registradas en la Zona de Staging.'),
          createBullet('Pendientes de Revisión (Ámbar): Reportes enviados por los departamentos que aún no han sido consolidados en el macro archivo institucional.'),
          createBullet('Aprobados (Verde): Reportes que ya fueron auditados, copiados al macro archivo y marcados como listos.'),

          createH2('3.2. Herramientas de Búsqueda y Filtrado Rápido'),
          createBullet('Botones de Estado: Permiten alternar instantáneamente entre la vista de "Todos", solo "Pendiente de Revisión" o únicamente "Aprobado".'),
          createBullet('Buscador Inteligente: Permite localizar reportes en milisegundos digitando parte del código (ej. REQ-20261109) o el nombre del departamento (ej. "Pregrado" o "Biblioteca").'),
          createBullet('Botón 🔄 Recargar: Consulta nuevamente la hoja de cálculo en segundo plano para verificar si han entrado reportes nuevos de las secretarías.'),
          createBullet('Botón 🔒 Bloquear: Cierra inmediatamente la sesión activa en el navegador y solicita el PIN nuevamente para evitar accesos desatendidos.'),

          createH1('4. Auditoría y Herramienta de "Copiado Inteligente"'),
          createP('Esta es la función nuclear del sistema y la mayor innovación para proteger el macro archivo institucional. Para abrirla, haga clic en el botón azul "Revisar y Copiar Datos" en cualquiera de las filas de reporte:'),
          ...createImageBlock('07_receptor_modal_auditoria_detalle.png', 'Figura 4: Modal de auditoría con la herramienta de Copiado Inteligente (botones verdes) y desglose de métricas.'),

          createH2('4.1. Anatomía del Modal de Auditoría'),
          createBullet('Encabezado de Transacción: Muestra el ID único oficial (ej. REQ-20261109-A4K2), el departamento emisor y el mes al que corresponden las cifras reportadas.'),
          createBullet('Pestañas de Destino: Si el departamento reporta a más de una hoja del macro archivo (como Servicio Comunitario que reporta a Academia y a Extensión), el modal presenta pestañas independientes para cada destino.'),
          createBullet('Tabla Estructurada: Presenta los renglones ordenados exactamente en la misma secuencia que exige el macro archivo institucional (ej. para Pregrado: 1. Administradores y Contadores, 2. Economistas, 3. Estadistas, etc.).'),

          createH2('4.2. Procedimiento de "Copiado Inteligente" Paso a Paso'),
          createBullet('Hacer Clic en "Copiar Columna": En la fila de cabecera verde de la métrica deseada (por ejemplo, "Nuevos Ingresos"), pulse el botón verde "Copiar Columna". El sistema extraerá los valores de las 7 carreras en orden y los formateará internamente con saltos de línea (\\n). Aparecerá un aviso: "¡Copiado! 7 valores listos para pegar".', 'Paso 1: '),
          createBullet('Abrir el Macro Archivo en Google Sheets: Cambie a la pestaña de su navegador donde tiene abierto el libro oficial "Seguimiento Físico" y ubíquese en la hoja correspondiente (ej. Academia).', 'Paso 2: '),
          createBullet('Seleccionar la Celda Superior del Mes: Haga clic únicamente en la primera celda de la columna del mes correspondiente (la fila de Administradores y Contadores Públicos). No es necesario seleccionar todo el rango.', 'Paso 3: '),
          createBullet('Pegar con Ctrl + V: Presione Ctrl + V (o Cmd + V en Mac). Los 7 valores caerán verticalmente en las 7 celdas continuas en menos de un segundo.', 'Paso 4: '),
          createCallout(
            '🛡️ ¿Por qué esto protege las fórmulas institucionales?',
            'Porque el pegado vertical estándar de Google Sheets solo inyecta valores de texto plano en las celdas de entrada. Las celdas inferiores de "Totales", porcentajes y prosecución mantienen intactas sus fórmulas originales (=SUM(...)) y se recalculan automáticamente sin haber sufrido manipulaciones.',
            COLOR_SUCCESS
          ),

          createH2('4.3. Marcado como Aprobado'),
          createP('Una vez copiadas las columnas correspondientes en el libro maestro, regrese al modal y presione el botón verde inferior "Aprobar y Marcar como Listo".'),
          createP('El sistema enviará una señal a la Zona de Staging actualizando la columna Estado a "Aprobado". La tarjeta cambiará de color a verde en el listado principal, dejando constancia de que ese reporte ya fue debidamente auditado y consolidado.'),

          createH1('5. Configuración Administrativa y Mantenimiento'),
          createP('En la esquina superior derecha del panel principal se encuentra el botón "⚙️ Configuración". Al pulsarlo, se abrirá el modal de administración avanzada del sistema:'),
          ...createImageBlock('08_receptor_modal_configuracion.png', 'Figura 5: Modal de configuración: cambio de PIN maestro y herramientas de mantenimiento de Staging.'),

          createH2('5.1. Cambio de PIN Maestro de la Administración'),
          createP('Para resguardar el acceso del revisor, se recomienda actualizar el PIN maestro periódicamente:'),
          createBullet('En la sección "Seguridad y PIN de Acceso", digite su PIN Actual (ej. 123456).', '1. '),
          createBullet('Introduzca el Nuevo PIN (debe ser estrictamente de 6 dígitos numéricos).', '2. '),
          createBullet('Escriba nuevamente la clave en Confirmar Nuevo PIN para validar que no hubo errores tipográficos.', '3. '),
          createBullet('Haga clic en "Actualizar PIN". El sistema guardará la nueva clave en la base de datos de Google Sheets de manera inmediata.', '4. '),

          createH2('5.2. Mantenimiento y Purga de la Zona de Staging'),
          createP('Al finalizar un año fiscal o ciclo académico, o si se desea reiniciar el entorno de pruebas, la Administración puede depurar la base de datos intermedia:'),
          createBullet('Eliminación Individual: En el listado de reportes, cada tarjeta cuenta con un botón rojo con icono de papelera. Permite descartar un reporte específico (por ejemplo, una prueba duplicada enviada por error).'),
          createBullet('Limpieza General (Botón Rojo Superior): El botón "Limpiar Staging" borra la totalidad de las filas de datos de la Zona de Staging pero conserva intactas las cabeceras y la configuración institucional. El sistema siempre solicitará una confirmación explícita antes de ejecutar esta acción irreversible.'),

          createH1('6. Matriz de Mapeo Departamental (Referencia Rápida)'),
          createP('La siguiente tabla detalla la correspondencia exacta entre cada dependencia emisora y su ubicación física en el macro archivo institucional "Seguimiento Físico":'),
          createTableBlock(
            ['Departamento Emisor', 'Hoja de Destino Oficial', 'Bloque / Sección Institucional'],
            [
              ['Control de Estudios - Pregrado', 'Academia', 'Control de Estudios - Pregrado (7 Carreras oficiales).'],
              ['Control de Estudios - Postgrado', 'Academia', 'Control de Estudios - Postgrado (10 Programas de Especialización y Maestrías).'],
              ['Servicio Comunitario', 'Academia\nExtensión', 'Servicio comunitario (requisito para graduarse)\nServicio comunitario (labor social comunitaria).'],
              ['Biblioteca', 'Estudiantes', 'Biblioteca Central de FaCES (Atención en sala y talleres).'],
              ['Desarrollo Estudiantil', 'Estudiantes', 'Servicios de Orientación y Asesoría Académica.'],
              ['Coordinación de Extensión', 'Extensión\nEstudiantes\nAcademia', 'Actividades Socio-culturales\nActividades deportivas institucionales\nActualización de malla curricular.'],
              ['Departamento de Compras', 'Otros Gastos de Funcionamiento', 'Gestión administrativa\nConservación y mantenimiento de infraestructura.'],
              ['Centro de Extensión Profesional', 'Extensión', 'Acompañamiento Profesional y asesorías externas.'],
              ['Instituto de Investigaciones', 'Extensión\nAcademia', 'Acompañamiento Profesional\nTecnologías para el proceso de enseñanza.']
            ],
            [25, 25, 50]
          ),

          createH1('7. Protocolos de Contingencia'),
          createCallout(
            '⚠️ ¿Qué hacer si un revisor olvida el PIN Maestro?',
            'Como administrador con acceso a Google Drive, usted no necesita reprogramar el sistema:\n1. Abra la hoja de cálculo de Google Sheets asociada a la aplicación.\n2. Diríjase a la pestaña llamada "Configuración".\n3. En la celda B2 (al lado de PIN_RECEPTOR) podrá leer directamente el PIN vigente o escribir una nueva clave de 6 dígitos numéricos.\n4. El cambio se aplicará de inmediato la próxima vez que intente acceder al panel.',
            COLOR_AMBER
          ),
          createCallout(
            '✅ Resumen de Seguridad Operativa:',
            'El sistema FaCES combina autonomía departamental con estricto control central. La Zona de Staging actúa como escudo protector de datos, el Copiado Inteligente elimina el error humano en fórmulas, y la gestión por PIN asegura la integridad de la labor administrativa.',
            COLOR_PRIMARY
          )
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  fs.writeFileSync('Manual_Usuario_Receptor_FaCES.docx', buffer);
  console.log(`✓ Creado exitosamente: Manual_Usuario_Receptor_FaCES.docx (${(buffer.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  console.log('=== Generador de Manuales Oficiales en Word (.docx) con Capturas - FaCES UCV ===\n');
  await generateEmisorDocx();
  await generateReceptorDocx();
  console.log('\n✓ Todos los manuales Word (.docx) han sido generados exitosamente en la raíz del proyecto.');
}

main().catch(err => {
  console.error('Error generando documentos Word:', err);
  process.exit(1);
});
