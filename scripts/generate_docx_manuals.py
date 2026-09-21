import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

NAVY_BLUE = RGBColor(30, 58, 138)    # #1E3A8A
SLATE_DARK = RGBColor(15, 23, 42)   # #0F172A
BLUE_ACCENT = RGBColor(37, 99, 235)  # #2563EB
TEXT_MUTED = RGBColor(100, 116, 139) # #64748B
TEXT_DARK = RGBColor(30, 41, 59)     # #1E293B

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=120, bottom=120, left=160, right=160):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def setup_document_styles(doc):
    for section in doc.sections:
        section.top_margin = Inches(0.8)
        section.bottom_margin = Inches(0.8)
        section.left_margin = Inches(0.8)
        section.right_margin = Inches(0.8)

    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = TEXT_DARK

def add_header_footer(doc, title):
    for section in doc.sections:
        header = section.header
        hp = header.paragraphs[0]
        hp.alignment = WD_ALIGN_PARAGRAPH.RIGHT
        hrun = hp.add_run(f"Universidad Central de Venezuela | FaCES — {title}")
        hrun.font.size = Pt(8.5)
        hrun.font.color.rgb = TEXT_MUTED

        footer = section.footer
        fp = footer.paragraphs[0]
        fp.alignment = WD_ALIGN_PARAGRAPH.CENTER
        frun = fp.add_run("Sistema Automatizado de Reportes FaCES UCV — Septiembre 2026")
        frun.font.size = Pt(8.5)
        frun.font.color.rgb = TEXT_MUTED

def add_cover(doc, title, subtitle, target_audience):
    p_inst = doc.add_paragraph()
    r_inst = p_inst.add_run("UNIVERSIDAD CENTRAL DE VENEZUELA\nFACULTAD DE CIENCIAS ECONÓMICAS Y SOCIALES (FaCES)\nSISTEMA DE REPORTES ACADÉMICO-ADMINISTRATIVOS")
    r_inst.bold = True
    r_inst.font.size = Pt(11)
    r_inst.font.color.rgb = NAVY_BLUE
    p_inst.paragraph_format.space_after = Pt(24)

    p_badge = doc.add_paragraph()
    r_badge = p_badge.add_run("MANUAL DE USUARIO OFICIAL")
    r_badge.bold = True
    r_badge.font.size = Pt(10)
    r_badge.font.color.rgb = BLUE_ACCENT
    p_badge.paragraph_format.space_after = Pt(8)

    p_title = doc.add_paragraph()
    r_title = p_title.add_run(title)
    r_title.bold = True
    r_title.font.size = Pt(24)
    r_title.font.color.rgb = SLATE_DARK
    p_title.paragraph_format.space_after = Pt(6)

    p_sub = doc.add_paragraph()
    r_sub = p_sub.add_run(subtitle)
    r_sub.font.size = Pt(13)
    r_sub.font.color.rgb = BLUE_ACCENT
    p_sub.paragraph_format.space_after = Pt(20)

    p_box = doc.add_paragraph()
    p_box.paragraph_format.left_indent = Inches(0.2)
    p_box.paragraph_format.space_after = Pt(36)
    r_box = p_box.add_run("Este documento constituye la guía oficial de operación del sistema, abarcando desde la autenticación segura por clave numérica de 6 dígitos, hasta el llenado estructurado de métricas y la consolidación asistida en la hoja institucional.")
    r_box.font.size = Pt(10.5)
    r_box.font.color.rgb = TEXT_MUTED

    meta_table = doc.add_table(rows=3, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_data = [
        ("Destinatarios:", target_audience),
        ("Versión del Sistema:", "2.0 (Seguridad Multicapa y Gestión por PIN)"),
        ("Fecha de Publicación:", "Septiembre 2026 — FaCES UCV")
    ]
    for idx, (label, val) in enumerate(meta_data):
        c0 = meta_table.cell(idx, 0)
        c1 = meta_table.cell(idx, 1)
        c0.width = Inches(2.2)
        c1.width = Inches(4.5)
        set_cell_background(c0, "F1F5F9")
        set_cell_background(c1, "F8FAFC")
        set_cell_margins(c0, 60, 60, 100, 100)
        set_cell_margins(c1, 60, 60, 100, 100)
        
        p0 = c0.paragraphs[0]
        r0 = p0.add_run(label)
        r0.bold = True
        r0.font.size = Pt(9.5)
        r0.font.color.rgb = SLATE_DARK

        p1 = c1.paragraphs[0]
        r1 = p1.add_run(val)
        r1.font.size = Pt(9.5)
        r1.font.color.rgb = TEXT_DARK

    doc.add_page_break()

def add_heading_1(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(18)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(16)
    r.font.color.rgb = NAVY_BLUE

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(13)
    r.font.color.rgb = BLUE_ACCENT

def add_heading_3(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(2)
    h.paragraph_format.keep_with_next = True
    r = h.add_run(text)
    r.bold = True
    r.font.size = Pt(11)
    r.font.color.rgb = SLATE_DARK

def add_paragraph(doc, text, bold_prefix=None):
    p = doc.add_paragraph()
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.bold = True
        r_b.font.color.rgb = SLATE_DARK
    p.add_run(text)
    return p

def add_bullet(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_b = p.add_run(bold_prefix)
        r_b.bold = True
        r_b.font.color.rgb = SLATE_DARK
    p.add_run(text)
    return p

def add_callout(doc, title, text, style='info'):
    bg_map = {
        'info': ('F0FDF4', '15803D'),
        'warning': ('FFFBEB', 'B45309'),
        'alert': ('FEF2F2', 'B91C1C'),
        'primary': ('EFF6FF', '1E40AF')
    }
    fill_color, text_color = bg_map.get(style, ('F8FAFC', '1E293B'))

    table = doc.add_table(rows=1, cols=1)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = table.cell(0, 0)
    cell.width = Inches(6.7)
    set_cell_background(cell, fill_color)
    set_cell_margins(cell, 100, 100, 140, 140)

    p = cell.paragraphs[0]
    p.paragraph_format.space_after = Pt(3)
    r_t = p.add_run(f"📌 {title}\n")
    r_t.bold = True
    r_t.font.size = Pt(10)
    r_t.font.color.rgb = RGBColor.from_string(text_color)

    r_msg = p.add_run(text)
    r_msg.font.size = Pt(9.5)
    r_msg.font.color.rgb = TEXT_DARK
    
    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_after = Pt(6)

def add_custom_table(doc, headers, data):
    table = doc.add_table(rows=len(data) + 1, cols=len(headers))
    table.alignment = WD_TABLE_ALIGNMENT.CENTER

    # Headers
    for c_idx, h in enumerate(headers):
        cell = table.cell(0, c_idx)
        set_cell_background(cell, "1E3A8A")
        set_cell_margins(cell, 80, 80, 100, 100)
        p = cell.paragraphs[0]
        r = p.add_run(h)
        r.bold = True
        r.font.size = Pt(9.5)
        r.font.color.rgb = RGBColor(255, 255, 255)

    # Rows
    for r_idx, row in enumerate(data):
        bg = "F8FAFC" if r_idx % 2 == 1 else "FFFFFF"
        for c_idx, val in enumerate(row):
            cell = table.cell(r_idx + 1, c_idx)
            set_cell_background(cell, bg)
            set_cell_margins(cell, 60, 60, 100, 100)
            p = cell.paragraphs[0]
            r = p.add_run(str(val))
            r.font.size = Pt(9)
            r.font.color.rgb = TEXT_DARK

    p_after = doc.add_paragraph()
    p_after.paragraph_format.space_after = Pt(8)


def generate_emisor_docx():
    doc = Document()
    setup_document_styles(doc)
    add_header_footer(doc, "Manual de Usuario (Módulo Emisor)")

    add_cover(
        doc,
        title="MÓDULO EMISOR DE REPORTES",
        subtitle="Guía Operativa Paso a Paso para Dependencias y Departamentos Académicos",
        target_audience="Coordinadores, Secretarías y Asistentes de los 9 Departamentos Emisores"
    )

    add_heading_1(doc, "1. Introducción y Propósito del Sistema")
    add_paragraph(doc, "El Sistema de Reportes FaCES ha sido desarrollado para modernizar y asegurar la recolección de las estadísticas e indicadores institucionales de la Facultad de Ciencias Económicas y Sociales (FaCES - UCV). Anteriormente, la carga manual sobre el macro archivo de Excel rompía fórmulas complejas debido a inserciones accidentales de filas o desplazamientos de columnas combinadas.")
    add_paragraph(doc, "Con la implementación de este módulo, cada departamento dispone de una interfaz web intuitiva y validada que envía los datos a una Zona de Staging intermedia (Google Sheets), garantizando la integridad de la información institucional.")

    add_callout(
        doc,
        title="Beneficios Principales para los Emisores",
        text="• Sin contacto directo con el macro archivo: Se eliminan los errores por manipulación accidental de fórmulas.\n• Formularios a medida: Cada dependencia ve exclusivamente los campos y métricas que le corresponden.\n• Identificador Único: Cada envío genera un código de transacción único (ej. REQ-20260921-X4K2) que sirve como comprobante digital de entrega.\n• Acceso Protegido por PIN: Cada oficina cuenta con su propia clave de 6 dígitos numéricos.",
        style="info"
    )

    add_heading_2(doc, "Departamentos Emisores Oficiales")
    dept_headers = ["Departamento", "Área de Enfoque", "Hoja de Destino"]
    dept_rows = [
        ["Control de Estudios - Pregrado", "Matrícula de las 7 carreras / escuelas", "Academia (Pregrado)"],
        ["Control de Estudios - Postgrado", "21 programas (Especializaciones, Maestrías, Doctorados)", "Academia (Postgrado)"],
        ["Servicio Comunitario", "Proyectos académicos y labor comunitaria", "Academia / Extensión"],
        ["Biblioteca", "Atención a usuarios presencial/virtual y talleres", "Estudiantes (Biblioteca)"],
        ["Desarrollo Estudiantil", "Orientación vocacional y asistencia psicológica", "Estudiantes (Orientación)"],
        ["Coordinación de Extensión", "Actividades socioculturales, deportivas y cursos", "Extensión Universitaria"],
        ["Departamento de Compras", "Gestión de adquisiciones y mantenimiento", "Gastos de Funcionamiento"],
        ["Centro de Extensión Profesional", "Acompañamiento profesional y diplomados", "Extensión Profesional"],
        ["Instituto de Investigaciones", "Asesorías, acompañamiento e investigación tecnológica", "Investigación"]
    ]
    add_custom_table(doc, dept_headers, dept_rows)

    doc.add_page_break()

    add_heading_1(doc, "2. Acceso y Autenticación con PIN")
    add_paragraph(doc, "Para acceder a los formularios de reporte, abra su navegador web (Chrome, Edge, Firefox o Safari) e ingrese a la dirección asignada por la facultad: ")
    add_paragraph(doc, "https://[dominio-faces]/emisor", bold_prefix="URL de Acceso: ")

    add_heading_2(doc, "Procedimiento de Inicio de Sesión")
    add_bullet(doc, "Haga clic en el menú desplegable y seleccione el nombre de su dependencia oficial.", bold_prefix="1. Selección de Departamento: ")
    add_bullet(doc, "Introduzca la clave numérica de 6 dígitos en las casillas correspondientes. El cursor avanzará de forma automática de una casilla a la siguiente. Si comete un error, presione la tecla de retroceso (Backspace). Puede usar tanto su teclado físico como el teclado numérico en pantalla.", bold_prefix="2. Ingreso del PIN: ")
    add_bullet(doc, "El sistema viene configurado de fábrica con el PIN 123456 para todas las oficinas.", bold_prefix="3. PIN Inicial: ")
    add_bullet(doc, "Al completar el sexto dígito, el sistema valida las credenciales y le concede acceso directo al formulario.", bold_prefix="4. Acceso Concedido: ")

    add_callout(
        doc,
        title="¿Qué hacer si aparece 'PIN Incorrecto'?",
        text="Si el sistema indica que el PIN no coincide para su departamento, verifique que digitó los números correctamente. Si la clave fue cambiada y no la recuerdan en la oficina, debe comunicarse con la Administración. La Administración tiene acceso a la hoja central de Google Sheets y puede visualizar o reestablecer su PIN en segundos.",
        style="alert"
    )

    add_heading_1(doc, "3. Gestión de Seguridad y Cambio de PIN")
    add_paragraph(doc, "Cada oficina tiene la autonomía de cambiar su PIN de acceso para garantizar que únicamente el personal autorizado de esa dependencia cargue los reportes oficiales.")

    add_heading_2(doc, "Pasos para Cambiar el PIN")
    add_bullet(doc, "En la esquina superior derecha del formulario, haga clic en el botón 'Cambiar PIN' (identificado con el icono de una llave).", bold_prefix="1. Abrir Modal: ")
    add_bullet(doc, "Ingrese su clave vigente (por ejemplo, 123456).", bold_prefix="2. PIN Actual: ")
    add_bullet(doc, "Digite una nueva clave de exactamente 6 dígitos numéricos.", bold_prefix="3. Nuevo PIN: ")
    add_bullet(doc, "Vuelva a teclear el nuevo PIN para confirmar que no hubo errores tipográficos.", bold_prefix="4. Confirmación: ")
    add_bullet(doc, "Presione el botón 'Guardar PIN'. El cambio se aplicará de inmediato en la base de datos en Google Sheets.", bold_prefix="5. Guardado: ")

    add_callout(
        doc,
        title="Recomendación para la Oficina",
        text="Si más de una persona en su secretaría o coordinación se encarga de enviar reportes, asegúrese de comunicar el nuevo PIN a sus compañeros de oficina para evitar bloqueos involuntarios.",
        style="warning"
    )

    add_heading_2(doc, "Cierre de Sesión Seguro")
    add_paragraph(doc, "Al terminar de cargar los reportes o si va a dejar su estación de trabajo desatendida, presione el botón 'Cerrar Sesión' en la esquina superior derecha. Esto eliminará las credenciales activas del navegador y volverá a requerir el PIN para cualquier nueva interacción.")

    doc.add_page_break()

    add_heading_1(doc, "4. Llenado y Envío del Formulario")
    add_paragraph(doc, "El formulario está adaptado con la estructura institucional de su dependencia. Siga estas instrucciones para completar su carga mensual:")

    add_heading_2(doc, "Selección del Mes Reportado")
    add_paragraph(doc, "En la parte superior encontrará el selector 'Mes Reportado'. Seleccione el mes al que corresponden los datos. Recuerde que la Administración activa o restringe los meses disponibles de acuerdo con los plazos oficiales del calendario administrativo.")

    add_heading_2(doc, "Estructura por Tipo de Departamento")
    add_bullet(doc, "Presenta una cuadrícula con las 7 escuelas de la facultad (Administradores y Contadores, Economistas, Estadistas y Actuarios, Internacionalistas, Sociólogos, Trabajadores Sociales y Antropólogos). Ingrese los valores de Nuevos Ingresos, Egresados y Retiros. La casilla de 'Prosecución' se activará únicamente cuando el mes reportado sea Enero, cumpliendo con la normativa del formato institucional.", bold_prefix="Control de Estudios Pregrado: ")
    add_bullet(doc, "Contiene la lista completa de las 21 especializaciones, maestrías y doctorados de la FaCES para reportar matrícula de postgrado.", bold_prefix="Control de Estudios Postgrado: ")
    add_bullet(doc, "Se subdivide en dos pestañas: 'Academia' y 'Extensión'. Permite agregar proyectos dinámicos mediante el botón '+ Agregar Ítem'. Si en un mes no se realizaron actividades, marque la casilla formal 'Nada que reportar en este mes' para registrar el período en cero formalmente.", bold_prefix="Servicio Comunitario: ")
    add_bullet(doc, "Posee renglones para la atención ordinaria a usuarios (presencial y digital) y secciones para talleres de alfabetización informacional.", bold_prefix="Biblioteca: ")
    add_bullet(doc, "Incluye las variables fijas de atención psicológica estudiantil, orientación vocacional y asesoramiento académico.", bold_prefix="Desarrollo Estudiantil: ")
    add_bullet(doc, "Gestiona actividades socioculturales, deportivas, adecuaciones de malla curricular y programas formativos continuos.", bold_prefix="Coordinación de Extensión: ")

    add_heading_2(doc, "Envío a Staging y Persistencia de Sesión")
    add_paragraph(doc, "Una vez verificadas las cifras, presione el botón 'Enviar Reporte' ubicado al final del formulario:")
    add_bullet(doc, "El sistema procesará la solicitud y desplegará una alerta confirmando el éxito de la operación con su ID de Transacción (ej. REQ-20260921-A9F3).", bold_prefix="1. Confirmación en Pantalla: ")
    add_bullet(doc, "El formulario limpiará sus casillas automáticamente para evitar dobles envíos por error.", bold_prefix="2. Limpieza de Formulario: ")
    add_bullet(doc, "Su sesión permanecerá abierta en su departamento, lo que le permite seleccionar otro mes y cargar inmediatamente otro período sin tener que reingresar el PIN.", bold_prefix="3. Sesión Continua: ")

    add_heading_1(doc, "5. Preguntas Frecuentes (FAQ)")
    add_paragraph(doc, "Una vez enviado, el reporte queda en la Zona de Staging como 'Pendiente de Revisión'. Debe notificar a la Administración indicando su ID de transacción para que lo desestimen o eliminen antes de consolidarlo, y usted pueda volver a enviarlo corregido.", bold_prefix="¿Puedo modificar un reporte enviado? ")
    add_paragraph(doc, "No. El sistema valida estrictamente que todos los números sean enteros positivos mayores o iguales a 0.", bold_prefix="¿Puedo ingresar cifras negativas? ")
    add_paragraph(doc, "Sí. Al completar un envío, su sesión se mantiene. Solo debe cambiar el selector de 'Mes Reportado' y completar los datos correspondientes.", bold_prefix="¿Puedo reportar varios meses seguidos? ")
    add_paragraph(doc, "Comuníquese directamente con la Administración de la FaCES para solicitar el desbloqueo o restablecimiento inmediato de su clave.", bold_prefix="¿A quién acudo si se me olvida el PIN? ")

    output_path = "Manual_Usuario_Emisor_FaCES.docx"
    doc.save(output_path)
    print(f"[OK] Creado exitosamente: {output_path}")


def generate_receptor_docx():
    doc = Document()
    setup_document_styles(doc)
    add_header_footer(doc, "Manual de Usuario (Módulo Receptor - Administración)")

    add_cover(
        doc,
        title="MÓDULO RECEPTOR DE REPORTES",
        subtitle="Consolidación de Datos, Auditoría de Staging y Asistente de Copiado Inteligente",
        target_audience="Equipo de Administración, Decanato y Consolidadores del Seguimiento Físico"
    )

    add_heading_1(doc, "1. Introducción y Arquitectura del Módulo")
    add_paragraph(doc, "El Módulo Receptor es la consola central diseñada para que la Administración y el Decanato de la FaCES gestionen, validen y transfieran los datos reportados periódicamente por las distintas dependencias hacia el macro archivo centralizado de 'Seguimiento Físico'.")
    add_paragraph(doc, "El diseño del sistema resuelve el histórico problema de corrupción de fórmulas en el archivo Excel institucional mediante un modelo de arquitectura desacoplada.")

    add_callout(
        doc,
        title="El Concepto de la Zona de Staging y Copiado Inteligente",
        text="• Zona de Staging: Es una base de datos intermedia (en Google Sheets) que recibe y aísla las transacciones de los emisores con estado 'Pendiente de Revisión'. Los emisores nunca interactúan con el macro archivo.\n• Copiado Inteligente: En lugar de usar macros que intenten escribir de forma automática y rompan celdas combinadas o formatos de más de 100 filas, el sistema prepara la matriz exacta de celdas y asiste al consolidador para pegarla en un solo clic (Ctrl+V) en la celda destino adecuada sin tocar las fórmulas existentes.",
        style="info"
    )

    add_heading_1(doc, "2. Acceso y Seguridad Administrativa")
    add_paragraph(doc, "El acceso al módulo de administración (/receptor) está protegido mediante un PIN Maestro de 6 dígitos numéricos.")

    add_heading_2(doc, "Autenticación Inicial")
    add_bullet(doc, "123456.", bold_prefix="PIN Maestro Inicial: ")
    add_bullet(doc, "El sistema valida la credencial contra la hoja de cálculo y almacena la sesión en la memoria de la pestaña del navegador (sessionStorage).", bold_prefix="Validación: ")

    add_heading_2(doc, "Bloqueo Rápido 🔒")
    add_paragraph(doc, "En la esquina superior derecha se ubica el botón 'Bloquear' con icono de candado. Al levantarse de su puesto de trabajo, presione este botón para cerrar la sesión inmediatamente y ocultar los datos de la pantalla tras el modal de seguridad.")

    add_heading_2(doc, "Cambio de PIN del Receptor")
    add_paragraph(doc, "Para cambiar el PIN maestro de la Administración:")
    add_bullet(doc, "Haga clic en el botón '⚙️ Configuración' en la cabecera.", bold_prefix="1. Abrir Configuración: ")
    add_bullet(doc, "En la sección 'Seguridad y PIN de Acceso', introduzca el PIN actual, el nuevo PIN de 6 dígitos y su confirmación.", bold_prefix="2. Credenciales: ")
    add_bullet(doc, "Presione 'Actualizar PIN'. El cambio se escribirá directamente en la pestaña 'Configuración' de la Hoja de Staging (celda B2, bajo la clave PIN_RECEPTOR).", bold_prefix="3. Guardado: ")

    doc.add_page_break()

    add_heading_1(doc, "3. Gestión y Auditoría en la Zona de Staging")
    add_paragraph(doc, "La pantalla principal del receptor muestra el panel de transacciones entrantes con herramientas de filtrado y visualización detallada:")

    add_heading_2(doc, "Filtros y Búsqueda")
    add_bullet(doc, "Permite filtrar los registros de un departamento en particular (ej. ver únicamente lo recibido de Compras o Biblioteca).", bold_prefix="Filtro por Departamento: ")
    add_bullet(doc, "Alterna entre reportes 'Pendientes de Revisión' y reportes ya 'Aprobados'.", bold_prefix="Filtro por Estado: ")
    add_bullet(doc, "Localiza rápidamente una transacción introduciendo el ID (ej. REQ-20260921-X4K2) o el nombre del mes.", bold_prefix="Buscador en Tiempo Real: ")

    add_heading_2(doc, "Acciones por Transacción")
    add_bullet(doc, "Despliega una tabla organizada con todas las variables numéricas y notas reportadas por la dependencia.", bold_prefix="Ver Detalles: ")
    add_bullet(doc, "Marca la transacción como 'Aprobada' en la hoja de Staging, certificando que los datos fueron auditados.", bold_prefix="Aprobar Reporte: ")
    add_bullet(doc, "Elimina la fila de la transacción en Staging en caso de envíos erróneos o pruebas.", bold_prefix="Eliminar Reporte: ")
    add_bullet(doc, "Opción disponible para vaciar todas las transacciones de Staging una vez que se ha cerrado y consolidado el ciclo mensual, preservando siempre la fila de encabezados.", bold_prefix="Limpieza Masiva de Staging: ")

    add_heading_1(doc, "4. El Asistente de Copiado Inteligente")
    add_paragraph(doc, "Esta herramienta permite transferir los datos al archivo institucional en segundos sin riesgo de dañar las fórmulas.")

    add_heading_2(doc, "Instrucciones de Uso")
    add_bullet(doc, "En la tarjeta del reporte aprobado, presione el botón 'Copiado Inteligente'.", bold_prefix="1. Seleccionar Copiado: ")
    add_bullet(doc, "El modal le indicará la Hoja de Destino (ej. 'Academia', 'Extensión' o 'Estudiantes'), el bloque y la celda inicial recomendada (ej. celda D114).", bold_prefix="2. Identificar Coordenadas: ")
    add_bullet(doc, "Haga clic en 'Copiar Datos'. El sistema copia al portapapeles la matriz de datos con los tabuladores exactos requeridos por Excel y Google Sheets.", bold_prefix="3. Copiar al Portapapeles: ")
    add_bullet(doc, "Abra el archivo de Seguimiento Físico en otra ventana, posiciónese en la celda indicada y presione Ctrl+V (Pegar). Los números se insertarán exactamente en sus columnas correspondientes sin desplazar las fórmulas acumulativas.", bold_prefix="4. Pegar en el Archivo: ")

    doc.add_page_break()

    add_heading_1(doc, "5. Administración Centralizada de Usuarios (Pestaña 'Usuarios')")
    add_paragraph(doc, "La Administración tiene el control total sobre los accesos de los departamentos emisores. En la Hoja de Staging existe una pestaña dedicada llamada 'Usuarios':")

    users_headers = ["Columna A: Departamento", "Columna B: PIN"]
    users_rows = [
        ["Control de Estudios - Pregrado", "123456 (o clave personalizada)"],
        ["Control de Estudios - Postgrado", "123456 (o clave personalizada)"],
        ["Servicio Comunitario", "123456 (o clave personalizada)"],
        ["Biblioteca", "123456 (o clave personalizada)"],
        ["Desarrollo Estudiantil", "123456 (o clave personalizada)"],
        ["Coordinación de Extensión", "123456 (o clave personalizada)"],
        ["Departamento de Compras", "123456 (o clave personalizada)"],
        ["Centro de Extensión Profesional", "123456 (o clave personalizada)"],
        ["Instituto de Investigaciones", "123456 (o clave personalizada)"]
    ]
    add_custom_table(doc, users_headers, users_rows)

    add_callout(
        doc,
        title="Restablecimiento de PIN para Emisores",
        text="Si una secretaría o coordinación olvida su PIN, usted no necesita reprogramar nada en el sistema: simplemente abra la hoja de cálculo en Google Drive, diríjase a la pestaña 'Usuarios', ubique la fila del departamento correspondiente y lea la clave o cámbiela directamente en la columna B.",
        style="warning"
    )

    add_heading_1(doc, "6. Configuración de Meses Habilitados")
    add_paragraph(doc, "Desde el modal de '⚙️ Configuración' en el panel receptor, la Administración puede marcar y desmarcar qué meses del año están activos para la recepción de reportes. Si se desmarca un mes (por ejemplo, períodos vacacionales), dicho mes quedará deshabilitado en los formularios de todos los emisores, evitando cargas a destiempo.")

    output_path = "Manual_Usuario_Receptor_FaCES.docx"
    doc.save(output_path)
    print(f"[OK] Creado exitosamente: {output_path}")

if __name__ == '__main__':
    print("=== Generador de Manuales de Usuario en DOCX - FaCES UCV ===\n")
    generate_emisor_docx()
    generate_receptor_docx()
    print("\n[OK] Todos los manuales DOCX han sido generados exitosamente.")
