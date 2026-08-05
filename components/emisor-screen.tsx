'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface EmisorScreenProps {
  onBack: () => void
}

const DEPARTMENTS = [
  {
    id: 'control-estudios-pregrado',
    name: 'Control de Estudios - Pregrado',
    icon: '🎓',
    targets: [{ sheet: 'Academia', block: 'Control de Estudios - Pregrado' }],
  },
  {
    id: 'control-estudios-postgrado',
    name: 'Control de Estudios - Postgrado',
    icon: '🏛️',
    targets: [{ sheet: 'Academia', block: 'Control de Estudios - Postgrado' }],
  },
  {
    id: 'servicio-comunitario',
    name: 'Servicio Comunitario',
    icon: '🤝',
    targets: [
      { sheet: 'Academia', block: 'Servicio comunitario (requisito para graduarse)' },
      { sheet: 'Extensión', block: 'Servicio comunitario (labor social)' },
    ],
  },
  {
    id: 'biblioteca',
    name: 'Biblioteca',
    icon: '📚',
    targets: [{ sheet: 'Estudiantes', block: '' }],
  },
  {
    id: 'desarrollo-estudiantil',
    name: 'Desarrollo Estudiantil',
    icon: '🌱',
    targets: [{ sheet: 'Estudiantes', block: 'Servicios de Orientación y Asesoría Académica' }],
  },
  {
    id: 'coordinacion-extension',
    name: 'Coordinación de Extensión',
    icon: '📣',
    targets: [
      { sheet: 'Extensión', block: 'Actividades Socio-culturales' },
      { sheet: 'Estudiantes', block: 'Actividades deportivas' },
      { sheet: 'Academia', block: 'Actualización de malla curricular' },
    ],
  },
  {
    id: 'compras',
    name: 'Departamento de Compras',
    icon: '🛒',
    targets: [
      { sheet: 'Otros Gastos de Funcionamiento', block: 'Gestión administrativa' },
      { sheet: 'Otros Gastos de Funcionamiento', block: 'Conservaciòn y mantenimiento de infraestructura' },
    ],
  },
  {
    id: 'extension-profesional',
    name: 'Centro de Extensión Profesional',
    icon: '💼',
    targets: [{ sheet: 'Extensión', block: 'Acompañamiento Profesional' }],
  },
  {
    id: 'instituto-investigaciones',
    name: 'Instituto de Investigaciones',
    icon: '🔬',
    targets: [
      { sheet: 'Extensión', block: 'Acompañamiento Profesional' },
      { sheet: 'Academia', block: 'Tecnologías para el proceso de enseñanza' },
    ],
  },
]

const CATEGORIES = [
  'Información',
  'Solicitud',
  'Consulta',
  'Coordinación',
  'Otro',
]


export default function EmisorScreen({ onBack }: EmisorScreenProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })

  // States for Control de Estudios - Pregrado
  const [selectedMonth, setSelectedMonth] = useState('Enero')
  const [pregradoCareers, setPregradoCareers] = useState<{
    [key: string]: { nuevos_ingresos: number; egresados: number; retiros: number; prosecucion: number }
  }>({
    'Administradores y Contadores Públicos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Economistas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Estadistas y Actuarios': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Internacionalistas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Sociólogos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Trabajadores Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Antropólogos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
  })

  const handlePregradoCareerChange = (career: string, field: string, value: number) => {
    setPregradoCareers((prev) => ({
      ...prev,
      [career]: {
        ...prev[career],
        [field]: value >= 0 ? value : 0,
      },
    }))
  }

  // API Endpoint & Submission state
  const [stagingApiUrl, setStagingApiUrl] = useState(
    process.env.NEXT_PUBLIC_STAGING_API_URL ||
    'https://script.google.com/macros/s/AKfycbwxlEJlll2zMKmJzbf0cW_VAf8rbrzsBLly9AWIVL-ZoVXitqitZYJCmF4eGwRA4hn0/exec'
  )
  const [isSubmitting, setIsSubmitting] = useState(false)

  /**
   * Envía el payload JSON a la API Proxy local para registrar en Google Apps Script
   */
  const sendReportToStaging = async (payload: any): Promise<boolean> => {
    setIsSubmitting(true)
    try {
      const res = await fetch('/api/staging', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (data.status === 'success' || data.id_transaccion) {
        alert(
          `✅ ¡Reporte registrado exitosamente en la Zona de Staging!\n\n` +
          `• ID Transacción: ${data.id_transaccion || 'REQ-REGISTRADO'}\n` +
          `• Departamento: ${data.departamento_emisor || payload.departamento_emisor}\n` +
          `• Estado: ${data.estado || 'Pendiente de Revisión'}\n` +
          `• Fecha: ${data.fecha_emision ? new Date(data.fecha_emision).toLocaleString() : new Date().toLocaleString()}`
        )
        return true
      } else {
        alert(`❌ Error al registrar en la Zona de Staging:\n${data.message || 'Ocurrió un error inesperado'}`)
        return false
      }
    } catch (err: any) {
      console.error('Error al conectar con Google Apps Script:', err)
      alert(`⚠️ Advertencia de Conexión: No se pudo conectar con el servidor de Staging.\n\nDetalles: ${err.message || err}`)
      return false
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePregradoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      departamento_emisor: "Control de Estudios",
      mes_reportado: selectedMonth,
      registros: [
        {
          hoja_destino: "Estudiantes",
          bloque: "Pregrado",
          detalles: Object.entries(pregradoCareers).map(([careerName, careerData]) => {
            return {
              sub_bloque: careerName,
              variables: {
                nuevos_ingresos: careerData.nuevos_ingresos,
                egresados: careerData.egresados,
                retiros: careerData.retiros,
                ...(selectedMonth === 'Enero' ? { prosecucion: careerData.prosecucion } : {})
              }
            }
          })
        }
      ]
    }

    console.log('Pregrado Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset form & return to department selection
    setSelectedMonth('Enero')
    setPregradoCareers({
      'Administradores y Contadores Públicos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Economistas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Estadistas y Actuarios': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Internacionalistas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Sociólogos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Trabajadores Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Antropólogos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    })
    setSelectedDepartment('')
  }

  // States for Control de Estudios - Postgrado
  const [selectedPostgradoMonth, setSelectedPostgradoMonth] = useState('Enero')
  const [postgradoPrograms, setPostgradoPrograms] = useState<{
    [key: string]: { nuevos_ingresos: number; egresados: number; retiros: number; prosecucion: number }
  }>({
    'Especialista en Auditoría': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Finanzas de Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Mercadeo para Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Administración de Recursos Humanos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Análisis de Datos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Estadística': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Gerencia de Proyectos de Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Organización de Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Política y Comercio Petrolero Internacional': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Seguridad Social. Mención Bienestar Estudiantil': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Seguridad Social. Mención Seguridad y Salud en el Trabajo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Seguridad Social. Mención Bienestar Laboral': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Seguridad Social. Mención Gerencia Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Especialista en Seguridad Social. Mención Planificación de la Seguridad': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Ciencias Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Economía Internacional': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Economía y Administración de Hidrocarburos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Estadistica': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Estudios de la Mujer': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Gerencia Empresarial': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Gestión de Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Moneda e Instituciones Financieras': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Relaciones Internacionales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Seguridad Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Maestría en Teoría y Política Económica': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Ciencias Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Economía': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Estadística': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Gerencia': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Gestión de Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    'Doctorado en Seguridad Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
  })

  const handlePostgradoProgramChange = (programName: string, field: string, value: number) => {
    setPostgradoPrograms((prev) => ({
      ...prev,
      [programName]: {
        ...prev[programName],
        [field]: value >= 0 ? value : 0,
      },
    }))
  }


  const handlePostgradoSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      departamento_emisor: "Control de Estudios",
      mes_reportado: selectedPostgradoMonth,
      registros: [
        {
          hoja_destino: "Estudiantes",
          bloque: "Postgrado",
          detalles: Object.entries(postgradoPrograms).map(([programName, programData]) => {
            return {
              sub_bloque: programName,
              variables: {
                nuevos_ingresos: programData.nuevos_ingresos,
                egresados: programData.egresados,
                retiros: programData.retiros,
                ...(selectedPostgradoMonth === 'Enero' ? { prosecucion: programData.prosecucion } : {})
              }
            }
          })
        }
      ]
    }

    console.log('Postgrado Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset form & return to department selection
    setSelectedPostgradoMonth('Enero')
    setPostgradoPrograms({
      'Especialista en Auditoría': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Finanzas de Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Mercadeo para Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Administración de Recursos Humanos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Análisis de Datos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Estadística': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Gerencia de Proyectos de Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Organización de Empresas': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Política y Comercio Petrolero Internacional': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Seguridad Social. Mención Bienestar Estudiantil': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Seguridad Social. Mención Seguridad y Salud en el Trabajo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Seguridad Social. Mención Bienestar Laboral': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Seguridad Social. Mención Gerencia Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Especialista en Seguridad Social. Mención Planificación de la Seguridad': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Ciencias Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Economía Internacional': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Economía y Administración de Hidrocarburos': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Estadistica': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Estudios de la Mujer': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Gerencia Empresarial': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Gestión de la Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Moneda y Instituciones Financieras': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Planificación del Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Relaciones Internacionales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Seguridad Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Maestría en Teoría y Política Económica': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Ciencias Sociales': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Economía': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Estadística': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Gerencia': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Gestión de Investigación y Desarrollo': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
      'Doctorado en Seguridad Social': { nuevos_ingresos: 0, egresados: 0, retiros: 0, prosecucion: 0 },
    })
    setSelectedDepartment('')
  }

  // States for Servicio Comunitario
  const [selectedComunitarioMonth, setSelectedComunitarioMonth] = useState('Enero')
  const [comunitarioActiveTab, setComunitarioActiveTab] = useState<'academia' | 'extension'>('academia')

  const [nothingToReportAcademia, setNothingToReportAcademia] = useState(false)
  const [nothingToReportExtension, setNothingToReportExtension] = useState(false)

  interface AcademiaItem {
    descripcion_item: string
    actividades_realizadas: number
    estudiantes_atendidos: number
  }

  interface ExtensionItem {
    descripcion_item: string
    actividades_realizadas: number
    beneficiarios: number
  }

  const [academiaItems, setAcademiaItems] = useState<AcademiaItem[]>([
    { descripcion_item: '', actividades_realizadas: 0, estudiantes_atendidos: 0 }
  ])

  const [extensionItems, setExtensionItems] = useState<ExtensionItem[]>([
    { descripcion_item: '', actividades_realizadas: 0, beneficiarios: 0 }
  ])

  const handleAddAcademiaItem = () => {
    setAcademiaItems((prev) => [
      ...prev,
      { descripcion_item: '', actividades_realizadas: 0, estudiantes_atendidos: 0 }
    ])
  }

  const handleRemoveAcademiaItem = (index: number) => {
    setAcademiaItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAcademiaItemChange = (index: number, field: keyof AcademiaItem, value: string | number) => {
    setAcademiaItems((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value
      }
      return updated
    })
  }

  const handleAddExtensionItem = () => {
    setExtensionItems((prev) => [
      ...prev,
      { descripcion_item: '', actividades_realizadas: 0, beneficiarios: 0 }
    ])
  }

  const handleRemoveExtensionItem = (index: number) => {
    setExtensionItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleExtensionItemChange = (index: number, field: keyof ExtensionItem, value: string | number) => {
    setExtensionItems((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value
      }
      return updated
    })
  }

  const handleServicioComunitarioSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ensure all tabs have been answered
    const isAcademiaCompleted = nothingToReportAcademia || academiaItems.some(item => item.descripcion_item.trim() !== '')
    const isExtensionCompleted = nothingToReportExtension || extensionItems.some(item => item.descripcion_item.trim() !== '')

    if (!isAcademiaCompleted || !isExtensionCompleted) {
      const missing = []
      if (!isAcademiaCompleted) missing.push('Academia (Requisito de Graduación)')
      if (!isExtensionCompleted) missing.push('Extensión (Labor Social)')

      if (!isAcademiaCompleted) setComunitarioActiveTab('academia')
      else if (!isExtensionCompleted) setComunitarioActiveTab('extension')

      alert(`Atención: Debes contestar todas las pestañas antes de enviar el reporte.\n\nFalta por contestar:\n- ${missing.join('\n- ')}\n\n(Agrega al menos una actividad o marca 'Nada que reportar en esta sección').`)
      return
    }

    const payload = {
      departamento_emisor: "Servicio Comunitario",
      mes_reportado: selectedComunitarioMonth,
      registros: [
        {
          hoja_destino: "Academia",
          bloque: "Servicio comunitario (requisito para graduarse)",
          detalles: nothingToReportAcademia ? [] : academiaItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              actividades_realizadas: item.actividades_realizadas,
              estudiantes_atendidos: item.estudiantes_atendidos
            }
          }))
        },
        {
          hoja_destino: "Extensión",
          bloque: "Servicio comunitario (labor social)",
          detalles: nothingToReportExtension ? [] : extensionItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              actividades_realizadas: item.actividades_realizadas,
              beneficiarios: item.beneficiarios
            }
          }))
        }
      ]
    }

    console.log('Servicio Comunitario Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedComunitarioMonth('Enero')
    setComunitarioActiveTab('academia')
    setNothingToReportAcademia(false)
    setNothingToReportExtension(false)
    setAcademiaItems([{ descripcion_item: '', actividades_realizadas: 0, estudiantes_atendidos: 0 }])
    setExtensionItems([{ descripcion_item: '', actividades_realizadas: 0, beneficiarios: 0 }])
    setSelectedDepartment('')
  }

  // States for Biblioteca
  const [selectedBibliotecaMonth, setSelectedBibliotecaMonth] = useState('Enero')
  const [nothingToReportBiblioteca, setNothingToReportBiblioteca] = useState(false)
  const [fixedActivityAtendidos, setFixedActivityAtendidos] = useState(0)

  interface BibliotecaCustomItem {
    descripcion_item: string
    estudiantes_atendidos: number
  }

  const [bibliotecaCustomItems, setBibliotecaCustomItems] = useState<BibliotecaCustomItem[]>([])

  const handleAddBibliotecaCustomItem = () => {
    setBibliotecaCustomItems((prev) => [
      ...prev,
      { descripcion_item: '', estudiantes_atendidos: 0 }
    ])
  }

  const handleRemoveBibliotecaCustomItem = (index: number) => {
    setBibliotecaCustomItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleBibliotecaCustomItemChange = (index: number, field: keyof BibliotecaCustomItem, value: string | number) => {
    setBibliotecaCustomItems((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value
      }
      return updated
    })
  }

  const handleBibliotecaSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const detalles = []

    // Add fixed activity
    detalles.push({
      descripcion_item: "Atención de los estudiantes via on line y presencial",
      variables: {
        estudiantes_atendidos: fixedActivityAtendidos
      }
    })

    // Add custom activities if not marked as nothing to report
    if (!nothingToReportBiblioteca) {
      bibliotecaCustomItems.forEach((item) => {
        if (item.descripcion_item.trim() !== '') {
          detalles.push({
            descripcion_item: item.descripcion_item,
            variables: {
              estudiantes_atendidos: item.estudiantes_atendidos
            }
          })
        }
      })
    }

    const payload = {
      departamento_emisor: "Biblioteca",
      mes_reportado: selectedBibliotecaMonth,
      registros: [
        {
          hoja_destino: "Estudiantes",
          bloque: "Bibliotecas",
          detalles: detalles
        }
      ]
    }

    console.log('Biblioteca Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedBibliotecaMonth('Enero')
    setNothingToReportBiblioteca(false)
    setFixedActivityAtendidos(0)
    setBibliotecaCustomItems([])
    setSelectedDepartment('')
  }

  // States for Desarrollo Estudiantil
  const [selectedDesarrolloMonth, setSelectedDesarrolloMonth] = useState('Enero')
  const [nothingToReportDesarrollo, setNothingToReportDesarrollo] = useState(false)

  const FIXED_DESARROLLO_REPORTS = [
    "Atención psicológica estudiantil",
    "Evaluación psicológica - vocacional (Resolución 158)",
    "Asesoramiento de Bachilleres que solicitan información sobre los posibles cambios, estudios simultaneos, atención Psicológica, normas de permanencias, entre otros",
    "Evaluación psicológica grupal"
  ]

  const [desarrolloFixedReports, setDesarrolloFixedReports] = useState<{
    [key: string]: { servicios_prestados: number; estudiantes_beneficiados: number }
  }>({
    "Atención psicológica estudiantil": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
    "Evaluación psicológica - vocacional (Resolución 158)": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
    "Asesoramiento de Bachilleres que solicitan información sobre los posibles cambios, estudios simultaneos, atención Psicológica, normas de permanencias, entre otros": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
    "Evaluación psicológica grupal": { servicios_prestados: 0, estudiantes_beneficiados: 0 }
  })

  interface DesarrolloSpecialItem {
    descripcion_item: string
    servicios_prestados: number
    estudiantes_beneficiados: number
  }

  const [desarrolloSpecialItems, setDesarrolloSpecialItems] = useState<DesarrolloSpecialItem[]>([])

  const handleDesarrolloFixedChange = (reportName: string, field: 'servicios_prestados' | 'estudiantes_beneficiados', value: number) => {
    setDesarrolloFixedReports((prev) => ({
      ...prev,
      [reportName]: {
        ...prev[reportName],
        [field]: value >= 0 ? value : 0
      }
    }))
  }

  const handleAddDesarrolloSpecialItem = () => {
    setDesarrolloSpecialItems((prev) => [
      ...prev,
      { descripcion_item: '', servicios_prestados: 0, estudiantes_beneficiados: 0 }
    ])
  }

  const handleRemoveDesarrolloSpecialItem = (index: number) => {
    setDesarrolloSpecialItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDesarrolloSpecialItemChange = (index: number, field: keyof DesarrolloSpecialItem, value: string | number) => {
    setDesarrolloSpecialItems((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value
      }
      return updated
    })
  }

  const handleDesarrolloSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const detalles: Array<{
      descripcion_item: string
      variables: { servicios_prestados: number; estudiantes_beneficiados: number }
    }> = []

    if (!nothingToReportDesarrollo) {
      // 1. Add fixed reports
      Object.entries(desarrolloFixedReports).forEach(([reportName, data]) => {
        detalles.push({
          descripcion_item: reportName,
          variables: {
            servicios_prestados: data.servicios_prestados,
            estudiantes_beneficiados: data.estudiantes_beneficiados
          }
        })
      })

      // 2. Add special (extraordinary) reports
      desarrolloSpecialItems.forEach((item) => {
        if (item.descripcion_item.trim() !== '') {
          detalles.push({
            descripcion_item: item.descripcion_item,
            variables: {
              servicios_prestados: item.servicios_prestados,
              estudiantes_beneficiados: item.estudiantes_beneficiados
            }
          })
        }
      })
    }

    const payload = {
      departamento_emisor: "Desarrollo Estudiantil",
      mes_reportado: selectedDesarrolloMonth,
      registros: [
        {
          hoja_destino: "Estudiantes",
          bloque: "Servicios de Orientación y Asesoría Académica",
          detalles: detalles
        }
      ]
    }

    console.log('Desarrollo Estudiantil Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedDesarrolloMonth('Enero')
    setNothingToReportDesarrollo(false)
    setDesarrolloFixedReports({
      "Atención psicológica estudiantil": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
      "Evaluación psicológica - vocacional (Resolución 158)": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
      "Asesoramiento de Bachilleres que solicitan información sobre los posibles cambios, estudios simultaneos, atención Psicológica, normas de permanencias, entre otros": { servicios_prestados: 0, estudiantes_beneficiados: 0 },
      "Evaluación psicológica grupal": { servicios_prestados: 0, estudiantes_beneficiados: 0 }
    })
    setDesarrolloSpecialItems([])
    setSelectedDepartment('')
  }

  // States for Coordinación de Extensión
  const [selectedExtensionMonth, setSelectedExtensionMonth] = useState('Enero')
  const [extensionActiveTab, setExtensionActiveTab] = useState<'sociocultural' | 'deportiva' | 'mallacurricular'>('sociocultural')

  const [nothingToReportSociocultural, setNothingToReportSociocultural] = useState(false)
  const [nothingToReportDeportiva, setNothingToReportDeportiva] = useState(false)
  const [nothingToReportMallaCurricular, setNothingToReportMallaCurricular] = useState(false)

  interface SocioculturalItem {
    descripcion_item: string
    nro_eventos: number
    usuarios_beneficiados: number
  }

  interface DeportivaItem {
    descripcion_item: string
    nro_eventos_realizados: number
    nro_beneficiarios: number
  }

  interface MallaCurricularItem {
    descripcion_item: string
    nro_actividades: number
  }

  const [socioculturalItems, setSocioculturalItems] = useState<SocioculturalItem[]>([
    { descripcion_item: '', nro_eventos: 0, usuarios_beneficiados: 0 }
  ])

  const [deportivaItems, setDeportivaItems] = useState<DeportivaItem[]>([
    { descripcion_item: '', nro_eventos_realizados: 0, nro_beneficiarios: 0 }
  ])

  const [mallaCurricularItems, setMallaCurricularItems] = useState<MallaCurricularItem[]>([
    { descripcion_item: '', nro_actividades: 0 }
  ])

  // Handlers for Sociocultural
  const handleAddSocioculturalItem = () => {
    setSocioculturalItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_eventos: 0, usuarios_beneficiados: 0 }
    ])
  }
  const handleRemoveSocioculturalItem = (index: number) => {
    setSocioculturalItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleSocioculturalItemChange = (index: number, field: keyof SocioculturalItem, value: string | number) => {
    setSocioculturalItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // Handlers for Deportiva
  const handleAddDeportivaItem = () => {
    setDeportivaItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_eventos_realizados: 0, nro_beneficiarios: 0 }
    ])
  }
  const handleRemoveDeportivaItem = (index: number) => {
    setDeportivaItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleDeportivaItemChange = (index: number, field: keyof DeportivaItem, value: string | number) => {
    setDeportivaItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // Handlers for Malla Curricular
  const handleAddMallaCurricularItem = () => {
    setMallaCurricularItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_actividades: 0 }
    ])
  }
  const handleRemoveMallaCurricularItem = (index: number) => {
    setMallaCurricularItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleMallaCurricularItemChange = (index: number, field: keyof MallaCurricularItem, value: string | number) => {
    setMallaCurricularItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleCoordinacionExtensionSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ensure all tabs have been answered
    const isSocioculturalCompleted = nothingToReportSociocultural || socioculturalItems.some(item => item.descripcion_item.trim() !== '')
    const isDeportivaCompleted = nothingToReportDeportiva || deportivaItems.some(item => item.descripcion_item.trim() !== '')
    const isMallaCurricularCompleted = nothingToReportMallaCurricular || mallaCurricularItems.some(item => item.descripcion_item.trim() !== '')

    if (!isSocioculturalCompleted || !isDeportivaCompleted || !isMallaCurricularCompleted) {
      const missing = []
      if (!isSocioculturalCompleted) missing.push('Actividades Socio-culturales (Extensión)')
      if (!isDeportivaCompleted) missing.push('Actividades Deportivas (Estudiantes)')
      if (!isMallaCurricularCompleted) missing.push('Actualización Malla Curricular (Academia)')

      if (!isSocioculturalCompleted) setExtensionActiveTab('sociocultural')
      else if (!isDeportivaCompleted) setExtensionActiveTab('deportiva')
      else if (!isMallaCurricularCompleted) setExtensionActiveTab('mallacurricular')

      alert(`Atención: Debes contestar todas las pestañas antes de enviar el reporte.\n\nFalta por contestar:\n- ${missing.join('\n- ')}\n\n(Agrega al menos una actividad o marca 'Nada que reportar en esta sección').`)
      return
    }

    const payload = {
      departamento_emisor: "Coordinación de Extensión",
      mes_reportado: selectedExtensionMonth,
      registros: [
        {
          hoja_destino: "Extensión",
          bloque: "Actividades Socio-culturales",
          detalles: nothingToReportSociocultural ? [] : socioculturalItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_eventos: item.nro_eventos,
              usuarios_beneficiados: item.usuarios_beneficiados
            }
          }))
        },
        {
          hoja_destino: "Estudiantes",
          bloque: "Actividades deportivas",
          detalles: nothingToReportDeportiva ? [] : deportivaItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_eventos_realizados: item.nro_eventos_realizados,
              nro_beneficiarios: item.nro_beneficiarios
            }
          }))
        },
        {
          hoja_destino: "Academia",
          bloque: "Actualización de malla curricular",
          detalles: nothingToReportMallaCurricular ? [] : mallaCurricularItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_actividades: item.nro_actividades
            }
          }))
        }
      ]
    }

    console.log('Coordinación de Extensión Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedExtensionMonth('Enero')
    setExtensionActiveTab('sociocultural')
    setNothingToReportSociocultural(false)
    setNothingToReportDeportiva(false)
    setNothingToReportMallaCurricular(false)
    setSocioculturalItems([{ descripcion_item: '', nro_eventos: 0, usuarios_beneficiados: 0 }])
    setDeportivaItems([{ descripcion_item: '', nro_eventos_realizados: 0, nro_beneficiarios: 0 }])
    setMallaCurricularItems([{ descripcion_item: '', nro_actividades: 0 }])
    setSelectedDepartment('')
  }

  // States for Departamento de Compras
  const [selectedComprasMonth, setSelectedComprasMonth] = useState('Enero')
  const [comprasActiveTab, setComprasActiveTab] = useState<'gestion' | 'mantenimiento'>('gestion')

  const [nothingToReportGestion, setNothingToReportGestion] = useState(false)
  const [nothingToReportMantenimiento, setNothingToReportMantenimiento] = useState(false)

  interface ComprasItem {
    descripcion_item: string
    nro_actividad: number
    nro_beneficiados: number
  }

  const [gestionItems, setGestionItems] = useState<ComprasItem[]>([
    { descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }
  ])

  const [mantenimientoItems, setMantenimientoItems] = useState<ComprasItem[]>([
    { descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }
  ])

  // Handlers for Gestión Administrativa
  const handleAddGestionItem = () => {
    setGestionItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }
    ])
  }
  const handleRemoveGestionItem = (index: number) => {
    setGestionItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleGestionItemChange = (index: number, field: keyof ComprasItem, value: string | number) => {
    setGestionItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // Handlers for Mantenimiento
  const handleAddMantenimientoItem = () => {
    setMantenimientoItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }
    ])
  }
  const handleRemoveMantenimientoItem = (index: number) => {
    setMantenimientoItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleMantenimientoItemChange = (index: number, field: keyof ComprasItem, value: string | number) => {
    setMantenimientoItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleComprasSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ensure all tabs have been answered
    const isGestionCompleted = nothingToReportGestion || gestionItems.some(item => item.descripcion_item.trim() !== '')
    const isMantenimientoCompleted = nothingToReportMantenimiento || mantenimientoItems.some(item => item.descripcion_item.trim() !== '')

    if (!isGestionCompleted || !isMantenimientoCompleted) {
      const missing = []
      if (!isGestionCompleted) missing.push('Gestión Administrativa')
      if (!isMantenimientoCompleted) missing.push('Conservación y Mantenimiento de Infraestructura')

      if (!isGestionCompleted) setComprasActiveTab('gestion')
      else if (!isMantenimientoCompleted) setComprasActiveTab('mantenimiento')

      alert(`Atención: Debes contestar todas las pestañas antes de enviar el reporte.\n\nFalta por contestar:\n- ${missing.join('\n- ')}\n\n(Agrega al menos una actividad o marca 'Nada que reportar en esta sección').`)
      return
    }

    const payload = {
      departamento_emisor: "Departamento de Compras",
      mes_reportado: selectedComprasMonth,
      registros: [
        {
          hoja_destino: "Otros Gastos de Funcionamiento",
          bloque: "Gestión administrativa",
          detalles: nothingToReportGestion ? [] : gestionItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_actividad: item.nro_actividad,
              nro_beneficiados: item.nro_beneficiados
            }
          }))
        },
        {
          hoja_destino: "Otros Gastos de Funcionamiento",
          bloque: "Conservaciòn y mantenimiento de infraestructura",
          detalles: nothingToReportMantenimiento ? [] : mantenimientoItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_actividad: item.nro_actividad,
              nro_beneficiados: item.nro_beneficiados
            }
          }))
        }
      ]
    }

    console.log('Departamento de Compras Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedComprasMonth('Enero')
    setComprasActiveTab('gestion')
    setNothingToReportGestion(false)
    setNothingToReportMantenimiento(false)
    setGestionItems([{ descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }])
    setMantenimientoItems([{ descripcion_item: '', nro_actividad: 0, nro_beneficiados: 0 }])
    setSelectedDepartment('')
  }

  // States for Centro de Extensión Profesional
  const [selectedProfesionalMonth, setSelectedProfesionalMonth] = useState('Enero')
  const [nothingToReportProfesional, setNothingToReportProfesional] = useState(false)

  interface ProfesionalItem {
    descripcion_item: string
    nro_acompanamientos_realizados: number
    nro_personas_beneficiadas: number
  }

  const [profesionalItems, setProfesionalItems] = useState<ProfesionalItem[]>([
    { descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }
  ])

  const handleAddProfesionalItem = () => {
    setProfesionalItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }
    ])
  }

  const handleRemoveProfesionalItem = (index: number) => {
    setProfesionalItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleProfesionalItemChange = (index: number, field: keyof ProfesionalItem, value: string | number) => {
    setProfesionalItems((prev) => {
      const updated = [...prev]
      updated[index] = {
        ...updated[index],
        [field]: value
      }
      return updated
    })
  }

  const handleProfesionalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const payload = {
      departamento_emisor: "Centro de Extensión Profesional",
      mes_reportado: selectedProfesionalMonth,
      registros: [
        {
          hoja_destino: "Extensión",
          bloque: "Acompañamiento Profesional",
          detalles: nothingToReportProfesional ? [] : profesionalItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_acompanamientos_realizados: item.nro_acompanamientos_realizados,
              nro_personas_beneficiadas: item.nro_personas_beneficiadas
            }
          }))
        }
      ]
    }

    console.log('Centro de Extensión Profesional Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedProfesionalMonth('Enero')
    setNothingToReportProfesional(false)
    setProfesionalItems([{ descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }])
    setSelectedDepartment('')
  }

  // States for Instituto de Investigaciones
  const [selectedInvestigacionesMonth, setSelectedInvestigacionesMonth] = useState('Enero')
  const [investigacionesActiveTab, setInvestigacionesActiveTab] = useState<'acompanamiento' | 'tecnologias'>('acompanamiento')

  const [nothingToReportAcompanamiento, setNothingToReportAcompanamiento] = useState(false)
  const [nothingToReportTecnologias, setNothingToReportTecnologias] = useState(false)

  interface InvestigacionesAcompanamientoItem {
    descripcion_item: string
    nro_acompanamientos_realizados: number
    nro_personas_beneficiadas: number
  }

  interface InvestigacionesTecnologiasItem {
    descripcion_item: string
    nro_actividades: number
  }

  const [investigacionesAcompanamientoItems, setInvestigacionesAcompanamientoItems] = useState<InvestigacionesAcompanamientoItem[]>([
    { descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }
  ])

  const [investigacionesTecnologiasItems, setInvestigacionesTecnologiasItems] = useState<InvestigacionesTecnologiasItem[]>([
    { descripcion_item: '', nro_actividades: 0 }
  ])

  // Handlers for Acompañamiento Profesional
  const handleAddInvestigacionesAcompanamientoItem = () => {
    setInvestigacionesAcompanamientoItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }
    ])
  }
  const handleRemoveInvestigacionesAcompanamientoItem = (index: number) => {
    setInvestigacionesAcompanamientoItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleInvestigacionesAcompanamientoItemChange = (
    index: number,
    field: keyof InvestigacionesAcompanamientoItem,
    value: string | number
  ) => {
    setInvestigacionesAcompanamientoItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  // Handlers for Tecnologías para el Proceso de Enseñanza
  const handleAddInvestigacionesTecnologiasItem = () => {
    setInvestigacionesTecnologiasItems((prev) => [
      ...prev,
      { descripcion_item: '', nro_actividades: 0 }
    ])
  }
  const handleRemoveInvestigacionesTecnologiasItem = (index: number) => {
    setInvestigacionesTecnologiasItems((prev) => prev.filter((_, i) => i !== index))
  }
  const handleInvestigacionesTecnologiasItemChange = (
    index: number,
    field: keyof InvestigacionesTecnologiasItem,
    value: string | number
  ) => {
    setInvestigacionesTecnologiasItems((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleInvestigacionesSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ensure all tabs have been answered
    const isAcompanamientoCompleted =
      nothingToReportAcompanamiento || investigacionesAcompanamientoItems.some(item => item.descripcion_item.trim() !== '')
    const isTecnologiasCompleted =
      nothingToReportTecnologias || investigacionesTecnologiasItems.some(item => item.descripcion_item.trim() !== '')

    if (!isAcompanamientoCompleted || !isTecnologiasCompleted) {
      const missing = []
      if (!isAcompanamientoCompleted) missing.push('Acompañamiento Profesional (Extensión)')
      if (!isTecnologiasCompleted) missing.push('Tecnologías para el Proceso de Enseñanza (Academia)')

      if (!isAcompanamientoCompleted) setInvestigacionesActiveTab('acompanamiento')
      else if (!isTecnologiasCompleted) setInvestigacionesActiveTab('tecnologias')

      alert(`Atención: Debes contestar todas las pestañas antes de enviar el reporte.\n\nFalta por contestar:\n- ${missing.join('\n- ')}\n\n(Agrega al menos una actividad o marca 'Nada que reportar en esta sección').`)
      return
    }

    const payload = {
      departamento_emisor: "Instituto de Investigaciones",
      mes_reportado: selectedInvestigacionesMonth,
      registros: [
        {
          hoja_destino: "Extensión",
          bloque: "Acompañamiento Profesional",
          detalles: nothingToReportAcompanamiento ? [] : investigacionesAcompanamientoItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_acompanamientos_realizados: item.nro_acompanamientos_realizados,
              nro_personas_beneficiadas: item.nro_personas_beneficiadas
            }
          }))
        },
        {
          hoja_destino: "Academia",
          bloque: "Tecnologías para el proceso de enseñanza",
          detalles: nothingToReportTecnologias ? [] : investigacionesTecnologiasItems.map((item) => ({
            descripcion_item: item.descripcion_item,
            variables: {
              nro_actividades: item.nro_actividades
            }
          }))
        }
      ]
    }

    console.log('Instituto de Investigaciones Payload:', payload)
    const success = await sendReportToStaging(payload)
    if (!success) return

    // Reset Form & return to department selection
    setSelectedInvestigacionesMonth('Enero')
    setInvestigacionesActiveTab('acompanamiento')
    setNothingToReportAcompanamiento(false)
    setNothingToReportTecnologias(false)
    setInvestigacionesAcompanamientoItems([{ descripcion_item: '', nro_acompanamientos_realizados: 0, nro_personas_beneficiadas: 0 }])
    setInvestigacionesTecnologiasItems([{ descripcion_item: '', nro_actividades: 0 }])
    setSelectedDepartment('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Report sent from:', selectedDepartment, 'Data:', formData)
    const payload = {
      departamento_emisor: selectedDepartment,
      mes_reportado: "Enero",
      datos: formData
    }
    const success = await sendReportToStaging(payload)
    if (!success) return

    setFormData({ title: '', description: '', category: '' })
    setSelectedDepartment('')
  }

  // Department Selection Screen
  if (!selectedDepartment) {
    return (
      <div className="min-h-screen bg-background">
        <div className="fixed top-4 right-4 z-40">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-card hover:bg-muted text-foreground border border-border shadow-md"
          >
            ← Volver
          </Button>
        </div>

        {/* Header */}
        <header className="bg-gradient-to-r from-primary to-secondary text-white p-6">
          <div className="mx-auto max-w-6xl px-6 py-6 flex items-center gap-4">
            <Image
              src="/faces_logo_dark.png"
              alt="FaCES UCV"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold">Sistema de Reportes FaCES</h1>
          </div>
        </header>

        {/* Department Selection */}
        <main className="mx-auto max-w-6xl px-6 py-12">
          <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-2 text-foreground">Seleccione su Departamento</h2>
            <p className="text-muted-foreground mb-8">
              Elija el departamento desde el cual desea enviar el reporte
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {DEPARTMENTS.map((dept) => (
                <button
                  key={dept.id}
                  onClick={() => setSelectedDepartment(dept.name)}
                  className="p-6 rounded-lg border-2 border-border hover:border-secondary bg-card hover:bg-muted transition-all text-left group"
                >
                  <span className="text-4xl mb-3 block group-hover:scale-110 transition-transform">
                    {dept.icon}
                  </span>
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {dept.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Report Form Screen
  return (
    <div className="min-h-screen bg-background">
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-card hover:bg-muted text-foreground border border-border shadow-md"
        >
          ← Volver
        </Button>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-primary to-secondary text-white p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-4">
            <Image
              src="/faces_logo_dark.png"
              alt="FaCES UCV"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold">Sistema de Reportes FaCES</h1>
          </div>
          <div className="text-white/80 ml-12 flex flex-col sm:flex-row sm:gap-6 text-sm">
            <span>Departamento: <span className="font-semibold">{selectedDepartment}</span></span>
            {(() => {
              const currentDept = DEPARTMENTS.find((d) => d.name === selectedDepartment);
              if (!currentDept) return null;
              return (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="opacity-90">Destinos:</span>
                  {currentDept.targets.map((t, idx) => (
                    <span
                      key={idx}
                      className="font-semibold bg-white/20 px-2 py-0.5 rounded text-xs ml-1"
                    >
                      {t.sheet} {t.block ? `(${t.block})` : ''}
                    </span>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          {selectedDepartment === 'Control de Estudios - Pregrado' ? (
            // Custom Pregrado Form
            <form onSubmit={handlePregradoSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Pregrado</h2>
              </div>

              {/* Mes Reportado */}
              <div className="space-y-2 max-w-xs">
                <label htmlFor="pregrado-month" className="block text-sm font-semibold text-foreground">
                  Mes Reportado
                </label>
                <select
                  id="pregrado-month"
                  required
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {selectedMonth === 'Enero' && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 font-medium mt-1">
                    ⚠️ Se ha habilitado el campo de "Prosecución" para el mes de Enero.
                  </p>
                )}
              </div>

              {/* Careers Grid */}
              <div className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground">Matrícula por Carrera</h3>

                <div className="space-y-6">
                  {Object.keys(pregradoCareers).map((careerName) => {
                    const careerData = pregradoCareers[careerName]
                    return (
                      <div key={careerName} className="p-5 rounded-xl border border-border bg-muted/30 space-y-4">
                        <h4 className="font-bold text-base text-primary">{careerName}</h4>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Nuevos Ingresos */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Nuevos Ingresos</label>
                            <input
                              type="number"
                              min={0}
                              required
                              className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                              value={careerData.nuevos_ingresos}
                              onChange={(e) => handlePregradoCareerChange(careerName, 'nuevos_ingresos', parseInt(e.target.value) || 0)}
                            />
                          </div>

                          {/* Egresados */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Egresados</label>
                            <input
                              type="number"
                              min={0}
                              required
                              className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                              value={careerData.egresados}
                              onChange={(e) => handlePregradoCareerChange(careerName, 'egresados', parseInt(e.target.value) || 0)}
                            />
                          </div>

                          {/* Retiros */}
                          <div className="space-y-1">
                            <label className="text-xs font-semibold text-muted-foreground">Retiros</label>
                            <input
                              type="number"
                              min={0}
                              required
                              className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                              value={careerData.retiros}
                              onChange={(e) => handlePregradoCareerChange(careerName, 'retiros', parseInt(e.target.value) || 0)}
                            />
                          </div>

                          {/* Prosecución - Only if month is Enero */}
                          {selectedMonth === 'Enero' && (
                            <div className="space-y-1 sm:col-span-3 border-t border-border/40 pt-3 mt-1">
                              <label className="text-xs font-semibold text-amber-600 dark:text-amber-500 flex items-center gap-1">
                                <span>Prosecución (Requerido para Enero)</span>
                              </label>
                              <input
                                type="number"
                                min={0}
                                required
                                className="w-full sm:max-w-xs rounded-lg border border-amber-300 bg-amber-50/10 px-3 py-1.5 text-sm text-foreground focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                                value={careerData.prosecucion}
                                onChange={(e) => handlePregradoCareerChange(careerName, 'prosecucion', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDepartment('')}
                  className="flex-1"
                >
                  Cambiar Departamento
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                      Enviando a Staging...
                    </>
                  ) : (
                    'Enviar Reporte'
                  )}
                </Button>
              </div>
            </form>
          ) : selectedDepartment === 'Control de Estudios - Postgrado' ? (
            // Custom Postgrado Form
            <form onSubmit={handlePostgradoSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Postgrado</h2>
              </div>

              {/* Mes Reportado */}
              <div className="space-y-2 max-w-xs">
                <label htmlFor="postgrado-month" className="block text-sm font-semibold text-foreground">
                  Mes Reportado
                </label>
                <select
                  id="postgrado-month"
                  required
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={selectedPostgradoMonth}
                  onChange={(e) => setSelectedPostgradoMonth(e.target.value)}
                >
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
                {selectedPostgradoMonth === 'Enero' && (
                  <p className="text-xs text-amber-600 dark:text-amber-500 font-medium mt-1">
                    ⚠️ Se ha habilitado el campo de "Prosecución" para el mes de Enero.
                  </p>
                )}
              </div>

              {/* Programs Grid (2 COLUMNS) */}
              <div className="space-y-6 pt-4 border-t border-border">
                <h3 className="text-lg font-bold text-foreground">Matrícula por Programa</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(postgradoPrograms).map((programName) => {
                    const programData = postgradoPrograms[programName]
                    return (
                      <div key={programName} className="p-4 rounded-xl border border-border bg-muted/30 space-y-3 flex flex-col justify-between">
                        <h4 className="font-bold text-sm text-primary leading-snug">{programName}</h4>

                        <div className="space-y-3">
                          <div className="grid grid-cols-3 gap-2">
                            {/* Nuevos Ingresos */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">N. Ingresos</label>
                              <input
                                type="number"
                                min={0}
                                required
                                className="w-full rounded-lg border border-border bg-input px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                                value={programData.nuevos_ingresos}
                                onChange={(e) => handlePostgradoProgramChange(programName, 'nuevos_ingresos', parseInt(e.target.value) || 0)}
                              />
                            </div>

                            {/* Egresados */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Egresados</label>
                              <input
                                type="number"
                                min={0}
                                required
                                className="w-full rounded-lg border border-border bg-input px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                                value={programData.egresados}
                                onChange={(e) => handlePostgradoProgramChange(programName, 'egresados', parseInt(e.target.value) || 0)}
                              />
                            </div>

                            {/* Retiros */}
                            <div className="space-y-1">
                              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider block">Retiros</label>
                              <input
                                type="number"
                                min={0}
                                required
                                className="w-full rounded-lg border border-border bg-input px-2 py-1 text-xs text-foreground focus:border-primary focus:outline-none"
                                value={programData.retiros}
                                onChange={(e) => handlePostgradoProgramChange(programName, 'retiros', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          </div>

                          {/* Prosecución - Only if month is Enero */}
                          {selectedPostgradoMonth === 'Enero' && (
                            <div className="space-y-1 border-t border-border/40 pt-2">
                              <label className="text-[10px] font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wider block">
                                Prosecución
                              </label>
                              <input
                                type="number"
                                min={0}
                                required
                                className="w-full rounded-lg border border-amber-300 bg-amber-50/10 px-2 py-1 text-xs text-foreground focus:border-amber-500 focus:outline-none"
                                value={programData.prosecucion}
                                onChange={(e) => handlePostgradoProgramChange(programName, 'prosecucion', parseInt(e.target.value) || 0)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDepartment('')}
                  className="flex-1"
                >
                  Cambiar Departamento
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                      Enviando a Staging...
                    </>
                  ) : (
                    'Enviar Reporte'
                  )}
                </Button>
              </div>
            </form>
          ) : selectedDepartment === 'Servicio Comunitario' ? (
            // Custom Servicio Comunitario Form
            <form onSubmit={handleServicioComunitarioSubmit} className="space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Servicio Comunitario</h2>
              </div>

              {/* Mes Reportado */}
              <div className="space-y-2 max-w-xs">
                <label htmlFor="comunitario-month" className="block text-sm font-semibold text-foreground">
                  Mes Reportado
                </label>
                <select
                  id="comunitario-month"
                  required
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={selectedComunitarioMonth}
                  onChange={(e) => setSelectedComunitarioMonth(e.target.value)}
                >
                  {[
                    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                  ].map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tabs Navigation */}
              <div className="flex border-b border-border mt-6">
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${comunitarioActiveTab === 'academia'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setComunitarioActiveTab('academia')}
                >
                  Academia (Requisito de Graduación)
                  {(nothingToReportAcademia || academiaItems.some(i => i.descripcion_item.trim() !== '')) ? (
                    <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                  ) : (
                    <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                  )}
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${comunitarioActiveTab === 'extension'
                      ? 'border-primary text-primary'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  onClick={() => setComunitarioActiveTab('extension')}
                >
                  Extensión (Labor Social)
                  {(nothingToReportExtension || extensionItems.some(i => i.descripcion_item.trim() !== '')) ? (
                    <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                  ) : (
                    <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                  )}
                </button>
              </div>

              {/* Tab content: Academia */}
              {comunitarioActiveTab === 'academia' && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      id="nothing-academia"
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={nothingToReportAcademia}
                      onChange={(e) => setNothingToReportAcademia(e.target.checked)}
                    />
                    <label htmlFor="nothing-academia" className="text-sm font-medium text-foreground select-none cursor-pointer">
                      Nada que reportar en esta sección (Academia)
                    </label>
                  </div>

                  {!nothingToReportAcademia && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-foreground">Actividades Requisito de Grado</h3>
                        <Button
                          type="button"
                          onClick={handleAddAcademiaItem}
                          variant="outline"
                          className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                        >
                          + Agregar Actividad
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {academiaItems.map((item, idx) => (
                          <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                              {academiaItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAcademiaItem(idx)}
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ej. Proyecto de alfabetización digital comunitaria..."
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.descripcion_item}
                                  onChange={(e) => handleAcademiaItemChange(idx, 'descripcion_item', e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Número de Actividades Realizadas</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.actividades_realizadas}
                                    onChange={(e) => handleAcademiaItemChange(idx, 'actividades_realizadas', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Estudiantes Atendidos</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.estudiantes_atendidos}
                                    onChange={(e) => handleAcademiaItemChange(idx, 'estudiantes_atendidos', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab content: Extension */}
              {comunitarioActiveTab === 'extension' && (
                <div className="space-y-6 pt-4">
                  <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                    <input
                      type="checkbox"
                      id="nothing-extension"
                      className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                      checked={nothingToReportExtension}
                      onChange={(e) => setNothingToReportExtension(e.target.checked)}
                    />
                    <label htmlFor="nothing-extension" className="text-sm font-medium text-foreground select-none cursor-pointer">
                      Nada que reportar en esta sección (Extensión)
                    </label>
                  </div>

                  {!nothingToReportExtension && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-foreground">Actividades de Labor Social</h3>
                        <Button
                          type="button"
                          onClick={handleAddExtensionItem}
                          variant="outline"
                          className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                        >
                          + Agregar Actividad
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {extensionItems.map((item, idx) => (
                          <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                              {extensionItems.length > 1 && (
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExtensionItem(idx)}
                                  className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                >
                                  Eliminar
                                </button>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ej. Taller de educación financiera básica..."
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.descripcion_item}
                                  onChange={(e) => handleExtensionItemChange(idx, 'descripcion_item', e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Actividades Realizadas</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.actividades_realizadas}
                                    onChange={(e) => handleExtensionItemChange(idx, 'actividades_realizadas', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Beneficiarios</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.beneficiarios}
                                    onChange={(e) => handleExtensionItemChange(idx, 'beneficiarios', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-border mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDepartment('')}
                  className="flex-1"
                >
                  Cambiar Departamento
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                      Enviando a Staging...
                    </>
                  ) : (
                    'Enviar Reporte'
                  )}
                </Button>
              </div>
            </form>
            ) : selectedDepartment === 'Biblioteca' ? (
              // Custom Biblioteca Form
              <form onSubmit={handleBibliotecaSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Biblioteca</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="biblioteca-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="biblioteca-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedBibliotecaMonth}
                    onChange={(e) => setSelectedBibliotecaMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkbox "Nada que reportar" */}
                <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="nothing-biblioteca"
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    checked={nothingToReportBiblioteca}
                    onChange={(e) => setNothingToReportBiblioteca(e.target.checked)}
                  />
                  <label htmlFor="nothing-biblioteca" className="text-sm font-medium text-foreground select-none cursor-pointer">
                    Nada que reportar en este mes
                  </label>
                </div>

                {!nothingToReportBiblioteca && (
                  <div className="space-y-6">
                    {/* Fixed Activity Section */}
                    <div className="p-5 rounded-xl border border-border bg-muted/20 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary select-none leading-tight">
                          Atención de los estudiantes via on line y presencial
                        </span>
                        <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                          Actividad Fija
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <div className="space-y-1">
                          <label className="text-xs font-semibold text-muted-foreground">Estudiantes Atendidos</label>
                          <input
                            type="number"
                            min={0}
                            required
                            className="w-full sm:max-w-xs rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                            value={fixedActivityAtendidos}
                            onChange={(e) => setFixedActivityAtendidos(parseInt(e.target.value) || 0)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Custom Activities Section */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-foreground">Otras Actividades</h3>
                        <Button
                          type="button"
                          onClick={handleAddBibliotecaCustomItem}
                          variant="outline"
                          className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                        >
                          + Agregar Otra Actividad
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {bibliotecaCustomItems.map((item, idx) => (
                          <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Actividad Adicional #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveBibliotecaCustomItem(idx)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold"
                              >
                                Eliminar
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ej. Taller de inducción a bases de datos científicas..."
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.descripcion_item}
                                  onChange={(e) => handleBibliotecaCustomItemChange(idx, 'descripcion_item', e.target.value)}
                                />
                              </div>

                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Estudiantes Atendidos</label>
                                <input
                                  type="number"
                                  min={0}
                                  required
                                  className="w-full sm:max-w-xs rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.estudiantes_atendidos}
                                  onChange={(e) => handleBibliotecaCustomItemChange(idx, 'estudiantes_atendidos', parseInt(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                        {bibliotecaCustomItems.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4 bg-muted/10 rounded-lg border border-dashed border-border">
                            No se han registrado otras actividades este mes. Haz clic en el botón de arriba para agregar una.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : selectedDepartment === 'Desarrollo Estudiantil' ? (
              // Custom Desarrollo Estudiantil Form
              <form onSubmit={handleDesarrolloSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Desarrollo Estudiantil</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="desarrollo-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="desarrollo-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedDesarrolloMonth}
                    onChange={(e) => setSelectedDesarrolloMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkbox "Nada que reportar" */}
                <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="nothing-desarrollo"
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    checked={nothingToReportDesarrollo}
                    onChange={(e) => setNothingToReportDesarrollo(e.target.checked)}
                  />
                  <label htmlFor="nothing-desarrollo" className="text-sm font-medium text-foreground select-none cursor-pointer">
                    Nada que reportar en este mes
                  </label>
                </div>

                {!nothingToReportDesarrollo && (
                  <div className="space-y-6">
                    {/* Fixed Reports Section */}
                    <div className="space-y-4 pt-2">
                      <h3 className="text-lg font-bold text-foreground">Servicios de Orientación y Asesoría (Reportes Fijos)</h3>
                      
                      <div className="space-y-4">
                        {FIXED_DESARROLLO_REPORTS.map((reportName, idx) => {
                          const reportData = desarrolloFixedReports[reportName]
                          return (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-3">
                              <div className="flex justify-between items-start gap-4">
                                <h4 className="font-bold text-sm text-primary leading-snug">{reportName}</h4>
                                <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap">
                                  Reporte Fijo #{idx + 1}
                                </span>
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Servicios Prestados</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={reportData.servicios_prestados}
                                    onChange={(e) => handleDesarrolloFixedChange(reportName, 'servicios_prestados', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Estudiantes Beneficiados</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={reportData.estudiantes_beneficiados}
                                    onChange={(e) => handleDesarrolloFixedChange(reportName, 'estudiantes_beneficiados', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Special Reports Section */}
                    <div className="space-y-4 pt-4 border-t border-border">
                      <div className="flex justify-between items-center">
                        <h3 className="text-base font-bold text-foreground">Reportes Especiales (Actividades Extraordinarias)</h3>
                        <Button
                          type="button"
                          onClick={handleAddDesarrolloSpecialItem}
                          variant="outline"
                          className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                        >
                          + Agregar Reporte Especial
                        </Button>
                      </div>

                      <div className="space-y-4">
                        {desarrolloSpecialItems.map((item, idx) => (
                          <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-bold text-muted-foreground uppercase">Reporte Especial #{idx + 1}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveDesarrolloSpecialItem(idx)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold"
                              >
                                Eliminar
                              </button>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Descripción del Reporte Especial</label>
                                <input
                                  type="text"
                                  required
                                  placeholder="Ej. Taller de manejo de ansiedad..."
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.descripcion_item}
                                  onChange={(e) => handleDesarrolloSpecialItemChange(idx, 'descripcion_item', e.target.value)}
                                />
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Servicios Prestados</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.servicios_prestados}
                                    onChange={(e) => handleDesarrolloSpecialItemChange(idx, 'servicios_prestados', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Estudiantes Beneficiados</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.estudiantes_beneficiados}
                                    onChange={(e) => handleDesarrolloSpecialItemChange(idx, 'estudiantes_beneficiados', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {desarrolloSpecialItems.length === 0 && (
                          <p className="text-xs text-muted-foreground text-center py-4 bg-muted/10 rounded-lg border border-dashed border-border">
                            No se han registrado reportes especiales adicionales este mes. Haz clic en el botón de arriba si deseas agregar uno.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : selectedDepartment === 'Coordinación de Extensión' ? (
              // Custom Coordinación de Extensión Form
              <form onSubmit={handleCoordinacionExtensionSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Coordinación de Extensión</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="extension-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="extension-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedExtensionMonth}
                    onChange={(e) => setSelectedExtensionMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap border-b border-border mt-6">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      extensionActiveTab === 'sociocultural'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setExtensionActiveTab('sociocultural')}
                  >
                    Actividades Socio-culturales (Extensión)
                    {(nothingToReportSociocultural || socioculturalItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      extensionActiveTab === 'deportiva'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setExtensionActiveTab('deportiva')}
                  >
                    Actividades Deportivas (Estudiantes)
                    {(nothingToReportDeportiva || deportivaItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      extensionActiveTab === 'mallacurricular'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setExtensionActiveTab('mallacurricular')}
                  >
                    Actualización Malla Curricular (Academia)
                    {(nothingToReportMallaCurricular || mallaCurricularItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                </div>

                {/* Tab content: Socio-culturales */}
                {extensionActiveTab === 'sociocultural' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-sociocultural"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportSociocultural}
                        onChange={(e) => setNothingToReportSociocultural(e.target.checked)}
                      />
                      <label htmlFor="nothing-sociocultural" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Actividades Socio-culturales)
                      </label>
                    </div>

                    {!nothingToReportSociocultural && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Actividades Socio-culturales</h3>
                          <Button
                            type="button"
                            onClick={handleAddSocioculturalItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {socioculturalItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {socioculturalItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveSocioculturalItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Festival de Teatro de FACES..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleSocioculturalItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Eventos</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_eventos}
                                      onChange={(e) => handleSocioculturalItemChange(idx, 'nro_eventos', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Usuarios Beneficiados</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.usuarios_beneficiados}
                                      onChange={(e) => handleSocioculturalItemChange(idx, 'usuarios_beneficiados', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content: Deportivas */}
                {extensionActiveTab === 'deportiva' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-deportiva"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportDeportiva}
                        onChange={(e) => setNothingToReportDeportiva(e.target.checked)}
                      />
                      <label htmlFor="nothing-deportiva" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Actividades Deportivas)
                      </label>
                    </div>

                    {!nothingToReportDeportiva && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Actividades Deportivas</h3>
                          <Button
                            type="button"
                            onClick={handleAddDeportivaItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {deportivaItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {deportivaItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDeportivaItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Torneo de Fútbol Sala Universitario..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleDeportivaItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Eventos Realizados</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_eventos_realizados}
                                      onChange={(e) => handleDeportivaItemChange(idx, 'nro_eventos_realizados', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Beneficiarios</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_beneficiarios}
                                      onChange={(e) => handleDeportivaItemChange(idx, 'nro_beneficiarios', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content: Malla Curricular */}
                {extensionActiveTab === 'mallacurricular' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-mallacurricular"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportMallaCurricular}
                        onChange={(e) => setNothingToReportMallaCurricular(e.target.checked)}
                      />
                      <label htmlFor="nothing-mallacurricular" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Actualización Malla Curricular)
                      </label>
                    </div>

                    {!nothingToReportMallaCurricular && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Actualización Malla Curricular</h3>
                          <Button
                            type="button"
                            onClick={handleAddMallaCurricularItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {mallaCurricularItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {mallaCurricularItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMallaCurricularItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Mesas de trabajo para el nuevo pensum..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleMallaCurricularItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="space-y-1 sm:max-w-xs">
                                  <label className="text-xs font-semibold text-muted-foreground">Nro. de Actividades</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.nro_actividades}
                                    onChange={(e) => handleMallaCurricularItemChange(idx, 'nro_actividades', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : (selectedDepartment === 'Departamento de Compras' || selectedDepartment === 'Compras' || selectedDepartment === 'compras') ? (
              // Custom Departamento de Compras Form
              <form onSubmit={handleComprasSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte del Departamento de Compras</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="compras-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="compras-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedComprasMonth}
                    onChange={(e) => setSelectedComprasMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap border-b border-border mt-6">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      comprasActiveTab === 'gestion'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setComprasActiveTab('gestion')}
                  >
                    Gestión Administrativa
                    {(nothingToReportGestion || gestionItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      comprasActiveTab === 'mantenimiento'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setComprasActiveTab('mantenimiento')}
                  >
                    Conservación y Mantenimiento de Infraestructura
                    {(nothingToReportMantenimiento || mantenimientoItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                </div>

                {/* Tab content: Gestión Administrativa */}
                {comprasActiveTab === 'gestion' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-gestion"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportGestion}
                        onChange={(e) => setNothingToReportGestion(e.target.checked)}
                      />
                      <label htmlFor="nothing-gestion" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Gestión Administrativa)
                      </label>
                    </div>

                    {!nothingToReportGestion && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Gestión Administrativa</h3>
                          <Button
                            type="button"
                            onClick={handleAddGestionItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {gestionItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {gestionItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveGestionItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad / Gasto</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Compra de material de oficina para decanato..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleGestionItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Actividad</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_actividad}
                                      onChange={(e) => handleGestionItemChange(idx, 'nro_actividad', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Beneficiados</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_beneficiados}
                                      onChange={(e) => handleGestionItemChange(idx, 'nro_beneficiados', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content: Conservación y Mantenimiento */}
                {comprasActiveTab === 'mantenimiento' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-mantenimiento"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportMantenimiento}
                        onChange={(e) => setNothingToReportMantenimiento(e.target.checked)}
                      />
                      <label htmlFor="nothing-mantenimiento" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Conservación y Mantenimiento)
                      </label>
                    </div>

                    {!nothingToReportMantenimiento && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Conservación y Mantenimiento de Infraestructura</h3>
                          <Button
                            type="button"
                            onClick={handleAddMantenimientoItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {mantenimientoItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {mantenimientoItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveMantenimientoItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad / Mantenimiento</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Reparación de luminarias en pasillos principales..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleMantenimientoItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Actividad</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_actividad}
                                      onChange={(e) => handleMantenimientoItemChange(idx, 'nro_actividad', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Beneficiados</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_beneficiados}
                                      onChange={(e) => handleMantenimientoItemChange(idx, 'nro_beneficiados', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : (selectedDepartment === 'extension-profesional' || selectedDepartment === 'Centro de Extensión Profesional') ? (
              // Custom Centro de Extensión Profesional Form
              <form onSubmit={handleProfesionalSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte de Centro de Extensión Profesional</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="profesional-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="profesional-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedProfesionalMonth}
                    onChange={(e) => setSelectedProfesionalMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Checkbox "Nada que reportar" */}
                <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                  <input
                    type="checkbox"
                    id="nothing-profesional"
                    className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                    checked={nothingToReportProfesional}
                    onChange={(e) => setNothingToReportProfesional(e.target.checked)}
                  />
                  <label htmlFor="nothing-profesional" className="text-sm font-medium text-foreground select-none cursor-pointer">
                    Nada que reportar en este mes
                  </label>
                </div>

                {!nothingToReportProfesional && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-bold text-foreground">Acompañamientos y Certificaciones Profesional</h3>
                      <Button
                        type="button"
                        onClick={handleAddProfesionalItem}
                        variant="outline"
                        className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                      >
                        + Agregar Registro
                      </Button>
                    </div>

                    <div className="space-y-4">
                      {profesionalItems.map((item, idx) => (
                        <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-muted-foreground uppercase">Registro #{idx + 1}</span>
                            {profesionalItems.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveProfesionalItem(idx)}
                                className="text-red-500 hover:text-red-700 text-xs font-semibold"
                              >
                                Eliminar
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            <div className="space-y-1">
                              <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividades / Certificación</label>
                              <input
                                type="text"
                                required
                                placeholder="Ej. Certificación otorgada a la empresa Academia de las Américas: Diplomado en Perito Consultor Técnico en Ciencias Forenses..."
                                className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                value={item.descripcion_item}
                                onChange={(e) => handleProfesionalItemChange(idx, 'descripcion_item', e.target.value)}
                              />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Nro. de Acompañamientos Realizados</label>
                                <input
                                  type="number"
                                  min={0}
                                  required
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.nro_acompanamientos_realizados}
                                  onChange={(e) => handleProfesionalItemChange(idx, 'nro_acompanamientos_realizados', parseInt(e.target.value) || 0)}
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-semibold text-muted-foreground">Nro. de Personas Beneficiadas</label>
                                <input
                                  type="number"
                                  min={0}
                                  required
                                  className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                  value={item.nro_personas_beneficiadas}
                                  onChange={(e) => handleProfesionalItemChange(idx, 'nro_personas_beneficiadas', parseInt(e.target.value) || 0)}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : (selectedDepartment === 'instituto-investigaciones' || selectedDepartment === 'Instituto de Investigaciones') ? (
              // Custom Instituto de Investigaciones Form
              <form onSubmit={handleInvestigacionesSubmit} className="space-y-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-foreground">Nuevo Reporte del Instituto de Investigaciones</h2>
                </div>

                {/* Mes Reportado */}
                <div className="space-y-2 max-w-xs">
                  <label htmlFor="investigaciones-month" className="block text-sm font-semibold text-foreground">
                    Mes Reportado
                  </label>
                  <select
                    id="investigaciones-month"
                    required
                    className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={selectedInvestigacionesMonth}
                    onChange={(e) => setSelectedInvestigacionesMonth(e.target.value)}
                  >
                    {[
                      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                    ].map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tabs Navigation */}
                <div className="flex flex-wrap border-b border-border mt-6">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      investigacionesActiveTab === 'acompanamiento'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setInvestigacionesActiveTab('acompanamiento')}
                  >
                    Acompañamiento Profesional (Extensión)
                    {(nothingToReportAcompanamiento || investigacionesAcompanamientoItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors flex items-center ${
                      investigacionesActiveTab === 'tecnologias'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setInvestigacionesActiveTab('tecnologias')}
                  >
                    Tecnologías para la Enseñanza (Academia)
                    {(nothingToReportTecnologias || investigacionesTecnologiasItems.some(i => i.descripcion_item.trim() !== '')) ? (
                      <span className="ml-2 text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-1.5 py-0.5 rounded">✓</span>
                    ) : (
                      <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold px-1.5 py-0.5 rounded">•</span>
                    )}
                  </button>
                </div>

                {/* Tab content: Acompañamiento Profesional */}
                {investigacionesActiveTab === 'acompanamiento' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-inv-acompanamiento"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportAcompanamiento}
                        onChange={(e) => setNothingToReportAcompanamiento(e.target.checked)}
                      />
                      <label htmlFor="nothing-inv-acompanamiento" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Acompañamiento Profesional)
                      </label>
                    </div>

                    {!nothingToReportAcompanamiento && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Acompañamiento Profesional</h3>
                          <Button
                            type="button"
                            onClick={handleAddInvestigacionesAcompanamientoItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Registro
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {investigacionesAcompanamientoItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Registro #{idx + 1}</span>
                                {investigacionesAcompanamientoItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInvestigacionesAcompanamientoItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad / Asesoría</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Asesoría en metodología de la investigación para tesistas..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleInvestigacionesAcompanamientoItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Acompañamientos Realizados</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_acompanamientos_realizados}
                                      onChange={(e) => handleInvestigacionesAcompanamientoItemChange(idx, 'nro_acompanamientos_realizados', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-xs font-semibold text-muted-foreground">Nro. de Personas Beneficiadas</label>
                                    <input
                                      type="number"
                                      min={0}
                                      required
                                      className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                      value={item.nro_personas_beneficiadas}
                                      onChange={(e) => handleInvestigacionesAcompanamientoItemChange(idx, 'nro_personas_beneficiadas', parseInt(e.target.value) || 0)}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Tab content: Tecnologías para el Proceso de Enseñanza */}
                {investigacionesActiveTab === 'tecnologias' && (
                  <div className="space-y-6 pt-4">
                    <div className="flex items-center space-x-2 bg-muted/40 p-4 rounded-lg border border-border">
                      <input
                        type="checkbox"
                        id="nothing-inv-tecnologias"
                        className="rounded border-border text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={nothingToReportTecnologias}
                        onChange={(e) => setNothingToReportTecnologias(e.target.checked)}
                      />
                      <label htmlFor="nothing-inv-tecnologias" className="text-sm font-medium text-foreground select-none cursor-pointer">
                        Nada que reportar en esta sección (Tecnologías para la Enseñanza)
                      </label>
                    </div>

                    {!nothingToReportTecnologias && (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-foreground">Tecnologías para el Proceso de Enseñanza</h3>
                          <Button
                            type="button"
                            onClick={handleAddInvestigacionesTecnologiasItem}
                            variant="outline"
                            className="text-xs flex items-center gap-1 py-1.5 px-3 border border-border bg-card text-foreground hover:bg-muted"
                          >
                            + Agregar Actividad
                          </Button>
                        </div>

                        <div className="space-y-4">
                          {investigacionesTecnologiasItems.map((item, idx) => (
                            <div key={idx} className="p-5 rounded-xl border border-border bg-muted/20 space-y-4 relative">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-muted-foreground uppercase">Actividad #{idx + 1}</span>
                                {investigacionesTecnologiasItems.length > 1 && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveInvestigacionesTecnologiasItem(idx)}
                                    className="text-red-500 hover:text-red-700 text-xs font-semibold"
                                  >
                                    Eliminar
                                  </button>
                                )}
                              </div>

                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="sm:col-span-2 space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Descripción de la Actividad / Tecnología</label>
                                  <input
                                    type="text"
                                    required
                                    placeholder="Ej. Implementación de simulador de datos en laboratorio..."
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.descripcion_item}
                                    onChange={(e) => handleInvestigacionesTecnologiasItemChange(idx, 'descripcion_item', e.target.value)}
                                  />
                                </div>

                                <div className="space-y-1">
                                  <label className="text-xs font-semibold text-muted-foreground">Nro. de Actividades</label>
                                  <input
                                    type="number"
                                    min={0}
                                    required
                                    className="w-full rounded-lg border border-border bg-input px-3 py-1.5 text-sm text-foreground focus:border-primary focus:outline-none"
                                    value={item.nro_actividades}
                                    onChange={(e) => handleInvestigacionesTecnologiasItemChange(idx, 'nro_actividades', parseInt(e.target.value) || 0)}
                                  />
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-border mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedDepartment('')}
                    className="flex-1"
                  >
                    Cambiar Departamento
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                        Enviando a Staging...
                      </>
                    ) : (
                      'Enviar Reporte'
                    )}
                  </Button>
                </div>
              </form>
            ) : (
            // Generic Form for other departments
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div className="space-y-2">
                <label htmlFor="title" className="block text-sm font-semibold text-foreground">
                  Título del Reporte
                </label>
                <input
                  id="title"
                  type="text"
                  required
                  placeholder="Describe brevemente el tema..."
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              {/* Category Field */}
              <div className="space-y-2">
                <label htmlFor="category" className="block text-sm font-semibold text-foreground">
                  Categoría
                </label>
                <select
                  id="category"
                  required
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Selecciona una categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Description Field */}
              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-semibold text-foreground">
                  Descripción Detallada
                </label>
                <textarea
                  id="description"
                  required
                  placeholder="Describe el contenido del reporte con detalle..."
                  rows={6}
                  className="w-full rounded-lg border border-border bg-input px-4 py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setSelectedDepartment('')}
                  className="flex-1"
                >
                  Cambiar Departamento
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-secondary text-white hover:bg-secondary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block"></span>
                      Enviando a Staging...
                    </>
                  ) : (
                    'Enviar Reporte'
                  )}
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
