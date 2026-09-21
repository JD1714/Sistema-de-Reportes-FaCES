const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'Relaciones_Departamento_Tabla_FaCES_UCV.pdf');
const doc = new PDFDocument({
  size: 'LETTER',
  margins: { top: 40, bottom: 40, left: 40, right: 40 }
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Primary colors (FaCES UCV palette)
const PRIMARY_COLOR = '#1e3a8a';   // Deep Blue
const SECONDARY_COLOR = '#0284c7'; // Sky Blue
const DARK_TEXT = '#1e293b';       // Dark Slate
const LIGHT_BG = '#f8fafc';        // Very Light Blue/Gray
const BORDER_COLOR = '#cbd5e1';    // Slate border
const ACCENT_COLOR = '#0f766e';    // Teal

// Header
function drawHeader() {
  doc.rect(40, 40, 532, 60).fill(PRIMARY_COLOR);
  doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('UNIVERSIDAD CENTRAL DE VENEZUELA', 55, 50);
  doc.fontSize(11).font('Helvetica').text('Facultad de Ciencias Económicas y Sociales (FaCES)', 55, 70);
  doc.fontSize(10).font('Helvetica-Bold').text('Matriz de Relaciones: Departamento Emisor ➔ Hojas / Tablas en Macro Archivo', 55, 83);
  doc.moveDown(2);
}

drawHeader();

doc.fillColor(DARK_TEXT).fontSize(9).font('Helvetica').text(
  'Este documento especifica la correspondencia entre los 9 Departamentos Emisores, las Hojas y Tablas de destino en el Macro Archivo oficial de Excel de la FaCES UCV, las variables capturadas y la lógica del Copiado Inteligente.',
  40, 115, { width: 532, align: 'justify' }
);

doc.moveDown(1);

const matrixData = [
  {
    num: '1',
    dept: 'Control de Estudios - Pregrado',
    icon: '🎓',
    sheet: 'Academia',
    table: 'Control de Estudios - Pregrado (Filas: 7 Carreras)',
    variables: [
      { name: 'nuevos_ingresos', type: 'Número', desc: 'Nuevos estudiantes ingresados' },
      { name: 'prosecucion', type: 'Número (Enero)', desc: 'Matrícula activa inicial (Solo en Enero)' },
      { name: 'egresados', type: 'Número', desc: 'Estudiantes graduados' },
      { name: 'retiros', type: 'Número', desc: 'Estudiantes retirados' }
    ],
    copyLogic: 'Copiado Vertical por Columna (\\n): Permite copiar toda la columna de las 7 carreras (Nuevos Ingresos, Egresados, Retiros, o Prosecución en Enero) y pegarla hacia abajo con 1 Ctrl+V.'
  },
  {
    num: '2',
    dept: 'Control de Estudios - Postgrado',
    icon: '🏛️',
    sheet: 'Academia',
    table: 'Control de Estudios - Postgrado (Filas: 20 Programas)',
    variables: [
      { name: 'nuevos_ingresos', type: 'Número', desc: 'Ingresos a diplomados/maestrías/doctorados' },
      { name: 'prosecucion', type: 'Número (Enero)', desc: 'Matrícula activa inicial (Solo en Enero)' },
      { name: 'egresados', type: 'Número', desc: 'Graduados de postgrado' },
      { name: 'retiros', type: 'Número', desc: 'Retiros de postgrado' }
    ],
    copyLogic: 'Copiado Vertical por Columna (\\n): Copia la columna de los 20 programas de postgrado hacia abajo.'
  },
  {
    num: '3',
    dept: 'Servicio Comunitario',
    icon: '🤝',
    sheet: 'Academia / Extensión',
    table: 'Pestaña 1: Academia (Servicio Comunitario) | Pestaña 2: Extensión (Labor Social)',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre / Descripción del proyecto o curso' },
      { name: 'actividades_realizadas', type: 'Número', desc: 'Nro. de talleres o proyectos realizados' },
      { name: 'estudiantes_atendidos', type: 'Número', desc: 'Estudiantes o beneficiarios atendidos' }
    ],
    copyLogic: 'Copiado Segmentado por Fila: [Copiar Nombre] para Columna A/B + [Copiar Cantidades] (actividades \\t atendidos) para las 2 celdas horizontales del mes.'
  },
  {
    num: '4',
    dept: 'Biblioteca',
    icon: '📚',
    sheet: 'Estudiantes',
    table: 'Bibliotecas / Providencias Estudiantiles (Fila: Atención presencial y online)',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre de la atención / servicio' },
      { name: 'estudiantes_atendidos', type: 'Número', desc: 'Usuarios atendidos en el mes' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] para Columna A + [Copiar Cantidades] (número único) para la celda del mes.'
  },
  {
    num: '5',
    dept: 'Desarrollo Estudiantil (OBSE)',
    icon: '🌱',
    sheet: 'Estudiantes',
    table: 'Servicios de Orientación, Médico, Comedores y Transporte',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre del servicio ofertado' },
      { name: 'nro_servicios', type: 'Número', desc: 'Nro. de consultas / servicios ofertados' },
      { name: 'estudiantes_atendidos', type: 'Número', desc: 'Estudiantes atendidos' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t atendidos) para 2 celdas del mes.'
  },
  {
    num: '6',
    dept: 'Coordinación de Extensión',
    icon: '📣',
    sheet: 'Extensión / Estudiantes / Academia',
    table: '4 Tablas: Socio-culturales (Extensión), Deportivas (Estudiantes), Malla Curricular (Academia), Programas de Formación (Extensión)',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre de la actividad / evento / programa' },
      { name: 'nro_eventos / nro_actividades', type: 'Número', desc: 'Nro. de eventos o actividades realizadas' },
      { name: 'tipo_actividad', type: 'Texto (Formación)', desc: 'Taller, Curso, Diplomado, etc.' },
      { name: 'usuarios_beneficiados / beneficiarios', type: 'Número', desc: 'Participantes o beneficiarios' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] + [Copiar Cantidades]. En Programas de Formación copia 3 celdas horizontales (actividades \\t tipo \\t beneficiarios).'
  },
  {
    num: '7',
    dept: 'Departamento de Compras',
    icon: '🛒',
    sheet: 'Otros Gastos de Funcionamiento',
    table: 'Gestión Administrativa y Conservación/Mantenimiento de Infraestructura',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre del Bien, Servicio o Compra realizada' },
      { name: 'nro_bienes / nro_servicios', type: 'Número', desc: 'Cantidad de bienes o servicios contratados' },
      { name: 'monto_o_beneficiarios', type: 'Número', desc: 'Monto asignado o beneficiarios' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] para Columna A + [Copiar Cantidades] (bienes \\t monto) para 2 celdas del mes.'
  },
  {
    num: '8',
    dept: 'Centro de Extensión Profesional (CEP)',
    icon: '💼',
    sheet: 'Extensión',
    table: 'Cursos, Diplomados y Talleres (Acompañamiento Profesional)',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre del Curso, Diplomado o Taller' },
      { name: 'nro_cursos', type: 'Número', desc: 'Nro. de cursos impartidos' },
      { name: 'participantes', type: 'Número', desc: 'Nro. de participantes inscritos' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] para Columna A + [Copiar Cantidades] (cursos \\t participantes) para 2 celdas del mes.'
  },
  {
    num: '9',
    dept: 'Instituto de Investigaciones (IIES)',
    icon: '🔬',
    sheet: 'Extensión / Academia',
    table: 'Pestaña 1: Extensión (Acompañamiento Profesional) | Pestaña 2: Academia (Tecnologías de Enseñanza)',
    variables: [
      { name: 'descripcion_item', type: 'Texto', desc: 'Nombre del proyecto o actividad tecnológica' },
      { name: 'nro_proyectos / nro_actividades', type: 'Número', desc: 'Nro. de proyectos o actividades' },
      { name: 'participantes', type: 'Número (Acompañamiento)', desc: 'Investigadores o participantes' }
    ],
    copyLogic: 'Copiado Segmentado: [Copiar Nombre] + [Copiar Cantidades] (proyectos \\t participantes en Acompañamiento; número único en Tecnologías).'
  }
];

let currentY = 135;

matrixData.forEach((item) => {
  // Check if we need a new page
  if (currentY > 640) {
    doc.addPage();
    drawHeader();
    currentY = 115;
  }

  // Box Container
  doc.rect(40, currentY, 532, 18).fill(PRIMARY_COLOR);
  doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold').text(
    `${item.num}. ${item.dept}`, 48, currentY + 4
  );

  currentY += 20;

  // Destination Details
  doc.rect(40, currentY, 532, 22).fill('#f1f5f9');
  doc.fillColor(SECONDARY_COLOR).fontSize(9).font('Helvetica-Bold').text('Hoja Excel Destino: ', 48, currentY + 5, { continued: true });
  doc.fillColor(DARK_TEXT).font('Helvetica').text(item.sheet, { continued: true });
  doc.fillColor(SECONDARY_COLOR).font('Helvetica-Bold').text('  |  Tabla / Bloque: ', { continued: true });
  doc.fillColor(DARK_TEXT).font('Helvetica').text(item.table);

  currentY += 24;

  // Variables Header
  doc.fillColor(DARK_TEXT).fontSize(8.5).font('Helvetica-Bold').text('Variables enviadas en el reporte:', 48, currentY);
  currentY += 12;

  item.variables.forEach((v) => {
    doc.fillColor(ACCENT_COLOR).fontSize(8).font('Helvetica-Bold').text(`• ${v.name}`, 55, currentY, { continued: true });
    doc.fillColor('#64748b').font('Helvetica').text(` (${v.type}): `, { continued: true });
    doc.fillColor(DARK_TEXT).font('Helvetica').text(v.desc);
    currentY += 11;
  });

  // Copy Logic
  doc.fillColor('#0369a1').fontSize(8.5).font('Helvetica-Bold').text('Lógica de Copiado Inteligente (Excel): ', 48, currentY, { continued: true });
  doc.fillColor(DARK_TEXT).font('Helvetica').text(item.copyLogic, { width: 440 });
  
  currentY += Math.ceil(doc.heightOfString(item.copyLogic, { width: 440, fontSize: 8.5 })) + 12;

  doc.strokeColor(BORDER_COLOR).lineWidth(0.5).moveTo(40, currentY - 4).lineTo(572, currentY - 4).stroke();
  currentY += 6;
});

// Footer / Summary Box on last page
if (currentY > 620) {
  doc.addPage();
  drawHeader();
  currentY = 115;
}

doc.rect(40, currentY, 532, 50).fill('#eff6ff');
doc.strokeColor('#93c5fd').lineWidth(1).rect(40, currentY, 532, 50).stroke();

doc.fillColor('#1e40af').fontSize(10).font('Helvetica-Bold').text('📌 Resumen General de Arquitectura:', 50, currentY + 8);
doc.fillColor(DARK_TEXT).fontSize(8.5).font('Helvetica').text(
  'Los 9 Departamentos Emisores envían sus datos serializados en JSON a la "Zona de Staging" en Google Sheets. El Módulo Receptor muestra las tarjetas estructuradas por Hoja y Sección, permitiendo al operador copiar nombres y cantidades tabuladas (\\t) o columnas (\\n) para su pegado inmediato (Ctrl + V) en el Macro Archivo oficial FaCES UCV.',
  50, currentY + 22, { width: 512 }
);

doc.end();

stream.on('finish', () => {
  console.log('PDF generado exitosamente en:', outputPath);
});
