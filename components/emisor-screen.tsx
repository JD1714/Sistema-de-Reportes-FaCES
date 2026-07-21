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
    targets: [{ sheet: 'Estudiantes', block: 'Atención y Asesoría' }],
  },
  {
    id: 'coordinacion-extension',
    name: 'Coordinación de Extensión',
    icon: '📣',
    targets: [
      { sheet: 'Extensión', block: 'Deporte, Eventos, Socio Cultural' },
      { sheet: 'Estudiantes', block: 'Deporte' },
      { sheet: 'Academia', block: 'Malla Curricular' },
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
    
    // Reset form
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

    // Reset Form
    setSelectedComunitarioMonth('Enero')
    setComunitarioActiveTab('academia')
    setNothingToReportAcademia(false)
    setNothingToReportExtension(false)
    setAcademiaItems([{ descripcion_item: '', actividades_realizadas: 0, estudiantes_atendidos: 0 }])
    setExtensionItems([{ descripcion_item: '', actividades_realizadas: 0, beneficiarios: 0 }])
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Report sent from:', selectedDepartment, 'Data:', formData)
    setFormData({ title: '', description: '', category: '' })
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
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      comunitarioActiveTab === 'academia'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setComunitarioActiveTab('academia')}
                  >
                    Academia (Requisito de Graduación)
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                      comunitarioActiveTab === 'extension'
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                    onClick={() => setComunitarioActiveTab('extension')}
                  >
                    Extensión (Labor Social)
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
                                    <label className="text-xs font-semibold text-muted-foreground">Nro de Actividades Realizadas</label>
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
