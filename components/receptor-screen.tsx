'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  RefreshCw,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  ChevronRight,
  FileText,
  Building,
  Calendar,
  Layers,
  Save,
  Check,
  X,
  AlertTriangle
} from 'lucide-react'

interface ReceptorScreenProps {
  onBack: () => void
}

export interface StagingReport {
  id_transaccion: string
  fecha_emision: string
  departamento_emisor: string
  estado: 'Pendiente de Revisión' | 'Aprobado' | 'Rechazado'
  payload: {
    departamento_emisor?: string
    mes_reportado?: string
    registros?: Array<{
      hoja_destino: string
      bloque: string
      detalles: Array<{
        sub_bloque?: string
        actividad?: string
        descripcion?: string
        variables?: Record<string, any>
      }>
    }>
    [key: string]: any
  }
}

// Datos de fallback en caso de estar offline o sin conexión
const INITIAL_MOCK_REPORTS: StagingReport[] = [
  {
    id_transaccion: 'REQ-20260805-A101',
    fecha_emision: new Date(Date.now() - 3600000).toISOString(),
    departamento_emisor: 'Control de Estudios - Pregrado',
    estado: 'Pendiente de Revisión',
    payload: {
      departamento_emisor: 'Control de Estudios - Pregrado',
      mes_reportado: 'Enero',
      registros: [
        {
          hoja_destino: 'Estudiantes',
          bloque: 'Pregrado',
          detalles: [
            {
              sub_bloque: 'Administradores y Contadores Públicos',
              variables: { nuevos_ingresos: 120, egresados: 45, retiros: 3, prosecucion: 850 }
            },
            {
              sub_bloque: 'Economistas',
              variables: { nuevos_ingresos: 85, egresados: 30, retiros: 2, prosecucion: 620 }
            }
          ]
        }
      ]
    }
  },
  {
    id_transaccion: 'REQ-20260805-B202',
    fecha_emision: new Date(Date.now() - 7200000).toISOString(),
    departamento_emisor: 'Servicio Comunitario',
    estado: 'Pendiente de Revisión',
    payload: {
      departamento_emisor: 'Servicio Comunitario',
      mes_reportado: 'Febrero',
      registros: [
        {
          hoja_destino: 'Academia',
          bloque: 'Servicio comunitario (requisito para graduarse)',
          detalles: [
            {
              actividad: 'Atención Comunitaria Parroquia San Pedro',
              variables: { nro_proyectos: 5, nro_estudiantes: 42 }
            }
          ]
        }
      ]
    }
  },
  {
    id_transaccion: 'REQ-20260805-C303',
    fecha_emision: new Date(Date.now() - 86400000).toISOString(),
    departamento_emisor: 'Departamento de Compras',
    estado: 'Aprobado',
    payload: {
      departamento_emisor: 'Departamento de Compras',
      mes_reportado: 'Enero',
      registros: [
        {
          hoja_destino: 'Otros Gastos de Funcionamiento',
          bloque: 'Gestión administrativa',
          detalles: [
            {
              actividad: 'Adquisición de Consumibles de Oficina',
              variables: { nro_actividades: 3, nro_beneficiados: 150 }
            }
          ]
        }
      ]
    }
  }
]

export default function ReceptorScreen({ onBack }: ReceptorScreenProps) {
  const [reports, setReports] = useState<StagingReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos')
  
  // Modal de Edición
  const [selectedReport, setSelectedReport] = useState<StagingReport | null>(null)
  const [editablePayload, setEditablePayload] = useState<any>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [feedbackModal, setFeedbackModal] = useState<{ title: string; message: string; type: 'success' | 'info' } | null>(null)

  // Cargar reportes de Staging
  const fetchStagingReports = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const res = await fetch('/api/staging', { cache: 'no-store' })
      const data = await res.json()

      if (data.status === 'success' && Array.isArray(data.reportes) && data.reportes.length > 0) {
        setReports(data.reportes)
      } else {
        console.warn('Servidor sin reportes nuevos o devolvió respuesta alternativa:', data)
        // Usar reportes locales si no hay datos en Staging
        setReports((prev) => (prev.length > 0 ? prev : INITIAL_MOCK_REPORTS))
      }
    } catch (err: any) {
      console.error('Error al cargar reportes:', err)
      setErrorMsg('No se pudo conectar con el servidor de Staging. Mostrando datos de respaldo.')
      setReports((prev) => (prev.length > 0 ? prev : INITIAL_MOCK_REPORTS))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStagingReports()
  }, [])

  // Abrir modal de edición
  const handleOpenEdit = (report: StagingReport) => {
    setSelectedReport(report)
    setEditablePayload(JSON.parse(JSON.stringify(report.payload)))
  }

  // Guardar cambios locales en el payload
  const handleSaveEdits = () => {
    if (!selectedReport || !editablePayload) return
    setIsSaving(true)
    
    setTimeout(() => {
      setReports((prev) =>
        prev.map((r) =>
          r.id_transaccion === selectedReport.id_transaccion
            ? { ...r, payload: editablePayload }
            : r
        )
      )
      setIsSaving(false)
      setFeedbackModal({
        title: '¡Cambios Guardados!',
        message: `Los datos del reporte ${selectedReport.id_transaccion} se han actualizado localmente.`,
        type: 'info'
      })
    }, 400)
  }

  // Aprobar Reporte (Simulación Fake para el Macro Archivo)
  const handleApproveReport = () => {
    if (!selectedReport) return

    const updatedReports = reports.map((r) =>
      r.id_transaccion === selectedReport.id_transaccion
        ? { ...r, estado: 'Aprobado' as const, payload: editablePayload }
        : r
    )
    setReports(updatedReports)

    setFeedbackModal({
      title: '✅ Reporte Aprobado (Simulación)',
      message: `El reporte ${selectedReport.id_transaccion} fue marcado como "Aprobado" y preparado para la escritura en el Macro Archivo de Excel/Sheets.`,
      type: 'success'
    })
    setSelectedReport(null)
  }

  // Rechazar Reporte
  const handleRejectReport = () => {
    if (!selectedReport) return

    const updatedReports = reports.map((r) =>
      r.id_transaccion === selectedReport.id_transaccion
        ? { ...r, estado: 'Rechazado' as const }
        : r
    )
    setReports(updatedReports)
    setSelectedReport(null)
  }

  // Filtrado de reportes
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.departamento_emisor.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedStatus === 'Todos') return matchesSearch
    return matchesSearch && r.estado === selectedStatus
  })

  // Estadísticas
  const totalCount = reports.length
  const pendingCount = reports.filter((r) => r.estado === 'Pendiente de Revisión').length
  const approvedCount = reports.filter((r) => r.estado === 'Aprobado').length
  const rejectedCount = reports.filter((r) => r.estado === 'Rechazado').length

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Botón Volver */}
      <div className="fixed top-4 right-4 z-40">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-slate-900/80 backdrop-blur hover:bg-slate-800 text-slate-100 border border-slate-700 shadow-lg"
        >
          ← Volver al Hub
        </Button>
      </div>

      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-primary/90 to-secondary/90 border-b border-slate-800 p-6">
        <div className="mx-auto max-w-6xl">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src="/faces_logo_dark.png"
              alt="FaCES UCV"
              width={56}
              height={56}
              className="w-14 h-14 object-contain filter drop-shadow"
            />
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-white">Módulo Receptor de Reportes</h1>
              <p className="text-slate-300 text-sm mt-0.5">
                Consolidación, edición y aprobación de reportes enviados desde la Zona de Staging
              </p>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-xl">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Staging</p>
              <p className="text-3xl font-bold text-white mt-1">{totalCount}</p>
            </div>
            <div className="bg-amber-950/40 backdrop-blur border border-amber-800/50 p-4 rounded-xl">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Pendientes</p>
              <p className="text-3xl font-bold text-amber-300 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 p-4 rounded-xl">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Aprobados</p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">{approvedCount}</p>
            </div>
            <div className="bg-rose-950/40 backdrop-blur border border-rose-800/50 p-4 rounded-xl">
              <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">Rechazados</p>
              <p className="text-3xl font-bold text-rose-300 mt-1">{rejectedCount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* Banner Informativo */}
        {errorMsg && (
          <div className="bg-amber-950/60 border border-amber-700/60 text-amber-200 px-4 py-3 rounded-lg flex items-center gap-3 text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Barra de Búsqueda y Filtros */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur">
          {/* Búsqueda */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por ID de transacción o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary"
            />
          </div>

          {/* Filtros por Estado */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 overflow-x-auto">
            {['Todos', 'Pendiente de Revisión', 'Aprobado', 'Rechazado'].map((status) => (
              <button
                key={status}
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedStatus === status
                    ? 'bg-secondary text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Recargar Staging */}
          <Button
            onClick={fetchStagingReports}
            disabled={isLoading}
            variant="outline"
            className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            Recargar
          </Button>
        </div>

        {/* Lista de Reportes */}
        {isLoading ? (
          <div className="py-16 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-secondary mx-auto" />
            <p className="text-slate-400 text-sm">Leyendo datos de la Zona de Staging en Google Sheets...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-12 text-center space-y-3">
            <FileText className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No se encontraron reportes</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              No hay transacciones registradas que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filteredReports.map((report) => (
              <div
                key={report.id_transaccion}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 hover:border-slate-700 transition-all hover:shadow-lg group"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info Principal */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-secondary border border-slate-700">
                        {report.id_transaccion}
                      </span>

                      {/* Badge de Estado */}
                      {report.estado === 'Pendiente de Revisión' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-amber-950/60 text-amber-400 border border-amber-800/60">
                          <Clock className="w-3.5 h-3.5" /> Pendiente
                        </span>
                      )}
                      {report.estado === 'Aprobado' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60">
                          <CheckCircle className="w-3.5 h-3.5" /> Aprobado
                        </span>
                      )}
                      {report.estado === 'Rechazado' && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded bg-rose-950/60 text-rose-400 border border-rose-800/60">
                          <XCircle className="w-3.5 h-3.5" /> Rechazado
                        </span>
                      )}

                      <span className="text-xs text-slate-400 flex items-center gap-1 ml-auto md:ml-0">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(report.fecha_emision).toLocaleString('es-ES')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-200 pt-1">
                      <Building className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-bold text-base text-white">{report.departamento_emisor}</h3>
                    </div>

                    {/* Resumen del Contenido */}
                    <div className="flex items-center flex-wrap gap-3 text-xs text-slate-400 pt-1">
                      {report.payload?.mes_reportado && (
                        <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-300">
                          Mes: {report.payload.mes_reportado}
                        </span>
                      )}
                      {report.payload?.registros?.map((reg, idx) => (
                        <span key={idx} className="bg-slate-800/70 border border-slate-700 px-2 py-0.5 rounded text-slate-300 flex items-center gap-1">
                          <Layers className="w-3 h-3 text-secondary" />
                          {reg.hoja_destino} → {reg.bloque}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800 justify-end">
                    <Button
                      onClick={() => handleOpenEdit(report)}
                      className="bg-secondary/90 hover:bg-secondary text-white text-xs font-semibold flex items-center gap-2"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      Revisar y Editar
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Revisión y Edición de Reporte */}
      {selectedReport && editablePayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-slate-900 via-primary/80 to-secondary/80 p-6 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Revisión y Edición de Reporte</h2>
                  <span className="font-mono text-xs bg-black/40 px-2.5 py-0.5 rounded border border-white/20">
                    {selectedReport.id_transaccion}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Remitente: <strong className="text-white">{selectedReport.departamento_emisor}</strong> | 
                  Fecha: {new Date(selectedReport.fecha_emision).toLocaleString('es-ES')}
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo Editable */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
              {/* Información General */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Departamento Emisor
                  </label>
                  <input
                    type="text"
                    value={editablePayload.departamento_emisor || selectedReport.departamento_emisor}
                    onChange={(e) =>
                      setEditablePayload({ ...editablePayload, departamento_emisor: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-secondary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Mes Reportado
                  </label>
                  <input
                    type="text"
                    value={editablePayload.mes_reportado || ''}
                    onChange={(e) =>
                      setEditablePayload({ ...editablePayload, mes_reportado: e.target.value })
                    }
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              {/* Bloques de Registros */}
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="w-4 h-4 text-secondary" />
                  Registros Destino en el Macro Archivo
                </h3>

                {editablePayload.registros && editablePayload.registros.length > 0 ? (
                  editablePayload.registros.map((reg: any, rIdx: number) => (
                    <div key={rIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                      {/* Cabecera del Registro */}
                      <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b border-slate-800">
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Hoja Destino (Excel)
                          </label>
                          <input
                            type="text"
                            value={reg.hoja_destino}
                            onChange={(e) => {
                              const newRegs = [...editablePayload.registros]
                              newRegs[rIdx].hoja_destino = e.target.value
                              setEditablePayload({ ...editablePayload, registros: newRegs })
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:border-secondary focus:outline-none"
                          />
                        </div>
                        <div className="flex-1">
                          <label className="block text-xs font-semibold text-slate-400 mb-1">
                            Bloque Destino
                          </label>
                          <input
                            type="text"
                            value={reg.bloque}
                            onChange={(e) => {
                              const newRegs = [...editablePayload.registros]
                              newRegs[rIdx].bloque = e.target.value
                              setEditablePayload({ ...editablePayload, registros: newRegs })
                            }}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 font-semibold focus:border-secondary focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Detalles / Filas */}
                      <div className="space-y-4 pt-2">
                        {reg.detalles && reg.detalles.length > 0 ? (
                          reg.detalles.map((det: any, dIdx: number) => (
                            <div key={dIdx} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
                              {/* Nombre del sub-bloque o actividad */}
                              {(det.sub_bloque || det.actividad) && (
                                <div>
                                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                                    {det.sub_bloque ? 'Sub-Bloque / Carrera / Sección' : 'Nombre de Actividad'}
                                  </label>
                                  <input
                                    type="text"
                                    value={det.sub_bloque || det.actividad || ''}
                                    onChange={(e) => {
                                      const newRegs = [...editablePayload.registros]
                                      if (det.sub_bloque !== undefined) {
                                        newRegs[rIdx].detalles[dIdx].sub_bloque = e.target.value
                                      } else {
                                        newRegs[rIdx].detalles[dIdx].actividad = e.target.value
                                      }
                                      setEditablePayload({ ...editablePayload, registros: newRegs })
                                    }}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:border-secondary focus:outline-none"
                                  />
                                </div>
                              )}

                              {/* Descripción si existe */}
                              {det.descripcion !== undefined && (
                                <div>
                                  <label className="block text-xs font-semibold text-slate-400 mb-1">
                                    Descripción / Observación
                                  </label>
                                  <textarea
                                    rows={2}
                                    value={det.descripcion || ''}
                                    onChange={(e) => {
                                      const newRegs = [...editablePayload.registros]
                                      newRegs[rIdx].detalles[dIdx].descripcion = e.target.value
                                      setEditablePayload({ ...editablePayload, registros: newRegs })
                                    }}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-200 focus:border-secondary focus:outline-none resize-none"
                                  />
                                </div>
                              )}

                              {/* Variables Numéricas */}
                              {det.variables && Object.keys(det.variables).length > 0 && (
                                <div>
                                  <label className="block text-xs font-semibold text-slate-400 mb-2">
                                    Variables y Métricas Numéricas
                                  </label>
                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {Object.entries(det.variables).map(([vKey, vVal]) => (
                                      <div key={vKey} className="bg-slate-950 p-2 rounded border border-slate-800">
                                        <span className="block text-[11px] font-medium text-slate-400 truncate mb-1">
                                          {vKey}
                                        </span>
                                        <input
                                          type="number"
                                          min={0}
                                          value={vVal as number}
                                          onChange={(e) => {
                                            const newRegs = [...editablePayload.registros]
                                            newRegs[rIdx].detalles[dIdx].variables[vKey] = parseInt(e.target.value) || 0
                                            setEditablePayload({ ...editablePayload, registros: newRegs })
                                          }}
                                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs text-slate-100 font-bold focus:border-secondary focus:outline-none text-right"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="text-xs text-slate-500 italic">No hay detalles registrados en este bloque.</p>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 italic">No hay registros estructurados en este payload.</p>
                )}
              </div>
            </div>

            {/* Footer Modal Acciones */}
            <div className="p-6 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <Button
                type="button"
                onClick={handleSaveEdits}
                disabled={isSaving}
                variant="outline"
                className="w-full sm:w-auto border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                {isSaving ? 'Guardando...' : 'Guardar Ediciones Locales'}
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={handleRejectReport}
                  className="flex-1 sm:flex-none bg-rose-900/80 hover:bg-rose-800 text-rose-100 border border-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Rechazar Reporte
                </Button>

                <Button
                  type="button"
                  onClick={handleApproveReport}
                  className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
                >
                  <CheckCircle className="w-3.5 h-3.5" />
                  Aprobar Reporte
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Feedback General */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className={`w-12 h-12 rounded-full mx-auto flex items-center justify-center ${
              feedbackModal.type === 'success' ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' : 'bg-blue-950 border border-blue-700 text-blue-400'
            }`}>
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">{feedbackModal.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{feedbackModal.message}</p>
            <Button
              onClick={() => setFeedbackModal(null)}
              className="w-full bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs py-2 mt-2"
            >
              Entendido
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
