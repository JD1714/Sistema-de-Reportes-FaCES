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

const MOCK_SENT_REPORTS = [
  {
    id: 1,
    title: 'Actualización de syllabus',
    date: '2024-06-15',
    status: 'enviado',
  },
  {
    id: 2,
    title: 'Solicitud de recursos',
    date: '2024-06-14',
    status: 'recibido',
  },
  {
    id: 3,
    title: 'Participación en seminario',
    date: '2024-06-13',
    status: 'recibido',
  },
]

export default function EmisorScreen({ onBack }: EmisorScreenProps) {
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
  })

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
      <main className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2 bg-card border border-border rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold mb-6 text-foreground">Nuevo Reporte</h2>

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
          </div>

          {/* Sidebar - Recent Reports */}
          <div className="bg-card border border-border rounded-lg p-6 shadow-sm h-fit">
            <h3 className="text-lg font-bold mb-4 text-foreground">Reportes Recientes</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {MOCK_SENT_REPORTS.map((report) => (
                <div key={report.id} className="p-3 rounded-lg bg-muted">
                  <p className="font-medium text-sm text-foreground truncate">{report.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{report.date}</p>
                  <span
                    className={`inline-flex mt-2 px-2 py-1 rounded text-xs font-medium ${
                      report.status === 'recibido'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {report.status === 'recibido' ? 'Recibido' : 'Enviado'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
