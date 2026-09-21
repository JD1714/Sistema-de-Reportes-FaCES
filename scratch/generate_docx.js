const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, ShadingType } = require('docx');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '..', 'Relaciones_Departamento_Tabla_FaCES_UCV.docx');
const desktopPath = 'C:\\Users\\jd191\\OneDrive\\Escritorio\\Relaciones_Departamento_Tabla_FaCES_UCV.docx';

const entries = [
  {
    num: 1,
    dept: 'Control de Estudios - Pregrado',
    sheet: 'Academia',
    table: 'Control de Estudios - Pregrado (7 Carreras: Administración, Economía, Estadística, EEII, Sociología, Trabajo Social, Antropología)',
    vars: '• nuevos_ingresos (Número)\n• prosecucion (Número - Requerido sólo en Enero)\n• egresados (Número)\n• retiros (Número)',
    copyLogic: 'Copiar Columna Vertical (\\n): Copia la columna de las 7 carreras hacia abajo para pegarla de un solo golpe (Ctrl+V) en el Excel.'
  },
  {
    num: 2,
    dept: 'Control de Estudios - Postgrado',
    sheet: 'Academia',
    table: 'Control de Estudios - Postgrado (20 Programas de Especialización, Maestría y Doctorado)',
    vars: '• nuevos_ingresos (Número)\n• prosecucion (Número - Requerido sólo en Enero)\n• egresados (Número)\n• retiros (Número)',
    copyLogic: 'Copiar Columna Vertical (\\n): Copia la columna de los 20 programas de postgrado hacia abajo.'
  },
  {
    num: 3,
    dept: 'Servicio Comunitario',
    sheet: 'Academia',
    table: 'Servicio Comunitario (requisito para graduarse) [Filas: Culminación de servicio / Cursos de inducción]',
    vars: '• descripcion_item (Texto - Nombre de la actividad)\n• actividades_realizadas (Número)\n• estudiantes_atendidos (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (actividades \\t atendidos) para 2 celdas horizontales contiguas.'
  },
  {
    num: 4,
    dept: 'Servicio Comunitario',
    sheet: 'Extensión',
    table: 'Servicio comunitario (labor social) [Proyectos comunitarios]',
    vars: '• descripcion_item (Texto - Nombre del proyecto)\n• actividades_realizadas (Número)\n• beneficiarios (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (actividades \\t beneficiarios) para 2 celdas horizontales contiguas.'
  },
  {
    num: 5,
    dept: 'Biblioteca',
    sheet: 'Estudiantes',
    table: 'Bibliotecas / Providencias Estudiantiles [Fila: Atención presencial y online]',
    vars: '• descripcion_item (Texto - Nombre de la atención)\n• estudiantes_atendidos (Número - Usuarios atendidos)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (número único) para la celda del mes.'
  },
  {
    num: 6,
    dept: 'Desarrollo Estudiantil (OBSE)',
    sheet: 'Estudiantes',
    table: 'Servicios de Orientación y Asesoría Académica',
    vars: '• descripcion_item (Texto - Nombre del servicio)\n• nro_servicios (Número)\n• estudiantes_atendidos (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t atendidos) para 2 celdas horizontales contiguas.'
  },
  {
    num: 7,
    dept: 'Desarrollo Estudiantil (OBSE)',
    sheet: 'Estudiantes',
    table: 'Servicio Médico y Odontológico',
    vars: '• descripcion_item (Texto - Servicio médico/odontológico)\n• nro_servicios (Número)\n• estudiantes_atendidos (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t atendidos) para 2 celdas horizontales contiguas.'
  },
  {
    num: 8,
    dept: 'Desarrollo Estudiantil (OBSE)',
    sheet: 'Estudiantes',
    table: 'Comedores Estudiantiles',
    vars: '• descripcion_item (Texto - Servicio de comedor)\n• nro_servicios (Número)\n• estudiantes_atendidos (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t atendidos) para 2 celdas horizontales contiguas.'
  },
  {
    num: 9,
    dept: 'Desarrollo Estudiantil (OBSE)',
    sheet: 'Estudiantes',
    table: 'Servicio de Transporte',
    vars: '• descripcion_item (Texto - Ruta/Servicio de transporte)\n• nro_servicios (Número)\n• estudiantes_atendidos (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t atendidos) para 2 celdas horizontales contiguas.'
  },
  {
    num: 10,
    dept: 'Coordinación de Extensión',
    sheet: 'Extensión',
    table: 'Actividades Socio-culturales',
    vars: '• descripcion_item (Texto - Nombre del evento cultural)\n• nro_eventos (Número)\n• usuarios_beneficiados (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (eventos \\t beneficiados) para 2 celdas horizontales contiguas.'
  },
  {
    num: 11,
    dept: 'Coordinación de Extensión',
    sheet: 'Estudiantes',
    table: 'Actividades deportivas',
    vars: '• descripcion_item (Texto - Nombre del torneo/evento deportivo)\n• nro_eventos_realizados (Número)\n• nro_beneficiarios (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (eventos \\t beneficiarios) para 2 celdas horizontales contiguas.'
  },
  {
    num: 12,
    dept: 'Coordinación de Extensión',
    sheet: 'Academia',
    table: 'Actualización de malla curricular',
    vars: '• descripcion_item (Texto - Mesas de trabajo / revisión de pensum)\n• nro_actividades (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (número único) para la celda del mes.'
  },
  {
    num: 13,
    dept: 'Coordinación de Extensión',
    sheet: 'Extensión',
    table: 'Programas de formación',
    vars: '• descripcion_item (Texto - Descripción del programa)\n• nro_actividades (Número)\n• tipo_actividad (Texto - Taller, Curso, Diplomado, etc.)\n• nro_beneficiarios (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (actividades \\t tipo_actividad \\t beneficiarios) para 3 celdas horizontales contiguas.'
  },
  {
    num: 14,
    dept: 'Departamento de Compras',
    sheet: 'Otros Gastos de Funcionamiento',
    table: 'Gestión administrativa',
    vars: '• descripcion_item (Texto - Nombre del Bien/Servicio o Compra)\n• nro_bienes (Número)\n• monto (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (bienes \\t monto) para 2 celdas horizontales contiguas.'
  },
  {
    num: 15,
    dept: 'Departamento de Compras',
    sheet: 'Otros Gastos de Funcionamiento',
    table: 'Conservación y mantenimiento de infraestructura',
    vars: '• descripcion_item (Texto - Trabajo de infraestructura o mantenimiento)\n• nro_servicios (Número)\n• monto (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (servicios \\t monto) para 2 celdas horizontales contiguas.'
  },
  {
    num: 16,
    dept: 'Centro de Extensión Profesional (CEP)',
    sheet: 'Extensión',
    table: 'Cursos, Diplomados y Talleres (Acompañamiento Profesional)',
    vars: '• descripcion_item (Texto - Nombre del Curso / Diplomado)\n• nro_cursos (Número)\n• participantes (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (cursos \\t participantes) para 2 celdas horizontales contiguas.'
  },
  {
    num: 17,
    dept: 'Instituto de Investigaciones (IIES)',
    sheet: 'Extensión',
    table: 'Acompañamiento Profesional e Investigaciones',
    vars: '• descripcion_item (Texto - Nombre del Proyecto de Investigación)\n• nro_proyectos (Número)\n• participantes (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (proyectos \\t participantes) para 2 celdas horizontales contiguas.'
  },
  {
    num: 18,
    dept: 'Instituto de Investigaciones (IIES)',
    sheet: 'Academia',
    table: 'Tecnologías para el proceso de enseñanza',
    vars: '• descripcion_item (Texto - Nombre de la actividad tecnológica)\n• nro_actividades (Número)',
    copyLogic: '[Copiar Nombre] para Columna A + [Copiar Cantidades] (número único) para la celda del mes.'
  }
];

const children = [
  // Header Paragraphs
  new Paragraph({
    text: "UNIVERSIDAD CENTRAL DE VENEZUELA",
    heading: HeadingLevel.HEADING_1,
    alignment: AlignmentType.CENTER
  }),
  new Paragraph({
    text: "Facultad de Ciencias Económicas y Sociales (FaCES)",
    heading: HeadingLevel.HEADING_2,
    alignment: AlignmentType.CENTER
  }),
  new Paragraph({
    text: "MATRIZ DE RELACIONES: DEPARTAMENTO EMISOR ➔ HOJA Y TABLA DESTINO",
    heading: HeadingLevel.HEADING_3,
    alignment: AlignmentType.CENTER
  }),
  new Paragraph({ text: "" }),
  new Paragraph({
    children: [
      new TextRun({
        text: "Nota explicativa: ",
        bold: true,
        color: "1E3A8A"
      }),
      new TextRun({
        text: "En este documento editable se detalla de forma desglosada cada tabla o sección receptora en el Macro Archivo oficial FaCES UCV. Cuando un departamento reporta a múltiples tablas u hojas de cálculo, se ha creado una entrada individual para cada combinación (Departamento ➔ Hoja ➔ Tabla), facilitando su revisión y edición."
      })
    ]
  }),
  new Paragraph({ text: "" })
];

entries.forEach((e) => {
  children.push(
    new Paragraph({
      children: [
        new TextRun({ text: `${e.num}. Departamento Emisor: `, bold: true, color: "1E3A8A", size: 22 }),
        new TextRun({ text: e.dept, bold: true, color: "0284C7", size: 22 })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "   • Hoja Excel: ", bold: true, color: "0F766E" }),
        new TextRun({ text: e.sheet, bold: true, color: "1E293B" }),
        new TextRun({ text: "  |  Tabla / Sección: ", bold: true, color: "0F766E" }),
        new TextRun({ text: e.table, color: "1E293B" })
      ]
    }),
    new Paragraph({
      children: [
        new TextRun({ text: "   • Variables Enviadas:", bold: true, size: 18 })
      ]
    }),
    ...e.vars.split('\n').map(v => new Paragraph({ text: `       ${v}`, size: 18 })),
    new Paragraph({
      children: [
        new TextRun({ text: "   • Lógica de Copiado Inteligente: ", bold: true, color: "0369A1", size: 18 }),
        new TextRun({ text: e.copyLogic, size: 18 })
      ]
    }),
    new Paragraph({ text: "----------------------------------------------------------------------------------------------------\n" })
  );
});

const doc = new Document({
  sections: [
    {
      properties: {},
      children: children
    }
  ]
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  fs.writeFileSync(desktopPath, buffer);
  console.log('Documento Word (.docx) generado exitosamente en:');
  console.log('1. ', outputPath);
  console.log('2. ', desktopPath);
});
