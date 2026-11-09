const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

function getBase64Image(filename) {
  const imgPath = path.resolve('scripts', 'screenshots', filename);
  if (fs.existsSync(imgPath)) {
    return 'data:image/png;base64,' + fs.readFileSync(imgPath).toString('base64');
  }
  return '';
}

const commonStyles = `
  @page {
    size: A4;
    margin: 18mm 16mm 22mm 16mm;
  }
  @media print {
    body {
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-break {
      page-break-after: always;
      break-after: page;
    }
    .no-break {
      page-break-inside: avoid;
      break-inside: avoid;
    }
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    line-height: 1.55;
    font-size: 10.5pt;
  }
  
  /* PORTADA */
  .cover {
    min-height: 90vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 30px 20px 20px 20px;
    border-left: 8px solid #1e3a8a;
  }
  .cover-header {
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 2px solid #e2e8f0;
    padding-bottom: 20px;
  }
  .cover-badge-ucv {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 800;
    font-size: 20pt;
    padding: 12px 18px;
    border-radius: 8px;
    letter-spacing: 1px;
    display: inline-block;
  }
  .cover-inst-text h3 {
    font-size: 13pt;
    color: #0f172a;
    font-weight: 700;
    text-transform: uppercase;
  }
  .cover-inst-text p {
    font-size: 10pt;
    color: #475569;
    font-weight: 500;
  }
  .cover-body {
    margin: 45px 0;
  }
  .cover-tag {
    display: inline-block;
    background: #dbeafe;
    color: #1e40af;
    font-weight: 700;
    font-size: 9pt;
    padding: 4px 12px;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 15px;
  }
  .cover-title {
    font-size: 26pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 12px;
  }
  .cover-subtitle {
    font-size: 13pt;
    color: #3b82f6;
    font-weight: 600;
    margin-bottom: 24px;
  }
  .cover-desc {
    font-size: 11pt;
    color: #475569;
    max-width: 90%;
    line-height: 1.6;
  }
  .cover-footer {
    border-top: 1px solid #e2e8f0;
    padding-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    font-size: 9pt;
    color: #64748b;
  }
  .cover-meta strong {
    color: #0f172a;
  }
  
  /* CONTENIDO */
  h1 {
    font-size: 17pt;
    color: #0f172a;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 6px;
    margin-top: 26px;
    margin-bottom: 14px;
    font-weight: 800;
  }
  h2 {
    font-size: 13.5pt;
    color: #1e3a8a;
    margin-top: 18px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  h3 {
    font-size: 11.5pt;
    color: #0f172a;
    margin-top: 12px;
    margin-bottom: 6px;
    font-weight: 600;
  }
  p {
    margin-bottom: 10px;
    text-align: justify;
  }
  ul, ol {
    margin-left: 20px;
    margin-bottom: 12px;
  }
  li {
    margin-bottom: 5px;
  }
  
  /* TABLAS */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 20px 0;
    font-size: 9.5pt;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
  }
  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }
  tr:nth-child(even) {
    background-color: #f8fafc;
  }
  
  /* LLAMADOS / CALLOUTS */
  .callout {
    border-left: 4px solid #3b82f6;
    background-color: #eff6ff;
    padding: 12px 16px;
    margin: 14px 0 18px 0;
    border-radius: 0 6px 6px 0;
  }
  .callout-success {
    border-left-color: #10b981;
    background-color: #ecfdf5;
  }
  .callout-warning {
    border-left-color: #f59e0b;
    background-color: #fffbeb;
  }
  .callout-primary {
    border-left-color: #1e3a8a;
    background-color: #f0f4ff;
  }
  .callout strong {
    display: block;
    margin-bottom: 4px;
    color: #0f172a;
  }

  /* IMÁGENES DE CAPTURA */
  .img-card {
    margin: 16px 0 22px 0;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    overflow: hidden;
    background: #f8fafc;
    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    page-break-inside: avoid;
    break-inside: avoid;
  }
  .img-card img {
    width: 100%;
    height: auto;
    display: block;
    border-bottom: 1px solid #e2e8f0;
  }
  .img-card-caption {
    padding: 7px 12px;
    font-size: 8.5pt;
    color: #475569;
    font-style: italic;
    background: #f1f5f9;
    text-align: center;
  }
  
  /* BADGES */
  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 8pt;
    font-weight: 700;
    text-transform: uppercase;
  }
  .badge-blue { background: #dbeafe; color: #1e40af; }
  .badge-green { background: #d1fae5; color: #065f46; }
  .badge-amber { background: #fef3c7; color: #92400e; }
  
  /* PASOS NUMERADOS */
  .step-container {
    display: flex;
    gap: 12px;
    margin-bottom: 14px;
    align-items: flex-start;
  }
  .step-num {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 800;
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10pt;
    flex-shrink: 0;
    margin-top: 2px;
  }
  .step-text {
    flex: 1;
  }
  .step-text strong {
    color: #0f172a;
  }
`;

function getEmisorManualHtml() {
  const imgHub = getBase64Image('01_hub_principal.png');
  const imgDeptos = getBase64Image('02_emisor_seleccion_departamentos.png');
  const imgPregrado = getBase64Image('03_emisor_formulario_pregrado.png');
  const imgComunitario = getBase64Image('04_emisor_formulario_servicio_comunitario.png');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario - Módulo Emisor | FaCES UCV</title>
  <style>
    ${commonStyles}
  </style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-header">
      <div class="cover-badge-ucv">FaCES</div>
      <div class="cover-inst-text">
        <h3>Universidad Central de Venezuela</h3>
        <p>Facultad de Ciencias Económicas y Sociales • Sistema Institucional de Reportes</p>
      </div>
    </div>
    
    <div class="cover-body">
      <span class="cover-tag">Guía de Operación Departamental</span>
      <h1 class="cover-title">Manual de Usuario:<br>Módulo Emisor</h1>
      <h2 class="cover-subtitle">Registro y Envío Ágil de Métricas Académico-Administrativas</h2>
      <p class="cover-desc">
        Este documento proporciona una guía visual, rápida y práctica para el personal de secretarías, coordinaciones e institutos de la Facultad. Detalla el procedimiento directo para acceder a la plataforma institucional, seleccionar su departamento sin necesidad de contraseñas, completar el formulario mensual y generar su comprobante digital de entrega.
      </p>
    </div>
    
    <div class="cover-footer">
      <div class="cover-meta">
        <p><strong>Destinatarios:</strong> Secretarías, Escuelas, Coordinaciones e Institutos</p>
        <p><strong>Versión del Sistema:</strong> 2.1 (Acceso Directo y Despliegue Autónomo)</p>
      </div>
      <div class="cover-meta" style="text-align: right;">
        <p><strong>Fecha de Emisión:</strong> Noviembre 2026</p>
        <p><strong>Estado:</strong> Oficial / Vigente</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECCIÓN 1: INTRODUCCIÓN Y BENEFICIOS -->
  <h1>1. Introducción y Propósito del Sistema</h1>
  <p>
    El <strong>Sistema de Reportes FaCES</strong> fue desarrollado para simplificar la recolección periódica de datos estadísticos y administrativos de las distintas dependencias de la Facultad de Ciencias Económicas y Sociales (UCV).
  </p>
  <p>
    Tradicionalmente, la consolidación requería transcribir datos de forma manual directamente sobre un macro archivo de cálculo compartido, lo cual generaba riesgos de sobrescritura accidental de fórmulas, pérdida de información y retrasos operativos. La nueva plataforma soluciona estos inconvenientes mediante un entorno web visual y seguro.
  </p>

  <div class="callout callout-success no-break">
    <strong>✨ Ventajas Principales para su Departamento:</strong>
    <ul>
      <li><strong>Acceso Directo sin Contraseñas:</strong> Ya no requiere memorizar ni gestionar claves o PINes. Basta con ingresar y pulsar sobre el nombre de su departamento.</li>
      <li><strong>Formularios Personalizados:</strong> Cada dependencia visualiza exclusivamente los campos y carreras que le competen (ej. Pregrado ve sus 7 carreras; Biblioteca ve atenciones a sala; Compras ve mantenimiento y gestión).</li>
      <li><strong>Comprobante Digital Único:</strong> Cada envío genera al instante un identificador alfanumérico irrepetible (ej. <code>REQ-20261109-A4K2</code>), el cual garantiza la recepción formal de su informe ante la Administración.</li>
      <li><strong>Protección Total:</strong> Usted no tiene que interactuar con hojas de cálculo pesadas ni manipular celdas institucionales protegidas.</li>
    </ul>
  </div>

  <!-- SECCIÓN 2: PASO 1 - ACCESO DESDE EL HUB -->
  <h1>2. Acceso al Sistema y Selección de Rol</h1>
  <p>
    Para ingresar, abra el enlace institucional provisto por la Administración en su navegador web (Chrome, Edge, Firefox u Opera) o abra la opción <em>🏛️ Sistema FaCES</em> si se encuentra dentro de Google Sheets.
  </p>
  <p>
    La pantalla de bienvenida (<strong>Hub Principal</strong>) le presentará dos portales. Debe hacer clic en el botón azul <strong>"Acceder como Emisor"</strong> ubicado en la tarjeta izquierda:
  </p>

  <div class="img-card">
    <img src="${imgHub}" alt="Pantalla de Bienvenida - Hub Institucional" />
    <div class="img-card-caption">Figura 1: Pantalla principal (Hub). Haga clic en "Acceder como Emisor" para ingresar a los formularios.</div>
  </div>

  <div class="page-break"></div>

  <!-- SECCIÓN 3: PASO 2 - SELECCIÓN DEL DEPARTAMENTO -->
  <h1>3. Selección de su Departamento</h1>
  <p>
    Al pulsar "Acceder como Emisor", se desplegará el catálogo oficial con las <strong>9 dependencias</strong> de la facultad. Ubique la casilla correspondiente a su oficina y haga clic directamente sobre ella:
  </p>

  <div class="img-card">
    <img src="${imgDeptos}" alt="Catálogo de Selección de Departamentos" />
    <div class="img-card-caption">Figura 2: Cuadrícula con los 9 departamentos oficiales. Selección directa en un solo clic.</div>
  </div>

  <table class="no-break">
    <thead>
      <tr>
        <th style="width: 35%;">Departamento</th>
        <th style="width: 25%;">Icono</th>
        <th style="width: 40%;">Área de Enfoque Principal</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Control de Estudios - Pregrado</strong></td>
        <td>🎓 Birrete</td>
        <td>Métricas de nuevo ingreso, egresados y retiros en las 7 carreras.</td>
      </tr>
      <tr>
        <td><strong>Control de Estudios - Postgrado</strong></td>
        <td>🏛️ Fachada</td>
        <td>Especializaciones, Maestrías y Doctorados.</td>
      </tr>
      <tr>
        <td><strong>Servicio Comunitario</strong></td>
        <td>🤝 Apretón de manos</td>
        <td>Proyectos de labor social y requisitos de graduación.</td>
      </tr>
      <tr>
        <td><strong>Biblioteca</strong></td>
        <td>📚 Libros</td>
        <td>Atención a usuarios en sala de lectura y talleres de alfabetización.</td>
      </tr>
      <tr>
        <td><strong>Desarrollo Estudiantil</strong></td>
        <td>🌱 Planta</td>
        <td>Orientación académica, asesorías y programas de bienestar.</td>
      </tr>
      <tr>
        <td><strong>Coordinación de Extensión</strong></td>
        <td>📣 Megáfono</td>
        <td>Actividades socio-culturales, deportivas y actualización curricular.</td>
      </tr>
      <tr>
        <td><strong>Departamento de Compras</strong></td>
        <td>🛒 Carrito</td>
        <td>Gestión administrativa y conservación de infraestructura.</td>
      </tr>
      <tr>
        <td><strong>Centro de Extensión Profesional</strong></td>
        <td>💼 Maletín</td>
        <td>Acompañamiento profesional y formación continua.</td>
      </tr>
      <tr>
        <td><strong>Instituto de Investigaciones</strong></td>
        <td>🔬 Microscopio</td>
        <td>Investigación científica y tecnologías para la enseñanza.</td>
      </tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- SECCIÓN 4: PASO 3 - LLENADO DEL FORMULARIO -->
  <h1>4. Llenado del Formulario Mensual</h1>
  <p>
    Una vez seleccionado su departamento, el sistema cargará su formulario a la medida. El proceso de llenado consta de 3 simples pasos:
  </p>

  <div class="step-container">
    <div class="step-num">1</div>
    <div class="step-text">
      <strong>Seleccionar el Mes a Reportar:</strong> En la parte superior del formulario encontrará el menú desplegable con los meses del año (ej. Enero, Febrero, Octubre). Seleccione el período que está rindiendo.
    </div>
  </div>

  <div class="step-container">
    <div class="step-num">2</div>
    <div class="step-text">
      <strong>Ingresar los Datos Numéricos:</strong> Rellene los campos con las cifras oficiales de su oficina. Los campos aceptan números enteros positivos. Si para alguna variable no hubo movimiento en ese mes, conserve el valor en <code>0</code>.
    </div>
  </div>

  <div class="step-container">
    <div class="step-num">3</div>
    <div class="step-text">
      <strong>Manejo de Casillas Dinámicas:</strong> En departamentos con pestañas o actividades múltiples (como Servicio Comunitario, Compras o Instituto de Investigaciones), puede agregar renglones de descripción o marcar la casilla <em>"Nada que reportar en esta sección"</em> si no se realizaron actividades.
    </div>
  </div>

  <div class="img-card">
    <img src="${imgPregrado}" alt="Formulario de Control de Estudios Pregrado" />
    <div class="img-card-caption">Figura 3: Formulario especializado de Pregrado, estructurado por carreras y variables mensuales.</div>
  </div>

  <div class="img-card">
    <img src="${imgComunitario}" alt="Formulario dinámico de Servicio Comunitario con pestañas" />
    <div class="img-card-caption">Figura 4: Formulario con pestañas y casillas opcionales de reporte ("Nada que reportar").</div>
  </div>

  <div class="page-break"></div>

  <!-- SECCIÓN 5: PASO 4 - ENVÍO Y COMPROBANTE -->
  <h1>5. Envío y Generación de Comprobante</h1>
  <p>
    Al completar la carga de datos, diríjase al final de la página y haga clic en el botón azul <strong>"Enviar Reporte"</strong>.
  </p>

  <div class="callout callout-warning no-break">
    <strong>⏳ Control Automático de Doble Clic:</strong>
    <p>
      Para evitar envíos repetidos por doble pulsación accidental, el botón se desactiva de inmediato y mostrará un círculo animado con el mensaje <em>"Enviando a Staging..."</em> mientras los datos se registran en los servidores de Google Workspace. Espere un par de segundos.
    </p>
  </div>

  <p>
    Una vez procesado exitosamente, la pantalla le mostrará una ventana emergente de confirmación con los detalles de su entrega:
  </p>

  <div class="callout callout-primary no-break">
    <strong>📋 Comprobante Digital de Transacción</strong>
    <p style="font-family: monospace; font-size: 10pt; margin-top: 6px;">
      ✅ ¡Reporte registrado exitosamente en la Zona de Staging!<br><br>
      • ID Transacción: <strong>REQ-20261109-A4K2</strong><br>
      • Departamento: Control de Estudios - Pregrado<br>
      • Estado: Pendiente de Revisión<br>
      • Fecha: 09/11/2026, 10:15:24 AM
    </p>
  </div>

  <p>
    <strong>¿Desea reportar otro mes o cambiar de oficina?</strong> En la esquina superior derecha dispone de dos botones en todo momento:
  </p>
  <ul>
    <li><strong>← Cambiar Departamento:</strong> Le permite regresar a la lista de las 9 oficinas para enviar el reporte de otra coordinación sin cerrar la aplicación.</li>
    <li><strong>← Volver al Hub:</strong> Le regresa a la pantalla de bienvenida principal del sistema.</li>
  </ul>

  <!-- SECCIÓN 6: PREGUNTAS FRECUENTES -->
  <h1 style="margin-top: 30px;">6. Preguntas Frecuentes (FAQ)</h1>
  
  <p><strong>¿Qué hago si me equivoqué en una cifra después de enviar el reporte?</strong></p>
  <p>
    No se preocupe. La información no cae directamente en el libro final de producción, sino en la <em>Zona de Staging</em> para ser auditada por la Administración. Puede enviar un nuevo reporte con las cifras corregidas o notificar al Administrador para que realice el ajuste antes de aprobarlo.
  </p>

  <p><strong>¿Puedo enviar reportes desde mi teléfono móvil o tablet?</strong></p>
  <p>
    Sí. La plataforma está totalmente adaptada para dispositivos móviles. Puede abrir el enlace desde cualquier navegador móvil y los formularios se adaptarán al tamaño de su pantalla.
  </p>

  <p><strong>¿El sistema calcula automáticamente los totales?</strong></p>
  <p>
    Sí. Para no dañar las fórmulas del macro archivo institucional, el formulario emisor no le pide calcular sumatorias ni totales generales. Usted solo registra los valores brutos de cada variable y el sistema institucional calcula las sumatorias de manera automática.
  </p>

</body>
</html>`;
}

function getReceptorManualHtml() {
  const imgHub = getBase64Image('01_hub_principal.png');
  const imgPin = getBase64Image('05_receptor_login_pin.png');
  const imgDash = getBase64Image('06_receptor_dashboard_principal.png');
  const imgAudit = getBase64Image('07_receptor_modal_auditoria_detalle.png');
  const imgConfig = getBase64Image('08_receptor_modal_configuracion.png');

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario - Módulo Receptor (Revisor) | FaCES UCV</title>
  <style>
    ${commonStyles}
  </style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-header">
      <div class="cover-badge-ucv">FaCES</div>
      <div class="cover-inst-text">
        <h3>Universidad Central de Venezuela</h3>
        <p>Facultad de Ciencias Económicas y Sociales • Coordinación Administrativa y Decanato</p>
      </div>
    </div>
    
    <div class="cover-body">
      <span class="cover-tag">Manual Técnico-Operativo para Coordinadores y Revisores</span>
      <h1 class="cover-title">Manual de Usuario:<br>Módulo Receptor (Revisor)</h1>
      <h2 class="cover-subtitle">Auditoría, Copiado Inteligente y Consolidación en la Hoja Institucional</h2>
      <p class="cover-desc">
        Guía integral y detallada para el personal de administración y revisión. Abarca desde la autenticación mediante PIN Maestro de 6 dígitos, la supervisión de la Zona de Staging en tiempo real, el procedimiento asistido de <strong>Copiado Inteligente</strong> para la inyección vertical de métricas sin tocar fórmulas institucionales, hasta la aprobación formal y el mantenimiento anual de la base de datos.
      </p>
    </div>
    
    <div class="cover-footer">
      <div class="cover-meta">
        <p><strong>Destinatarios:</strong> Coordinadores de Planificación, Decanato y Administradores</p>
        <p><strong>Versión del Sistema:</strong> 2.1 (Seguridad Maestro, Staging y Asistencia de Pegado)</p>
      </div>
      <div class="cover-meta" style="text-align: right;">
        <p><strong>Fecha de Emisión:</strong> Noviembre 2026</p>
        <p><strong>Estado:</strong> Oficial / Vigente</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- SECCIÓN 1: ARQUITECTURA DEL SISTEMA -->
  <h1>1. Arquitectura y Filosofía del Sistema</h1>
  <p>
    El macro archivo institucional <em>"Seguimiento Físico"</em> de la FaCES UCV es una herramienta compleja que contiene múltiples hojas especializadas (<strong>Academia</strong>, <strong>Extensión</strong>, <strong>Investigación</strong>, <strong>Estudiantes</strong> y <strong>Otros Gastos</strong>) con cabeceras jerárquicas multinivel, matrices por mes y fórmulas de consolidación matemática muy sensibles.
  </p>
  <p>
    En el modelo operativo anterior, la manipulación de este archivo por diversos usuarios provocaba con frecuencia el borrado accidental de fórmulas y el desalineamiento de celdas. Para erradicar este problema definitivamente, el sistema fue diseñado bajo una <strong>arquitectura desacoplada en tres capas</strong>:
  </p>

  <div class="callout callout-primary no-break">
    <strong>🏛️ Las Tres Capas de la Solución Institucional:</strong>
    <ol style="margin-top: 6px;">
      <li><strong>Capa de Captura (Portal Emisor):</strong> Formularios limpios donde las secretarías cargan únicamente valores numéricos directos sin tener acceso ni conocimiento del archivo de cálculo final.</li>
      <li><strong>Capa de Aislamiento (Zona de Staging):</strong> Base de datos intermedia que actúa como un <em>Firewall</em> (cortafuegos). Los envíos quedan almacenados en espera de auditoría humana con identificador único (ID de transacción).</li>
      <li><strong>Capa de Consolidación Asistida (Módulo Receptor):</strong> Dashboard administrativo donde el Revisor inspecciona la data, valida su coherencia y, mediante la herramienta de <strong>Copiado Inteligente</strong>, pega bloques completos de métricas en la hoja institucional de forma instantánea sin riesgo de dañar fórmulas.</li>
    </ol>
  </div>

  <table class="no-break">
    <thead>
      <tr>
        <th style="width: 25%;">Componente</th>
        <th style="width: 35%;">Ubicación / Tecnología</th>
        <th style="width: 40%;">Rol de Seguridad</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Hub & Emisor</strong></td>
        <td>SPA Web / HTML Autónomo</td>
        <td>Acceso abierto a secretarías para carga departamental. Cero acceso al archivo maestro.</td>
      </tr>
      <tr>
        <td><strong>Zona de Staging</strong></td>
        <td>Pestaña oculta / protegida en Sheets</td>
        <td>Almacena payloads en JSON con sellos de tiempo y estado de revisión.</td>
      </tr>
      <tr>
        <td><strong>Dashboard Receptor</strong></td>
        <td>Interfaz privada con PIN</td>
        <td>Solo accesible por la Administración para auditar y autorizar transacciones.</td>
      </tr>
      <tr>
        <td><strong>Copiado Inteligente</strong></td>
        <td>Algoritmo de portapapeles vertical</td>
        <td>Formatea vectores de datos con saltos de línea para pegado directo en 1 segundo.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECCIÓN 2: ACCESO Y SEGURIDAD -->
  <h1>2. Acceso Seguro y Autenticación con PIN Maestro</h1>
  <p>
    El módulo receptor contiene funciones privilegiadas (auditoría, edición local, aprobación de datos y purga de base de datos). Por ende, su acceso se encuentra resguardado bajo un estricto control de seguridad por <strong>PIN numérico de 6 dígitos</strong>.
  </p>

  <div class="step-container">
    <div class="step-num">1</div>
    <div class="step-text">
      <strong>Ingreso desde el Hub:</strong> En la pantalla de bienvenida, pulse el botón azul oscuro <strong>"Acceder como Revisor"</strong>.
    </div>
  </div>

  <div class="img-card">
    <img src="${imgHub}" alt="Acceso al Portal Receptor desde el Hub" />
    <div class="img-card-caption">Figura 1: Selección de portal en el Hub Institucional. Pulse "Acceder como Revisor".</div>
  </div>

  <div class="step-container">
    <div class="step-num">2</div>
    <div class="step-text">
      <strong>Digitación del PIN Maestro:</strong> Ingrese la clave de 6 dígitos numéricos. Puede utilizar el teclado físico de su computador o hacer clic sobre las teclas en pantalla. El sistema incluye avance y retroceso automático de cursor.
    </div>
  </div>

  <div class="img-card">
    <img src="${imgPin}" alt="Modal de Autenticación por PIN de 6 dígitos" />
    <div class="img-card-caption">Figura 2: Interfaz segura de autenticación del receptor con PIN maestro.</div>
  </div>

  <div class="callout callout-warning no-break">
    <strong>🔑 PIN Maestro Inicial:</strong>
    <p>
      El sistema viene configurado de fábrica con el PIN maestro <code>123456</code>. Este valor se encuentra respaldado en la celda <code>B2</code> de la pestaña <em>"Configuración"</em> de la hoja de cálculo. En la Sección 5 de este manual se explica cómo cambiarlo por una clave secreta personalizada.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- SECCIÓN 3: DASHBOARD ADMINISTRATIVO -->
  <h1>3. El Dashboard Administrativo en Detalle</h1>
  <p>
    Al autenticarse con éxito, se despliega el panel de control del Revisor. La interfaz ha sido organizada en bloques ergonómicos para agilizar la labor de inspección:
  </p>

  <div class="img-card">
    <img src="${imgDash}" alt="Dashboard Principal del Receptor" />
    <div class="img-card-caption">Figura 3: Panel administrativo con tarjetas de conteo, barra de filtros y listado de transacciones de Staging.</div>
  </div>

  <h2>3.1. Tarjetas de Resumen de Métricas</h2>
  <p>
    Ubicadas en la franja superior, proveen un balance en tiempo real del estado de los envíos:
  </p>
  <ul>
    <li><strong>Total de Reportes:</strong> Número acumulado de transacciones registradas en la Zona de Staging.</li>
    <li><strong>Pendientes de Revisión (Ámbar):</strong> Reportes enviados por los departamentos que aún no han sido consolidados en el macro archivo institucional.</li>
    <li><strong>Aprobados (Verde):</strong> Reportes que ya fueron auditados, copiados al macro archivo y marcados como listos.</li>
  </ul>

  <h2>3.2. Herramientas de Búsqueda y Filtrado Rápido</h2>
  <ul>
    <li><strong>Botones de Estado:</strong> Permiten alternar instantáneamente entre la vista de <em>"Todos"</em>, solo <em>"Pendiente de Revisión"</em> o únicamente <em>"Aprobado"</em>.</li>
    <li><strong>Buscador Inteligente:</strong> Permite localizar reportes en milisegundos digitando parte del código (ej. <code>REQ-20261109</code>) o el nombre del departamento (ej. <em>"Pregrado"</em> o <em>"Biblioteca"</em>).</li>
    <li><strong>Botón 🔄 Recargar:</strong> Consulta nuevamente la hoja de cálculo en segundo plano para verificar si han entrado reportes nuevos de las secretarías.</li>
    <li><strong>Botón 🔒 Bloquear:</strong> Cierra inmediatamente la sesión activa en el navegador y solicita el PIN nuevamente para evitar accesos desatendidos.</li>
  </ul>

  <div class="page-break"></div>

  <!-- SECCIÓN 4: AUDITORÍA Y COPIADO INTELIGENTE -->
  <h1>4. Auditoría y Herramienta de "Copiado Inteligente"</h1>
  <p>
    Esta es la función nuclear del sistema y la mayor innovación para proteger el macro archivo institucional. Para abrirla, haga clic en el botón azul <strong>"Revisar y Copiar Datos"</strong> en cualquiera de las filas de reporte:
  </p>

  <div class="img-card">
    <img src="${imgAudit}" alt="Modal de Auditoría Detallada y Copiado Inteligente" />
    <div class="img-card-caption">Figura 4: Modal de auditoría con la herramienta de Copiado Inteligente (botones verdes) y desglose de métricas.</div>
  </div>

  <h2>4.1. Anatomía del Modal de Auditoría</h2>
  <ul>
    <li><strong>Encabezado de Transacción:</strong> Muestra el ID único oficial (ej. <code>REQ-20261109-A4K2</code>), el departamento emisor y el mes al que corresponden las cifras reportadas.</li>
    <li><strong>Pestañas de Destino:</strong> Si el departamento reporta a más de una hoja del macro archivo (como Servicio Comunitario que reporta a <em>Academia</em> y a <em>Extensión</em>), el modal presenta pestañas independientes para cada destino.</li>
    <li><strong>Tabla Estructurada:</strong> Presenta los renglones ordenados exactamente en la misma secuencia que exige el macro archivo institucional (ej. para Pregrado: <em>1. Administradores y Contadores</em>, <em>2. Economistas</em>, <em>3. Estadistas</em>, etc.).</li>
  </ul>

  <h2>4.2. Funcionamiento del "Copiado Inteligente" (Paso a Paso)</h2>
  <p>
    En lugar de copiar número por número celda por celda (lo que causaba fatiga y errores humanos), el sistema cuenta con la tecnología de <strong>portapapeles vertical optimizado</strong>:
  </p>

  <div class="step-container">
    <div class="step-num">1</div>
    <div class="step-text">
      <strong>Hacer Clic en "Copiar Columna":</strong> En la fila de cabecera verde de la métrica deseada (por ejemplo, <em>"Nuevos Ingresos"</em>), pulse el botón verde <strong>"Copiar Columna"</strong>. El sistema extraerá los valores de las 7 carreras en orden y los formateará internamente con saltos de línea (<code>\n</code>). Aparecerá un aviso: <em>"¡Copiado! 7 valores listos para pegar"</em>.
    </div>
  </div>

  <div class="step-container">
    <div class="step-num">2</div>
    <div class="step-text">
      <strong>Abrir el Macro Archivo en Google Sheets:</strong> Cambie a la pestaña de su navegador donde tiene abierto el libro oficial <em>"Seguimiento Físico"</em> y ubíquese en la hoja correspondiente (ej. <em>Academia</em>).
    </div>
  </div>

  <div class="step-container">
    <div class="step-num">3</div>
    <div class="step-text">
      <strong>Seleccionar la Celda Superior del Mes:</strong> Haga clic <strong>únicamente en la primera celda</strong> de la columna del mes correspondiente (la fila de <em>Administradores y Contadores Públicos</em>). <strong>No es necesario seleccionar todo el rango</strong>.
    </div>
  </div>

  <div class="step-container">
    <div class="step-num">4</div>
    <div class="step-text">
      <strong>Pegar con Ctrl + V:</strong> Presione <code>Ctrl + V</code> (o <code>Cmd + V</code> en Mac). Los 7 valores caerán verticalmente en las 7 celdas continuas en menos de un segundo.
    </div>
  </div>

  <div class="callout callout-success no-break">
    <strong>🛡️ ¿Por qué esto protege las fórmulas institucionales?</strong>
    <p>
      Porque el pegado vertical estándar de Google Sheets solo inyecta valores de texto plano en las celdas de entrada. Las celdas inferiores de <em>"Totales"</em>, porcentajes y prosecución mantienen intactas sus fórmulas originales (<code>=SUM(...)</code>) y se recalculan automáticamente sin haber sufrido manipulaciones.
    </p>
  </div>

  <h2>4.3. Marcado como Aprobado</h2>
  <p>
    Una vez copiadas las columnas correspondientes en el libro maestro, regrese al modal y presione el botón verde inferior <strong>"Aprobar y Marcar como Listo"</strong>.
  </p>
  <p>
    El sistema enviará una señal a la Zona de Staging actualizando la columna <em>Estado</em> a <strong>"Aprobado"</strong>. La tarjeta cambiará de color a verde en el listado principal, dejando constancia de que ese reporte ya fue debidamente auditado y consolidado.
  </p>

  <div class="page-break"></div>

  <!-- SECCIÓN 5: CONFIGURACIÓN Y MANTENIMIENTO -->
  <h1>5. Configuración Administrativa y Mantenimiento</h1>
  <p>
    En la esquina superior derecha del panel principal se encuentra el botón <strong>"⚙️ Configuración"</strong>. Al pulsarlo, se abrirá el modal de administración avanzada del sistema:
  </p>

  <div class="img-card">
    <img src="${imgConfig}" alt="Modal de Configuración y Gestión de PIN" />
    <div class="img-card-caption">Figura 5: Modal de configuración: cambio de PIN maestro y herramientas de mantenimiento de Staging.</div>
  </div>

  <h2>5.1. Cambio de PIN Maestro de la Administración</h2>
  <p>
    Para resguardar el acceso del revisor, se recomienda actualizar el PIN maestro periódicamente:
  </p>
  <ol>
    <li>En la sección <em>"Seguridad y PIN de Acceso"</em>, digite su <strong>PIN Actual</strong> (ej. <code>123456</code>).</li>
    <li>Introduzca el <strong>Nuevo PIN</strong> (debe ser estrictamente de 6 dígitos numéricos).</li>
    <li>Escriba nuevamente la clave en <strong>Confirmar Nuevo PIN</strong> para validar que no hubo errores tipográficos.</li>
    <li>Haga clic en <strong>"Actualizar PIN"</strong>. El sistema guardará la nueva clave en la base de datos de Google Sheets de manera inmediata.</li>
  </ol>

  <h2>5.2. Mantenimiento y Purga de la Zona de Staging</h2>
  <p>
    Al finalizar un año fiscal o ciclo académico, o si se desea reiniciar el entorno de pruebas, la Administración puede depurar la base de datos intermedia:
  </p>
  <ul>
    <li><strong>Eliminación Individual:</strong> En el listado de reportes, cada tarjeta cuenta con un botón rojo con icono de papelera. Permite descartar un reporte específico (por ejemplo, una prueba duplicada enviada por error).</li>
    <li><strong>Limpieza General (Botón Rojo Superior):</strong> El botón <em>"Limpiar Staging"</em> borra la totalidad de las filas de datos de la Zona de Staging pero <strong>conserva intactas las cabeceras</strong> y la configuración institucional. El sistema siempre solicitará una confirmación explícita antes de ejecutar esta acción irreversible.</li>
  </ul>

  <div class="page-break"></div>

  <!-- SECCIÓN 6: MATRIZ DE MAPEO DEPARTAMENTAL -->
  <h1>6. Matriz de Mapeo Departamental (Referencia Rápida)</h1>
  <p>
    La siguiente tabla detalla la correspondencia exacta entre cada dependencia emisora y su ubicación física en el macro archivo institucional <em>"Seguimiento Físico"</em>:
  </p>

  <table class="no-break">
    <thead>
      <tr>
        <th style="width: 25%;">Departamento Emisor</th>
        <th style="width: 25%;">Hoja de Destino Oficial</th>
        <th style="width: 50%;">Bloque / Sección Institucional</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Control de Estudios - Pregrado</strong></td>
        <td>Academia</td>
        <td>Control de Estudios - Pregrado (7 Carreras oficiales).</td>
      </tr>
      <tr>
        <td><strong>Control de Estudios - Postgrado</strong></td>
        <td>Academia</td>
        <td>Control de Estudios - Postgrado (10 Programas de Especialización y Maestrías).</td>
      </tr>
      <tr>
        <td><strong>Servicio Comunitario</strong></td>
        <td>Academia<br>Extensión</td>
        <td>Servicio comunitario (requisito para graduarse)<br>Servicio comunitario (labor social comunitaria).</td>
      </tr>
      <tr>
        <td><strong>Biblioteca</strong></td>
        <td>Estudiantes</td>
        <td>Biblioteca Central de FaCES (Atención en sala y talleres).</td>
      </tr>
      <tr>
        <td><strong>Desarrollo Estudiantil</strong></td>
        <td>Estudiantes</td>
        <td>Servicios de Orientación y Asesoría Académica.</td>
      </tr>
      <tr>
        <td><strong>Coordinación de Extensión</strong></td>
        <td>Extensión<br>Estudiantes<br>Academia</td>
        <td>Actividades Socio-culturales<br>Actividades deportivas institucionales<br>Actualización de malla curricular.</td>
      </tr>
      <tr>
        <td><strong>Departamento de Compras</strong></td>
        <td>Otros Gastos de Funcionamiento</td>
        <td>Gestión administrativa<br>Conservación y mantenimiento de infraestructura.</td>
      </tr>
      <tr>
        <td><strong>Centro de Extensión Profesional</strong></td>
        <td>Extensión</td>
        <td>Acompañamiento Profesional y asesorías externas.</td>
      </tr>
      <tr>
        <td><strong>Instituto de Investigaciones</strong></td>
        <td>Extensión<br>Academia</td>
        <td>Acompañamiento Profesional<br>Tecnologías para el proceso de enseñanza.</td>
      </tr>
    </tbody>
  </table>

  <!-- SECCIÓN 7: PROTOCOLO DE CONTINGENCIA -->
  <h1 style="margin-top: 25px;">7. Protocolos de Contingencia</h1>
  
  <div class="callout callout-warning no-break">
    <strong>⚠️ ¿Qué hacer si un revisor olvida el PIN Maestro?</strong>
    <p>
      Como administrador con acceso a Google Drive, usted no necesita reprogramar el sistema:
    </p>
    <ol style="margin-top: 4px;">
      <li>Abra la hoja de cálculo de Google Sheets asociada a la aplicación.</li>
      <li>Diríjase a la pestaña llamada <strong>"Configuración"</strong>.</li>
      <li>En la celda <strong>B2</strong> (al lado de <code>PIN_RECEPTOR</code>) podrá leer directamente el PIN vigente o escribir una nueva clave de 6 dígitos numéricos.</li>
      <li>El cambio se aplicará de inmediato la próxima vez que intente acceder al panel.</li>
    </ol>
  </div>

  <div class="callout callout-primary no-break" style="margin-top: 20px;">
    <strong>✅ Resumen de Seguridad Operativa</strong>
    <p>
      El sistema FaCES combina autonomía departamental con estricto control central. La Zona de Staging actúa como escudo protector de datos, el Copiado Inteligente elimina el error humano en fórmulas, y la gestión por PIN asegura la integridad de la labor administrativa.
    </p>
  </div>

</body>
</html>`;
}

function generatePdf(htmlContent, outputPdfName) {
  const tempHtmlPath = path.resolve('scripts', outputPdfName.replace('.pdf', '.html'));
  const targetPdfPath = path.resolve(outputPdfName);

  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  console.log(`Generando ${outputPdfName}...`);
  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\/g, '/');

  execFileSync(EDGE_PATH, [
    '--headless',
    '--disable-gpu',
    '--no-pdf-header-footer',
    `--print-to-pdf=${targetPdfPath}`,
    fileUrl
  ]);

  if (fs.existsSync(targetPdfPath)) {
    const stats = fs.statSync(targetPdfPath);
    console.log(`✓ Creado exitosamente: ${outputPdfName} (${(stats.size / 1024).toFixed(1)} KB)`);
  } else {
    throw new Error(`Fallo al generar ${outputPdfName}`);
  }
}

function main() {
  console.log('=== Generador de Manuales de Usuario Oficiales en PDF (con Capturas de Pantalla) - FaCES UCV ===\n');
  
  const emisorHtml = getEmisorManualHtml();
  generatePdf(emisorHtml, 'Manual_Usuario_Emisor_FaCES.pdf');

  const receptorHtml = getReceptorManualHtml();
  generatePdf(receptorHtml, 'Manual_Usuario_Receptor_FaCES.pdf');

  console.log('\n✓ Todos los manuales PDF han sido generados exitosamente en la raíz del proyecto.');
}

main();
