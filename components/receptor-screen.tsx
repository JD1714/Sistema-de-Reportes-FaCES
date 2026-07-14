'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Mail, Clock, AlertCircle, CheckCircle } from 'lucide-react'

interface ReceptorScreenProps {
  onBack: () => void
}

interface ReceivedReport {
  id: string
  from: string
  title: string
  category: string
  priority: 'baja' | 'media' | 'alta' | 'urgente'
  date: string
  status: 'nuevo' | 'leído' | 'procesando' | 'resuelto'
  description: string
}

const MOCK_RECEIVED_REPORTS: ReceivedReport[] = [
  {
    id: '1',
    from: 'Control de Estudios - Pregrado',
    title: 'Consolidación de Inscritos - Semestre I-2026',
    category: 'Academia',
    priority: 'alta',
    date: '2026-06-20',
    status: 'nuevo',
    description: 'Reporte consolidado de nuevos ingresos, reingresos y retiros de alumnos de Pregrado para registrar en la hoja de Academia.',
  },
  {
    id: '2',
    from: 'Servicio Comunitario',
    title: 'Estudiantes asignados a Proyectos de Labor Social',
    category: 'Extensión (Labor Social)',
    priority: 'media',
    date: '2026-06-19',
    status: 'procesando',
    description: 'Listado de proyectos y tutores asignados en el marco del programa de Servicio Comunitario del período actual.',
  },
  {
    id: '3',
    from: 'Coordinación de Extensión',
    title: 'Métricas de Participación en Deporte Interfacultades',
    category: 'Estudiantes (Deporte)',
    priority: 'baja',
    date: '2026-06-18',
    status: 'resuelto',
    description: 'Datos de estudiantes involucrados en los torneos internos y eventos socio-culturales organizados por la Coordinación.',
  },
  {
    id: '4',
    from: 'Departamento de Compras',
    title: 'Relación de Compras de Material de Oficina y Conservación',
    category: 'Otros Gastos y Conservación',
    priority: 'media',
    date: '2026-06-17',
    status: 'leído',
    description: 'Desglose detallado de los gastos realizados en papelería, consumibles de impresión y limpieza del edificio de la facultad.',
  },
  {
    id: '5',
    from: 'Instituto de Investigaciones',
    title: 'Proyectos de Enseñanza y Publicaciones Científicas',
    category: 'Academia (Proceso de enseñanza)',
    priority: 'urgente',
    date: '2026-06-16',
    status: 'nuevo',
    description: 'Listado de docentes adscritos al instituto con publicaciones activas y proyectos de enseñanza en el periodo actual.',
  },
]

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgente':
      return 'bg-red-100 text-red-800 border-red-300'
    case 'alta':
      return 'bg-orange-100 text-orange-800 border-orange-300'
    case 'media':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'baja':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300'
  }
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'nuevo':
      return <Mail className="w-4 h-4" />
    case 'leído':
      return <Clock className="w-4 h-4" />
    case 'procesando':
      return <AlertCircle className="w-4 h-4" />
    case 'resuelto':
      return <CheckCircle className="w-4 h-4" />
    default:
      return null
  }
}

const getStatusBg = (status: string) => {
  switch (status) {
    case 'nuevo':
      return 'bg-blue-50'
    case 'leído':
      return 'bg-gray-50'
    case 'procesando':
      return 'bg-yellow-50'
    case 'resuelto':
      return 'bg-green-50'
    default:
      return 'bg-white'
  }
}

export default function ReceptorScreen({ onBack }: ReceptorScreenProps) {
  const [reports, setReports] = useState<ReceivedReport[]>(MOCK_RECEIVED_REPORTS)
  const [editingReport, setEditingReport] = useState<ReceivedReport | null>(null)
  const [editForm, setEditForm] = useState<Partial<ReceivedReport>>({})

  const newReports = reports.filter((r) => r.status === 'nuevo').length
  const processingReports = reports.filter((r) => r.status === 'procesando').length

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
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/faces_logo_dark.png"
              alt="FaCES UCV"
              width={56}
              height={56}
              className="w-14 h-14 object-contain"
            />
            <h1 className="text-3xl font-bold">Sistema de Reportes FaCES</h1>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur p-4 rounded-lg">
              <p className="text-white/80 text-sm">Reportes Recibidos</p>
              <p className="text-3xl font-bold">{reports.length}</p>
            </div>
            <div className="bg-white/20 backdrop-blur p-4 rounded-lg">
              <p className="text-white/80 text-sm">Nuevos</p>
              <p className="text-3xl font-bold">{newReports}</p>
            </div>
            <div className="bg-white/20 backdrop-blur p-4 rounded-lg">
              <p className="text-white/80 text-sm">En Procesamiento</p>
              <p className="text-3xl font-bold">{processingReports}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Reportes Recibidos</h2>
          </div>

          {/* Reports List */}
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                onClick={() => {
                  setEditingReport(report)
                  setEditForm({ ...report })
                }}
                className={`border border-border rounded-lg p-5 transition-all hover:shadow-md cursor-pointer ${getStatusBg(report.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-slate-500">{getStatusIcon(report.status)}</span>
                      <h3 className="text-lg font-semibold text-slate-900 truncate">{report.title}</h3>
                    </div>
                    <p className="text-sm text-slate-600 mb-3">{report.description}</p>
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="text-xs bg-secondary/10 text-secondary px-2 py-1 rounded">
                        De: {report.from}
                      </span>
                      <span className="text-xs bg-black/5 text-slate-700 px-2 py-1 rounded">
                        {report.category}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(report.date).toLocaleDateString('es-ES')}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-xs font-medium px-3 py-1 rounded border ${getPriorityColor(report.priority)}`}>
                      {report.priority.charAt(0).toUpperCase() + report.priority.slice(1)}
                    </span>
                    <span className="text-xs font-medium text-slate-600 capitalize">
                      {report.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Editing / Detailing Modal */}
      {editingReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto backdrop-blur-sm animate-fade-in">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl shadow-xl overflow-hidden animate-scale-in">
            <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">Editar y Enviar Reporte</h2>
                <p className="text-xs text-white/80 mt-1">ID: {editingReport.id} — Remitente: {editingReport.from}</p>
              </div>
              <button
                onClick={() => setEditingReport(null)}
                className="text-white hover:text-white/80 text-xl font-bold focus:outline-none cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const updatedReports = reports.map((r) =>
                  r.id === editingReport.id ? { ...r, ...editForm } : r
                )
                setReports(updatedReports)
                setEditingReport(null)
                alert('Reporte guardado localmente')
              }}
              className="p-6 space-y-4"
            >
              {/* Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Título del Reporte</label>
                <input
                  type="text"
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                  value={editForm.title || ''}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                />
              </div>

              {/* Grid fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Categoría</label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={editForm.category || ''}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Prioridad</label>
                  <select
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={editForm.priority || 'media'}
                    onChange={(e) => setEditForm({ ...editForm, priority: e.target.value as any })}
                    required
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="urgente">Urgente</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-foreground">Estado</label>
                  <select
                    className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                    value={editForm.status || 'nuevo'}
                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value as any })}
                    required
                  >
                    <option value="nuevo">Nuevo</option>
                    <option value="leído">Leído</option>
                    <option value="procesando">Procesando</option>
                    <option value="resuelto">Resuelto</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-foreground">Descripción</label>
                <textarea
                  rows={5}
                  className="w-full rounded-lg border border-border bg-input px-3 py-2 text-foreground focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-none"
                  value={editForm.description || ''}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  required
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setEditingReport(null)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-muted hover:bg-muted/80 text-foreground border border-border"
                >
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    const updatedReports = reports.map((r) =>
                      r.id === editingReport.id ? { ...r, ...editForm, status: 'resuelto' as const } : r
                    )
                    setReports(updatedReports)
                    setEditingReport(null)
                    alert('¡Reporte enviado al Macro Archivo de Excel con éxito!')
                  }}
                  className="flex-1 bg-secondary text-white hover:bg-secondary/90 font-semibold"
                >
                  Enviar al Macro Archivo
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
