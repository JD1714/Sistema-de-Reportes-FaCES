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
      { sheet: 'Academia', block: '' },
      { sheet: 'Extensión', block: 'Labor Social' },
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
