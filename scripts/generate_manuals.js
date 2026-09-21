const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

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
    min-height: 92vh;
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
    margin: 60px 0;
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
    font-size: 18pt;
    color: #0f172a;
    border-bottom: 2px solid #1e3a8a;
    padding-bottom: 6px;
    margin-top: 25px;
    margin-bottom: 14px;
    font-weight: 800;
  }
  h2 {
    font-size: 14pt;
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
    margin-bottom: 4px;
  }
  
  /* CAJAS Y ALERTAS */
  .callout {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 14px 0;
    font-size: 9.5pt;
  }
  .callout-info {
    background: #f0fdf4;
    border-left: 4px solid #16a34a;
    color: #14532d;
  }
  .callout-alert {
    background: #fef2f2;
    border-left: 4px solid #dc2626;
    color: #7f1d1d;
  }
  .callout-warning {
    background: #fffbeb;
    border-left: 4px solid #d97706;
    color: #78350f;
  }
  .callout-primary {
    background: #eff6ff;
    border-left: 4px solid #2563eb;
    color: #1e3a8a;
  }
  .callout strong {
    display: block;
    margin-bottom: 4px;
    font-size: 10pt;
  }

  /* TABLAS */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0;
    font-size: 9pt;
  }
  th, td {
    border: 1px solid #cbd5e1;
    padding: 8px 10px;
    text-align: left;
  }
  th {
    background: #1e3a8a;
    color: #ffffff;
    font-weight: 700;
  }
  tr:nth-child(even) {
    background: #f8fafc;
  }

  /* MOCKUP UI BOXES */
  .mockup-window {
    background: #0f172a;
    border-radius: 8px;
    padding: 14px;
    color: #f8fafc;
    margin: 14px 0;
    box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    font-size: 9.5pt;
  }
  .mockup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #334155;
    padding-bottom: 8px;
    margin-bottom: 12px;
  }
  .mockup-dots {
    display: flex;
    gap: 6px;
  }
  .mockup-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
  }
  .dot-red { background: #ef4444; }
  .dot-yellow { background: #eab308; }
  .dot-green { background: #22c55e; }
  .mockup-title {
    font-size: 8.5pt;
    color: #94a3b8;
    font-weight: 600;
  }
  .mockup-content {
    background: #1e293b;
    border-radius: 6px;
    padding: 12px;
  }

  .badge {
    display: inline-block;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 8pt;
    font-weight: 700;
  }
  .badge-success { background: #dcfce7; color: #15803d; }
  .badge-warning { background: #fef3c7; color: #b45309; }
  .badge-danger { background: #fee2e2; color: #b91c1c; }
  .badge-blue { background: #dbeafe; color: #1d4ed8; }

  .key-pad {
    display: inline-block;
    background: #334155;
    color: #ffffff;
    font-family: monospace;
    font-weight: bold;
    padding: 2px 8px;
    border-radius: 4px;
    border: 1px solid #475569;
    font-size: 9pt;
  }

  .header-running {
    font-size: 8pt;
    color: #94a3b8;
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 4px;
    margin-bottom: 16px;
    display: flex;
    justify-content: space-between;
  }
`;

function getEmisorManualHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario - Módulo Emisor FaCES UCV</title>
  <style>${commonStyles}</style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-header">
      <div class="cover-badge-ucv">FaCES</div>
      <div class="cover-inst-text">
        <h3>Universidad Central de Venezuela</h3>
        <p>Facultad de Ciencias Económicas y Sociales (FaCES)</p>
        <p>Sistema Automatizado de Reportes Académico-Administrativos</p>
      </div>
    </div>

    <div class="cover-body">
      <span class="cover-tag">Manual Operativo de Usuario</span>
      <h1 class="cover-title">MÓDULO EMISOR DE REPORTES</h1>
      <div class="cover-subtitle">Guía Paso a Paso para Dependencias y Departamentos Académicos</div>
      <p class="cover-desc">
        Este documento instruye al personal encargado de las dependencias oficiales de la FaCES sobre el acceso mediante autenticación por PIN, selección del período mensual, registro detallado de variables y envío seguro de reportes hacia la Zona de Staging institucional.
      </p>
    </div>

    <div class="cover-footer">
      <div class="cover-meta">
        <p><strong>Destinatarios:</strong> Secretarías, Jefaturas y Coordinaciones de los 9 Departamentos Emisores</p>
        <p><strong>Versión del Sistema:</strong> 2.0 (Seguridad con PIN y Base de Usuarios en Sheets)</p>
      </div>
      <div class="cover-meta" style="text-align: right;">
        <p><strong>Fecha de Emisión:</strong> Septiembre 2026</p>
        <p><strong>Facultad:</strong> FaCES - UCV</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 2: ÍNDICE Y OBJETIVOS -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Emisor</span>
  </div>

  <h1>1. Introducción y Objetivos</h1>
  <p>
    El <strong>Sistema de Reportes FaCES</strong> tiene como objetivo agilizar y blindar la recopilación periódica de métricas institucionales (matrícula estudiantil, egresados, servicio comunitario, extensión, biblioteca, compras e investigación) reportadas mensualmente por las dependencias de la facultad.
  </p>

  <div class="callout callout-info">
    <strong>🎯 Beneficios Clave del Sistema</strong>
    <ul>
      <li><strong>Protección del Macro Archivo:</strong> Los emisores ya no tocan directamente el complejo archivo Excel/Sheets de la facultad, evitando que se corrompan fórmulas o celdas combinadas.</li>
      <li><strong>Zona de Staging como Filtro:</strong> Cada reporte entra como una transacción identificada con un código único (ej. <code>REQ-20260921-A1B2</code>) y estado "Pendiente de Revisión".</li>
      <li><strong>Acceso Seguro con PIN:</strong> Cada uno de los 9 departamentos cuenta con su propia credencial numérica de 6 dígitos.</li>
    </ul>
  </div>

  <h2>Departamentos Oficiales Habilitados</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 35%;">Departamento</th>
        <th style="width: 35%;">Área de Enfoque</th>
        <th style="width: 30%;">Destino Institucional</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Control de Estudios - Pregrado</td><td>Matrícula por Escuelas (7 menciones)</td><td>Academia (Pregrado)</td></tr>
      <tr><td>Control de Estudios - Postgrado</td><td>Especializaciones, Maestrías, Doctorados</td><td>Academia (Postgrado)</td></tr>
      <tr><td>Servicio Comunitario</td><td>Proyectos académicos y labor comunitaria</td><td>Academia / Extensión</td></tr>
      <tr><td>Biblioteca</td><td>Atención presencial/virtual y talleres</td><td>Estudiantes (Biblioteca)</td></tr>
      <tr><td>Desarrollo Estudiantil</td><td>Orientación vocacional y psicológica</td><td>Estudiantes (Orientación)</td></tr>
      <tr><td>Coordinación de Extensión</td><td>Sociocultural, deportiva y cursos</td><td>Extensión Universitaria</td></tr>
      <tr><td>Departamento de Compras</td><td>Gestión de órdenes y mantenimientos</td><td>Gastos de Funcionamiento</td></tr>
      <tr><td>Centro de Extensión Profesional</td><td>Cursos, diplomados y asesorías</td><td>Extensión Profesional</td></tr>
      <tr><td>Instituto de Investigaciones</td><td>Acompañamiento e innovación tecnológica</td><td>Investigación</td></tr>
    </tbody>
  </table>

  <div class="page-break"></div>

  <!-- PÁGINA 3: ACCESO Y AUTENTICACIÓN -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Emisor</span>
  </div>

  <h1>2. Acceso y Autenticación con PIN</h1>
  <p>
    Para garantizar que cada oficina reporte exclusivamente en su sección, el módulo emisor cuenta con una pantalla de autenticación previa ubicada en la dirección web <code>/emisor</code>.
  </p>

  <div class="mockup-window no-break">
    <div class="mockup-header">
      <div class="mockup-dots"><span class="mockup-dot dot-red"></span><span class="mockup-dot dot-yellow"></span><span class="mockup-dot dot-green"></span></div>
      <span class="mockup-title">Acceso al Módulo Emisor - FaCES UCV</span>
      <span>🔒 Seguro</span>
    </div>
    <div class="mockup-content">
      <p style="color: #38bdf8; font-weight: bold; margin-bottom: 8px;">1. Seleccione su Departamento:</p>
      <div style="background: #0f172a; padding: 8px; border-radius: 4px; border: 1px solid #334155; margin-bottom: 12px; color: #e2e8f0;">
        ▼ [ Control de Estudios - Pregrado ]
      </div>
      <p style="color: #38bdf8; font-weight: bold; margin-bottom: 8px;">2. Ingrese su PIN de Acceso (6 dígitos):</p>
      <div style="display: flex; gap: 8px; justify-content: center; margin-bottom: 12px;">
        <span class="key-pad">•</span><span class="key-pad">•</span><span class="key-pad">•</span><span class="key-pad">•</span><span class="key-pad">•</span><span class="key-pad">•</span>
      </div>
      <div style="text-align: center; background: #2563eb; color: #ffffff; padding: 6px; border-radius: 4px; font-weight: bold;">
        Ingresar al Formulario
      </div>
    </div>
  </div>

  <h2>Pasos para Iniciar Sesión</h2>
  <ol>
    <li>Abra el navegador e ingrese a la dirección del sistema: <code>https://[tu-dominio]/emisor</code>.</li>
    <li>Haga clic en el desplegable <strong>"Seleccione su Departamento"</strong> y elija su dependencia oficial.</li>
    <li>Introduzca su <strong>PIN de 6 números</strong>:
      <ul>
        <li>Puede teclearlo directamente con su teclado físico o presionar los números en el teclado táctil de la pantalla.</li>
        <li>El cursor avanzará automáticamente de una casilla a la siguiente. Si se equivoca, use la tecla <span class="key-pad">Backspace</span>.</li>
        <li><strong>PIN Inicial para todos los departamentos:</strong> <span class="badge badge-warning">123456</span>.</li>
      </ul>
    </li>
    <li>El sistema validará sus credenciales automáticamente o al presionar <strong>"Ingresar al Formulario"</strong>.</li>
  </ol>

  <div class="callout callout-alert no-break">
    <strong>⚠️ ¿Qué hacer si aparece "PIN Incorrecto"?</strong>
    <p>
      Si el sistema indica que el PIN no coincide, verifique no haber digitado un número equivocado. Si su departamento cambió la clave y no la recuerdan, <strong>debe comunicarse con la Administración</strong>. La Administración tiene acceso a la hoja central de cálculo y puede ver o reestablecer su clave en segundos.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 4: SEGURIDAD Y CAMBIO DE PIN -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Emisor</span>
  </div>

  <h1>3. Gestión de Seguridad y Cambio de PIN</h1>
  <p>
    Cada departamento emisor tiene la potestad de cambiar su clave de acceso para asegurar la privacidad de sus registros mensuales.
  </p>

  <h2>Cómo Cambiar el PIN de su Departamento</h2>
  <p>Una vez dentro del formulario de su departamento, observe la barra superior derecha:</p>
  
  <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 10px 15px; border-radius: 8px; display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 15px;">
    <button style="background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 8.5pt; font-weight: bold; color: #0f172a;">🔑 Cambiar PIN</button>
    <button style="background: #ffffff; border: 1px solid #fecdd3; padding: 6px 12px; border-radius: 6px; font-size: 8.5pt; font-weight: bold; color: #e11d48;">🚪 Cerrar Sesión</button>
    <button style="background: #ffffff; border: 1px solid #cbd5e1; padding: 6px 12px; border-radius: 6px; font-size: 8.5pt; font-weight: bold; color: #475569;">← Volver al Hub</button>
  </div>

  <ol>
    <li>Haga clic en el botón <strong>"Cambiar PIN"</strong>. Se abrirá la ventana emergente de seguridad.</li>
    <li>Complete los tres campos solicitados:
      <ul>
        <li><strong>PIN Actual:</strong> Su clave actual (por ejemplo, <code>123456</code>).</li>
        <li><strong>Nuevo PIN:</strong> Su nueva clave de exactamente 6 dígitos numéricos.</li>
        <li><strong>Confirmar Nuevo PIN:</strong> Reingrese exactamente los mismos 6 dígitos.</li>
      </ul>
    </li>
    <li>Presione <strong>"Guardar PIN"</strong>. El sistema actualizará inmediatamente la clave en la base de datos de Google Sheets.</li>
  </ol>

  <div class="callout callout-warning no-break">
    <strong>🔒 Recomendaciones para la Oficina</strong>
    <p>
      Si varias personas de la misma secretaría o jefatura cargan reportes, asegúrese de comunicar el nuevo PIN a sus compañeros de oficina para evitar que queden bloqueados.
    </p>
  </div>

  <h2>Cierre de Sesión Seguro</h2>
  <p>
    Al terminar la jornada o si otra persona va a cargar datos de un departamento diferente, presione el botón <strong>"Cerrar Sesión"</strong>. Esto limpiará las credenciales temporales de su navegador y devolverá la pantalla al Login con PIN.
  </p>

  <div class="page-break"></div>

  <!-- PÁGINA 5: LLENADO DE REPORTES -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Emisor</span>
  </div>

  <h1>4. Llenado y Envío del Formulario</h1>
  <p>
    Cada departamento posee un formulario adaptado exactamente a la estructura del archivo institucional de la FaCES. A continuación se detallan las reglas operativas para el llenado:
  </p>

  <h2>Paso 1: Selección del Mes Reportado</h2>
  <p>
    En la parte superior de cada formulario encontrará el selector <strong>"Mes Reportado"</strong>. Los meses habilitados son configurados por la Administración de acuerdo con el calendario administrativo. Seleccione el mes exacto de los datos que registrará.
  </p>

  <h2>Paso 2: Carga de Datos por Tipo de Formulario</h2>

  <h3>A. Formularios Numéricos por Carreras / Programas (Control de Estudios)</h3>
  <ul>
    <li><strong>Pregrado:</strong> Muestra las escuelas y menciones (Administradores y Contadores, Economistas, Estadistas y Actuarios, Internacionalistas, Sociólogos, Trabajadores Sociales y Antropólogos). Ingrese los valores de <em>Nuevos Ingresos</em>, <em>Egresados</em> y <em>Retiros</em>.
      <br><em>Nota especial:</em> La columna <strong>Prosecución</strong> se habilitará exclusivamente si el mes seleccionado es <strong>Enero</strong>, tal como lo exige el reglamento del seguimiento físico.</li>
    <li><strong>Postgrado:</strong> Muestra las 21 especializaciones, maestrías y doctorados de la facultad. Registre los valores numéricos correspondientes.</li>
  </ul>

  <h3>B. Formularios con Pestañas y Casilla "Nada que Reportar" (Servicio Comunitario, Extensión, etc.)</h3>
  <ul>
    <li><strong>Pestañas Temáticas:</strong> Departamentos como Servicio Comunitario se dividen en <em>Academia</em> y <em>Extensión</em>. Puede alternar entre pestañas y añadir filas con el botón <strong>"+ Agregar Ítem"</strong>.</li>
    <li><strong>Casilla "Nada que reportar":</strong> Si en un mes determinado su dependencia no tuvo actividades en esa área, marque la casilla <em>"Nada que reportar en este mes"</em>. El sistema registrará el reporte con valor cero formalmente, certificando que no se omitió la entrega.</li>
  </ul>

  <h2>Paso 3: Envío a Staging y Notificación</h2>
  <ol>
    <li>Revise que los números y descripciones sean correctos.</li>
    <li>Presione el botón inferior <strong>"Enviar Reporte"</strong>.</li>
    <li>El botón mostrará el estado <em>"Enviando a Staging..."</em> mientras procesa la transacción de forma cifrada.</li>
    <li>Aparecerá un mensaje emergente de confirmación:
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 8px 12px; border-radius: 6px; font-family: monospace; font-size: 8.5pt; margin: 6px 0;">
        ✅ ¡Reporte registrado exitosamente en la Zona de Staging!<br>
        • ID Transacción: REQ-20260921-X9K2<br>
        • Estado: Pendiente de Revisión
      </div>
    </li>
    <li>El formulario se limpiará automáticamente y <strong>su sesión permanecerá abierta</strong> en su departamento, permitiéndole reportar otro mes inmediatamente si lo necesita.</li>
  </ol>

  <div class="page-break"></div>

  <!-- PÁGINA 6: PREGUNTAS FRECUENTES -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Emisor</span>
  </div>

  <h1>5. Preguntas Frecuentes (FAQ) y Soporte</h1>

  <div class="no-break" style="margin-bottom: 16px;">
    <h3>¿Puedo modificar un reporte después de enviarlo?</h3>
    <p>
      Una vez enviado, el reporte queda en estado <em>"Pendiente de Revisión"</em> en la Zona de Staging. Si detecta un error de inmediato, notifíquelo a la <strong>Administración</strong> indicando el <code>ID de Transacción</code> para que lo eliminen de la lista antes de consolidarlo, y usted pueda volver a enviarlo corregido.
    </p>
  </div>

  <div class="no-break" style="margin-bottom: 16px;">
    <h3>¿Por qué no puedo escribir números negativos?</h3>
    <p>
      El sistema cuenta con validaciones estrictas de integridad. Todas las variables (estudiantes atendidos, beneficiarios, actividades) deben ser valores enteros mayores o iguales a 0.
    </p>
  </div>

  <div class="no-break" style="margin-bottom: 16px;">
    <h3>¿Qué ocurre si se cierra la pestaña del navegador?</h3>
    <p>
      Su sesión por departamento se mantiene en la memoria de la pestaña (<code>sessionStorage</code>). Si cierra por completo el navegador, por seguridad el sistema le solicitará ingresar nuevamente su PIN de 6 dígitos al volver a ingresar.
    </p>
  </div>

  <div class="no-break" style="margin-bottom: 16px;">
    <h3>¿Cómo sé si mi PIN fue actualizado correctamente?</h3>
    <p>
      Al presionar "Guardar PIN" en el modal de cambio de clave, aparecerá un indicador en verde confirmando la operación. A partir de ese segundo, cualquier nuevo acceso requerirá el nuevo PIN.
    </p>
  </div>

  <div class="callout callout-primary no-break" style="margin-top: 30px;">
    <strong>📞 Mesa de Ayuda y Contacto Administrativo</strong>
    <p>
      Para desbloqueo de claves, habilitación de nuevos meses de reporte o consultas sobre la clasificación de actividades, comuníquese con la <strong>Administración de la FaCES - UCV</strong>.
    </p>
  </div>

</body>
</html>`;
}

function getReceptorManualHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Manual de Usuario - Módulo Receptor FaCES UCV</title>
  <style>${commonStyles}</style>
</head>
<body>

  <!-- PORTADA -->
  <div class="cover">
    <div class="cover-header">
      <div class="cover-badge-ucv">FaCES</div>
      <div class="cover-inst-text">
        <h3>Universidad Central de Venezuela</h3>
        <p>Facultad de Ciencias Económicas y Sociales (FaCES)</p>
        <p>Sistema Automatizado de Reportes Académico-Administrativos</p>
      </div>
    </div>

    <div class="cover-body">
      <span class="cover-tag">Manual de Administración y Consolidación</span>
      <h1 class="cover-title">MÓDULO RECEPTOR DE REPORTES</h1>
      <div class="cover-subtitle">Gestión de Staging, Aprobaciones y Asistente de Copiado Inteligente</div>
      <p class="cover-desc">
        Este manual instruye a la Administración y Decanato de la FaCES en la operación del panel de recepción de reportes: control de acceso maestro por PIN, revisión y auditoría de transacciones en la Zona de Staging, administración centralizada de usuarios emisores y el uso del Asistente de Copiado Inteligente al macro archivo institucional.
      </p>
    </div>

    <div class="cover-footer">
      <div class="cover-meta">
        <p><strong>Destinatarios:</strong> Equipo de Administración, Decanato y Consolidadores de Datos</p>
        <p><strong>Versión del Sistema:</strong> 2.0 (Consolidación Desacoplada y Seguridad Multicapa)</p>
      </div>
      <div class="cover-meta" style="text-align: right;">
        <p><strong>Fecha de Emisión:</strong> Septiembre 2026</p>
        <p><strong>Facultad:</strong> FaCES - UCV</p>
      </div>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 2: ARQUITECTURA -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Receptor</span>
  </div>

  <h1>1. Arquitectura y Modelo Operativo</h1>
  <p>
    El <strong>Módulo Receptor</strong> es la cabina de mando desde la cual la Administración supervisa la información enviada por las 9 dependencias antes de que aterrice en el archivo final de Excel ("Seguimiento Físico").
  </p>

  <div class="callout callout-info">
    <strong>💡 Principio de Seguridad: El Desacople Total</strong>
    <p>
      El sistema nunca escribe de forma automatizada ni desatendida dentro del archivo Excel institucional. La estructura institucional cuenta con cabeceras profundas (más de 100 filas de formatos), celdas combinadas por mes y fórmulas anidadas de suma acumulativa. Para evitar cualquier riesgo de corrupción, el sistema utiliza el flujo de <strong>Copiado Inteligente</strong>: el software organiza y ordena los datos exactamente en la matriz requerida, y el consolidador los pega con un clic.
    </p>
  </div>

  <h2>Flujo de Trabajo del Receptor</h2>
  <div class="mockup-window no-break">
    <div class="mockup-header">
      <div class="mockup-dots"><span class="mockup-dot dot-red"></span><span class="mockup-dot dot-yellow"></span><span class="mockup-dot dot-green"></span></div>
      <span class="mockup-title">Ciclo de Consolidación FaCES</span>
      <span>Flujo Seguro</span>
    </div>
    <div class="mockup-content">
      <p><strong>Paso 1: Recepción en Staging ➔</strong> Las oficinas emiten reportes con ID único.</p>
      <p><strong>Paso 2: Inspección y Filtros ➔</strong> La Administración revisa consistencia y totales.</p>
      <p><strong>Paso 3: Aprobación ➔</strong> Se marca la transacción como <span class="badge badge-success">Aprobado</span>.</p>
      <p><strong>Paso 4: Copiado Inteligente ➔</strong> Con un clic se copia al portapapeles en el formato exacto.</p>
      <p><strong>Paso 5: Pegado en Macro ➔</strong> Se pega en el Google Sheet / Excel institucional sin alterar fórmulas.</p>
    </div>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 3: ACCESO Y SEGURIDAD -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Receptor</span>
  </div>

  <h1>2. Acceso y Seguridad Administrativa</h1>
  <p>
    El acceso a <code>/receptor</code> se encuentra protegido por una puerta de seguridad con PIN maestro para restringir la consola únicamente al personal autorizado.
  </p>

  <h2>Autenticación por PIN Maestro</h2>
  <ul>
    <li><strong>PIN Inicial de Fábrica:</strong> <span class="badge badge-warning">123456</span>.</li>
    <li>El consolidador ingresa los 6 dígitos en el teclado en pantalla o físico.</li>
    <li>La sesión se autoriza y guarda en la memoria del navegador (<code>FACES_RECEPTOR_AUTH</code>).</li>
  </ul>

  <h2>Botón de Bloqueo Rápido 🔒</h2>
  <p>
    En la esquina superior derecha del panel receptor encontrará el botón de bloqueo con ícono de candado:
  </p>
  <div style="background: #f1f5f9; border: 1px solid #cbd5e1; padding: 8px 15px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 12px;">
    <span style="font-size: 14pt;">🔒</span>
    <span style="font-weight: bold; font-size: 9.5pt; color: #0f172a;">Bloquear</span>
  </div>
  <p>
    Al pulsar este botón al levantarse de su puesto o retirarse, la sesión se cierra de inmediato y el panel queda oculto tras la pantalla de PIN.
  </p>

  <h2>Cambio del PIN Administrativo</h2>
  <ol>
    <li>Haga clic en el botón <strong>⚙️ Configuración</strong> en la barra superior.</li>
    <li>En la sección <strong>"Seguridad y PIN de Acceso"</strong>, ingrese:
      <ul>
        <li>El PIN actual.</li>
        <li>El nuevo PIN de 6 dígitos numéricos.</li>
        <li>Confirmación del nuevo PIN.</li>
      </ul>
    </li>
    <li>Presione <strong>"Actualizar PIN"</strong>.</li>
  </ol>

  <div class="callout callout-warning no-break">
    <strong>📍 ¿Dónde reside este PIN en Google Sheets?</strong>
    <p>
      El PIN del Receptor se almacena en la pestaña <strong><code>Configuración</code></strong> de la Hoja de Staging:
      <br>Celda A2: <code>PIN_RECEPTOR</code> | Celda B2: <code>123456</code>.
      <br>En caso de olvido, cualquier administrador con acceso a Google Drive puede abrir esa hoja y verificar o editar el valor de la celda B2 directamente.
    </p>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 4: MONITOREO Y STAGING -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Receptor</span>
  </div>

  <h1>3. Gestión de la Zona de Staging</h1>
  <p>
    La pantalla principal del receptor lista en tiempo real todas las transacciones recibidas desde los departamentos emisores.
  </p>

  <h2>Herramientas de Filtrado y Búsqueda</h2>
  <ul>
    <li><strong>Selector de Departamento:</strong> Permite aislar los reportes de una dependencia específica (ej. sólo <em>Biblioteca</em> o sólo <em>Pregrado</em>).</li>
    <li><strong>Filtro de Estado:</strong>
      <ul>
        <li><span class="badge badge-warning">Pendiente de Revisión</span>: Reportes recién llegados pendientes de validación.</li>
        <li><span class="badge badge-success">Aprobado</span>: Reportes revisados y listos para copiado institucional.</li>
      </ul>
    </li>
    <li><strong>Barra de Búsqueda:</strong> Busca instantáneamente por ID de transacción (ej. <code>REQ-20260921</code>) o por mes.</li>
  </ul>

  <h2>Inspección de Tarjetas de Transacción</h2>
  <div class="mockup-window no-break">
    <div class="mockup-header">
      <span class="mockup-title">Ejemplo de Reporte Recibido</span>
      <span class="badge badge-warning">Pendiente de Revisión</span>
    </div>
    <div class="mockup-content">
      <p style="font-size: 11pt; font-weight: bold; color: #ffffff;">Control de Estudios - Pregrado</p>
      <p style="color: #94a3b8; font-size: 8.5pt;">ID: REQ-20260921-8F3A • Mes: Marzo • Fecha: 21/09/2026 10:15 am</p>
      <div style="margin: 10px 0; background: #0f172a; padding: 8px; border-radius: 4px; font-size: 8.5pt;">
        📊 <strong>7 Carreras registradas</strong>: Administradores (45 ingresos, 12 egresos), Economistas (30 ingresos)...
      </div>
      <div style="display: flex; gap: 8px; justify-content: flex-end;">
        <span style="background: #15803d; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold;">✓ Aprobar</span>
        <span style="background: #2563eb; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold;">📋 Copiado Inteligente</span>
        <span style="background: #b91c1c; color: #ffffff; padding: 4px 8px; border-radius: 4px; font-size: 8pt; font-weight: bold;">🗑️ Eliminar</span>
      </div>
    </div>
  </div>

  <h2>Acciones Disponibles en cada Reporte</h2>
  <ol>
    <li><strong>Ver Detalles:</strong> Despliega el desglose completo del payload JSON recibido en una tabla legible.</li>
    <li><strong>Aprobar Reporte:</strong> Cambia el estado en la base de datos a "Aprobado", indicando al equipo que los datos fueron auditados.</li>
    <li><strong>Eliminar Reporte:</strong> Borra la transacción de la Zona de Staging en caso de duplicados o pruebas emitidas por error.</li>
    <li><strong>Limpiar Staging (Masivo):</strong> En el encabezado superior existe la opción de limpiar la hoja completa de Staging al cerrar el período mensual, preservando siempre la fila 1 de encabezados.</li>
  </ol>

  <div class="page-break"></div>

  <!-- PÁGINA 5: ASISTENTE DE COPIADO INTELIGENTE -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Receptor</span>
  </div>

  <h1>4. El Asistente de Copiado Inteligente</h1>
  <p>
    El <strong>Copiado Inteligente</strong> es la funcionalidad estrella para transferir los datos al archivo macro institucional sin riesgos técnicos.
  </p>

  <h2>¿Cómo Funciona?</h2>
  <p>
    Al presionar <strong>"Copiado Inteligente"</strong> en una tarjeta de reporte, el sistema:
  </p>
  <ol>
    <li>Identifica la hoja de destino exacta (ej. <code>Academia</code>, <code>Extensión</code> o <code>Estudiantes</code>).</li>
    <li>Detecta el mes reportado (ej. <code>Marzo</code>) y calcula las columnas exactas donde debe aterrizar cada variable.</li>
    <li>Construye una matriz de datos formateada para tabuladores (compatible con Excel y Google Sheets).</li>
    <li>Copia esa matriz al portapapeles de su sistema operativo y muestra en pantalla la celda recomendada de inicio (por ejemplo: <em>"Pegar en celda D114 de la hoja Academia"</em>).</li>
  </ol>

  <div class="callout callout-info no-break">
    <strong>📋 Pasos para Realizar el Pegado</strong>
    <ol style="margin-left: 15px; margin-top: 5px;">
      <li>Haga clic en <strong>"Copiar Datos"</strong> en la ventana del Asistente.</li>
      <li>Abra el archivo de Excel o Google Sheets institucional en otra pestaña o ventana.</li>
      <li>Ubíquese en la pestaña indicada y seleccione la celda de inicio.</li>
      <li>Presione <span class="key-pad">Ctrl</span> + <span class="key-pad">V</span> (Pegar). Los datos se distribuirán automáticamente en las columnas y filas correctas sin desplazar ni tocar las fórmulas del archivo.</li>
    </ol>
  </div>

  <div class="page-break"></div>

  <!-- PÁGINA 6: GESTIÓN DE USUARIOS Y MESES -->
  <div class="header-running">
    <span>Sistema de Reportes FaCES UCV</span>
    <span>Manual de Usuario — Módulo Receptor</span>
  </div>

  <h1>5. Gestión Centralizada de Usuarios y Meses</h1>
  <p>
    Como Administración, usted tiene la autoridad y control total sobre quién puede emitir reportes y en qué fechas.
  </p>

  <h2>Pestaña Usuarios en Google Sheets (Staging)</h2>
  <p>
    La autenticación de los 9 departamentos emisores se administra en la pestaña <strong><code>Usuarios</code></strong> de la Hoja de Staging:
  </p>
  <table>
    <thead>
      <tr>
        <th style="width: 60%;">Columna A: Departamento</th>
        <th style="width: 40%;">Columna B: PIN</th>
      </tr>
    </thead>
    <tbody>
      <tr><td>Control de Estudios - Pregrado</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Control de Estudios - Postgrado</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Servicio Comunitario</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Biblioteca</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Desarrollo Estudiantil</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Coordinación de Extensión</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Departamento de Compras</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Centro de Extensión Profesional</td><td><code>123456</code> (o clave personalizada)</td></tr>
      <tr><td>Instituto de Investigaciones</td><td><code>123456</code> (o clave personalizada)</td></tr>
    </tbody>
  </table>

  <div class="callout callout-warning no-break">
    <strong>💡 Soporte por Olvido de Clave de un Emisor</strong>
    <p>
      Si una oficina (por ejemplo, <em>Biblioteca</em>) olvidó su clave, usted no necesita programar nada: simplemente abra la hoja de Staging en Google Sheets, vaya a la pestaña <strong>Usuarios</strong>, ubique la fila de "Biblioteca" y lea el PIN o escriba uno nuevo directamente en la columna B.
    </p>
  </div>

  <h2>Control de Meses Habilitados</h2>
  <p>
    En la ventana de <strong>⚙️ Configuración</strong> del Receptor, puede marcar o desmarcar qué meses del año están activos para la recepción de información. Si desmarca un mes (por ejemplo, Julio y Agosto por vacaciones), los emisores no podrán seleccionarlo en sus formularios, garantizando el orden del calendario académico.
  </p>

  <div class="callout callout-primary no-break" style="margin-top: 30px;">
    <strong>✅ Resumen de Seguridad Operativa</strong>
    <p>
      El sistema FaCES combina autonomía departamental con estricto control central. La Zona de Staging actúa como escudo de datos, el Copiado Inteligente elimina el riesgo humano en fórmulas, y la gestión por PIN asegura la identidad de cada transacción.
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
  const fileUrl = 'file:///' + tempHtmlPath.replace(/\\\\/g, '/');

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

  // Conservar el archivo HTML generado en scripts/ para respaldo o inspección
}

function main() {
  console.log('=== Generador de Manuales de Usuario en PDF - FaCES UCV ===\\n');
  
  const emisorHtml = getEmisorManualHtml();
  generatePdf(emisorHtml, 'Manual_Usuario_Emisor_FaCES.pdf');

  const receptorHtml = getReceptorManualHtml();
  generatePdf(receptorHtml, 'Manual_Usuario_Receptor_FaCES.pdf');

  console.log('\\n✓ Todos los manuales PDF han sido generados exitosamente en la raíz del proyecto.');
}

main();
