const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

const EDGE_PATH = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const HTML_FILE_PATH = path.resolve('FaCES_Sistema_Completo.html');
const SCREENSHOTS_DIR = path.resolve('scripts', 'screenshots');

if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const mockReports = [
  {
    id_transaccion: 'REQ-20261109-A4K2',
    fecha_emision: new Date().toISOString(),
    departamento_emisor: 'Control de Estudios - Pregrado',
    estado: 'Pendiente de Revisión',
    payload: {
      departamento_emisor: 'Control de Estudios - Pregrado',
      mes_reportado: 'Octubre',
      registros: [
        {
          hoja_destino: 'Academia',
          bloque: 'Control de Estudios - Pregrado',
          detalles: [
            {
              sub_bloque: 'Administradores y Contadores Públicos',
              descripcion_item: 'Administradores y Contadores Públicos',
              variables: { nuevos_ingresos: 125, egresados: 48, retiros: 12, prosecucion: 910 }
            },
            {
              sub_bloque: 'Economistas',
              descripcion_item: 'Economistas',
              variables: { nuevos_ingresos: 90, egresados: 35, retiros: 8, prosecucion: 620 }
            },
            {
              sub_bloque: 'Estadistas y Actuarios',
              descripcion_item: 'Estadistas y Actuarios',
              variables: { nuevos_ingresos: 45, egresados: 18, retiros: 4, prosecucion: 280 }
            },
            {
              sub_bloque: 'Internacionalistas',
              descripcion_item: 'Internacionalistas',
              variables: { nuevos_ingresos: 85, egresados: 40, retiros: 6, prosecucion: 510 }
            },
            {
              sub_bloque: 'Sociólogos',
              descripcion_item: 'Sociólogos',
              variables: { nuevos_ingresos: 50, egresados: 22, retiros: 5, prosecucion: 340 }
            },
            {
              sub_bloque: 'Trabajadores Sociales',
              descripcion_item: 'Trabajadores Sociales',
              variables: { nuevos_ingresos: 60, egresados: 28, retiros: 7, prosecucion: 390 }
            },
            {
              sub_bloque: 'Antropólogos',
              descripcion_item: 'Antropólogos',
              variables: { nuevos_ingresos: 40, egresados: 15, retiros: 3, prosecucion: 260 }
            }
          ]
        }
      ]
    }
  },
  {
    id_transaccion: 'REQ-20261108-Z9P1',
    fecha_emision: new Date(Date.now() - 86400000).toISOString(),
    departamento_emisor: 'Biblioteca',
    estado: 'Aprobado',
    payload: {
      departamento_emisor: 'Biblioteca',
      mes_reportado: 'Octubre',
      registros: [
        {
          hoja_destino: 'Estudiantes',
          bloque: '',
          detalles: [
            {
              descripcion_item: 'Atención presencial a usuarios en sala de lectura',
              variables: { nro_usuarios: 450, prestamos_sala: 320 }
            }
          ]
        }
      ]
    }
  },
  {
    id_transaccion: 'REQ-20261107-B3X8',
    fecha_emision: new Date(Date.now() - 172800000).toISOString(),
    departamento_emisor: 'Servicio Comunitario',
    estado: 'Pendiente de Revisión',
    payload: {
      departamento_emisor: 'Servicio Comunitario',
      mes_reportado: 'Octubre',
      registros: [
        {
          hoja_destino: 'Academia',
          bloque: 'Servicio comunitario (requisito para graduarse)',
          detalles: [
            {
              descripcion_item: 'Taller de Inducción al Servicio Comunitario 2026-II',
              variables: { nro_proyectos: 15, nro_estudiantes: 195 }
            }
          ]
        }
      ]
    }
  }
];

async function captureScreenshots() {
  console.log('Iniciando Edge para capturas exactas con mock local...');
  const browser = await puppeteer.launch({
    executablePath: EDGE_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    defaultViewport: {
      width: 1400,
      height: 900,
      deviceScaleFactor: 2
    }
  });

  const page = await browser.newPage();

  // Inyectar mock de fetch antes de cualquier script
  await page.evaluateOnNewDocument((reports) => {
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
      const urlStr = String(url);
      const bodyStr = options && options.body ? String(options.body) : '';

      if (bodyStr.includes('validarPin')) {
        return new Response(JSON.stringify({ status: 'success', valid: true, message: 'PIN verificado.' }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      if (bodyStr.includes('obtenerReportes') || urlStr.includes('gviz') || urlStr.includes('staging')) {
        return new Response(JSON.stringify({ status: 'success', reportes: reports }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ status: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    };
  }, mockReports);

  const fileUrl = 'file:///' + HTML_FILE_PATH.replace(/\\/g, '/');

  // 1. Hub Principal
  console.log('1. Capturando Hub Principal...');
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '01_hub_principal.png') });

  // 2. Portal Emisor - Selección de Departamentos
  console.log('2. Capturando Selección de Departamentos (Emisor)...');
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const emisorBtn = buttons.find(b => b.textContent.includes('Acceder como Emisor'));
    if (emisorBtn) emisorBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '02_emisor_seleccion_departamentos.png') });

  // 3. Formulario Control de Estudios - Pregrado
  console.log('3. Capturando Formulario Pregrado...');
  await page.evaluate(() => {
    const deptBtns = Array.from(document.querySelectorAll('main button'));
    const pregradoBtn = deptBtns.find(b => b.textContent.includes('Control de Estudios - Pregrado'));
    if (pregradoBtn) pregradoBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
    if (inputs.length >= 4) {
      inputs[0].value = '125';
      inputs[1].value = '48';
      inputs[2].value = '12';
      inputs.forEach(i => i.dispatchEvent(new Event('input', { bubbles: true })));
    }
  });
  await new Promise(r => setTimeout(r, 300));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '03_emisor_formulario_pregrado.png') });

  // 4. Formulario Servicio Comunitario
  console.log('4. Capturando Formulario Servicio Comunitario...');
  await page.evaluate(() => {
    const changeBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Cambiar Departamento'));
    if (changeBtn) changeBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => {
    const deptBtns = Array.from(document.querySelectorAll('main button'));
    const comBtn = deptBtns.find(b => b.textContent.includes('Servicio Comunitario'));
    if (comBtn) comBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '04_emisor_formulario_servicio_comunitario.png') });

  // 5. Portal Receptor - Pantalla de PIN de Acceso
  console.log('5. Capturando Pantalla de Autenticación con PIN...');
  await page.evaluate(() => {
    const hubBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Volver al Hub'));
    if (hubBtn) hubBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.evaluate(() => sessionStorage.clear());
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const recBtn = buttons.find(b => b.textContent.includes('Acceder como Revisor'));
    if (recBtn) recBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '05_receptor_login_pin.png') });

  // 6. Ingresar PIN y capturar Dashboard del Receptor
  console.log('6. Ingresando PIN y accediendo al Dashboard...');
  await page.evaluate(() => {
    sessionStorage.setItem('FACES_RECEPTOR_AUTH', 'true');
  });
  await page.goto(fileUrl, { waitUntil: 'networkidle0' });
  await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const recBtn = buttons.find(b => b.textContent.includes('Acceder como Revisor'));
    if (recBtn) recBtn.click();
  });
  await new Promise(r => setTimeout(r, 1000));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '06_receptor_dashboard_principal.png') });

  // 7. Abrir Modal de Auditoría y Copiado Inteligente
  console.log('7. Abriendo Modal de Auditoría Detallada y Copiado Inteligente...');
  const reviewBtnFound = await page.evaluate(() => {
    const reviewBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Revisar y Copiar Datos'));
    if (reviewBtn) {
      reviewBtn.click();
      return true;
    }
    return false;
  });
  console.log('Review button found and clicked:', reviewBtnFound);
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '07_receptor_modal_auditoria_detalle.png') });

  // Cerrar modal de auditoría
  console.log('Cerrando modal de auditoría...');
  await page.evaluate(() => {
    const closeBtns = Array.from(document.querySelectorAll('button'));
    const xBtn = closeBtns.find(b => b.querySelector('svg.lucide-x') || b.textContent.includes('Cerrar'));
    if (xBtn) xBtn.click();
  });
  await new Promise(r => setTimeout(r, 600));

  // 8. Abrir Modal de Configuración Administrativa
  console.log('8. Abriendo Modal de Configuración Administrativa...');
  await page.evaluate(() => {
    const configBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Configuración'));
    if (configBtn) configBtn.click();
  });
  await new Promise(r => setTimeout(r, 800));
  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, '08_receptor_modal_configuracion.png') });

  await browser.close();
  console.log('\n✓ ¡Todas las capturas de pantalla fueron generadas con éxito y fidelidad!');
}

captureScreenshots().catch(err => {
  console.error('Error al capturar pantallas:', err);
  process.exit(1);
});
