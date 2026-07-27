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
    name: 'Compras',
    icon: '🛒',
    targets: [{ sheet: 'Otros Gastos y Conservación', block: '' }],
  },
  {
    id: 'extension-profesional',
    name: 'Centro de Extensión Profesional',
    icon: '💼',
    targets: [{ sheet: 'Acompañamiento Profesional', block: '' }],
  },
  {
    id: 'instituto-investigaciones',
    name: 'Instituto de Investigaciones',
    icon: '🔬',
    targets: [
      { sheet: 'Academia', block: 'Proceso de enseñanza' },
      { sheet: 'Extensión', block: 'Acompañamiento profesional' },
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

  const handlePregradoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construct payload according to Contexto.md
    const payload = {
      departamento_emisor: "Control de Estudios - Pregrado",
      mes_reportado: selectedMonth,
      registros: [
        {
          hoja_destino: "Academia",
          bloque: "Resumen de Matrícula de Pregrado",
          detalles: Object.keys(pregradoCareers).map((careerName) => {
            const careerData = pregradoCareers[careerName]
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
    alert('Reporte de Pregrado enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

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

  const handlePostgradoSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Construct payload according to Contexto.md
    const payload = {
      departamento_emisor: "Control de Estudios - Postgrado",
      mes_reportado: selectedPostgradoMonth,
      registros: [
        {
          hoja_destino: "Academia",
          bloque: "Resumen de Matrícula de Postgrado",
          detalles: Object.keys(postgradoPrograms).map((programName) => {
            const programData = postgradoPrograms[programName]
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
    alert('Reporte de Postgrado enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

    // Reset form
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

  const handleServicioComunitarioSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validation: ensure all tabs have been answered (either "Nada que reportar" checked or at least one item filled)
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
    alert('Reporte de Servicio Comunitario enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

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

  const handleBibliotecaSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const detalles = []

    if (!nothingToReportBiblioteca) {
      detalles.push({
        descripcion_item: "Atención de los estudiantes via on line y presencial",
        variables: {
          estudiantes_atendidos: fixedActivityAtendidos
        }
      })

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
    alert('Reporte de Biblioteca enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

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

  const handleDesarrolloSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const detalles = []

    if (!nothingToReportDesarrollo) {
      // 1. Add fixed reports
      FIXED_DESARROLLO_REPORTS.forEach((reportName) => {
        const data = desarrolloFixedReports[reportName]
        detalles.push({
          descripcion_item: reportName,
          variables: {
            servicios_prestados: data.servicios_prestados,
            estudiantes_beneficiados: data.estudiantes_beneficiados
          }
        })
      })

      // 2. Add special reports
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
    alert('Reporte de Desarrollo Estudiantil enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

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

  const handleCoordinacionExtensionSubmit = (e: React.FormEvent) => {
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
    alert('Reporte de Coordinación de Extensión enviado correctamente (Simulación):\n' + JSON.stringify(payload, null, 2))

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Report sent from:', selectedDepartment, 'Data:', formData)
    setFormData({ title: '', description: '', category: '' })
    setSelectedDepartment('')
    alert('Reporte enviado correctamente')
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
                <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                  Enviar Reporte
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
                <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                  Enviar Reporte
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
                <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                  Enviar Reporte
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
                  <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                    Enviar Reporte
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
                  <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                    Enviar Reporte
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
                  <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                    Enviar Reporte
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
                <Button type="submit" className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                  Enviar Reporte
                </Button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
