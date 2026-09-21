'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  RefreshCw,
  Search,
  CheckCircle,
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
  AlertTriangle,
  Settings,
  Link as LinkIcon,
  ExternalLink,
  Copy,
  ClipboardCheck,
  ArrowDown,
  Info,
  Trash2,
  Type,
  Hash
} from 'lucide-react'

interface ReceptorScreenProps {
  onBack: () => void
}

export interface StagingReport {
  id_transaccion: string
  fecha_emision: string
  departamento_emisor: string
  estado: 'Pendiente de Revisión' | 'Aprobado'
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
        descripcion_item?: string
        variables?: Record<string, any>
      }>
    }>
    [key: string]: any
  }
}

// IDs por defecto de FaCES UCV
const DEFAULT_STAGING_SPREADSHEET_ID = '18-fWk0JZWmB3MeKC6LWL-8qTWqSdAbo_SdA6XNQ2ar4'
const DEFAULT_MACRO_SPREADSHEET_ID = '1uf9cnqJO4epgGOmrnc9_M91vvFu4D9ju'

export default function ReceptorScreen({ onBack }: ReceptorScreenProps) {
  const [reports, setReports] = useState<StagingReport[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  
  // IDs de las Hojas de Staging y Macro Archivo
  const [stagingSheetId, setStagingSheetId] = useState<string>(DEFAULT_STAGING_SPREADSHEET_ID)
  const [macroSheetId, setMacroSheetId] = useState<string>(DEFAULT_MACRO_SPREADSHEET_ID)
  const [showConfigModal, setShowConfigModal] = useState(false)
  const [inputStagingUrl, setInputStagingUrl] = useState('')
  const [inputMacroUrl, setInputMacroUrl] = useState('')
  const [configSuccessMsg, setConfigSuccessMsg] = useState<string | null>(null)

  // Modal de confirmación para borrar Staging
  const [showClearStagingConfirm, setShowClearStagingConfirm] = useState(false)
  const [isClearingStaging, setIsClearingStaging] = useState(false)
  const [reportToDelete, setReportToDelete] = useState<StagingReport | null>(null)
  const [isDeletingSingleReport, setIsDeletingSingleReport] = useState(false)

  // Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('Todos')
  
  // Modal de Edición
  const [selectedReport, setSelectedReport] = useState<StagingReport | null>(null)
  const [editablePayload, setEditablePayload] = useState<any>(null)
  const [isSubmittingApproval, setIsSubmittingApproval] = useState(false)
  const [copiedItemIdx, setCopiedItemIdx] = useState<string | null>(null)
  const [feedbackModal, setFeedbackModal] = useState<{ title: string; message: string; type: 'success' | 'info' | 'error' } | null>(null)

  // Meses Habilitados
  const ALL_MONTHS = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  const [allowedMonths, setAllowedMonths] = useState<string[]>(ALL_MONTHS)

  // Cargar IDs y Meses guardados al iniciar
  useEffect(() => {
    const savedStagingId = localStorage.getItem('FACES_STAGING_SHEET_ID')
    const savedMacroId = localStorage.getItem('FACES_MACRO_SHEET_ID')
    const savedMonths = localStorage.getItem('FACES_ALLOWED_MONTHS')

    if (savedStagingId && savedStagingId.trim() !== '') {
      setStagingSheetId(savedStagingId)
    }
    if (savedMacroId && savedMacroId.trim() !== '') {
      setMacroSheetId(savedMacroId)
    }
    if (savedMonths) {
      try {
        const parsed = JSON.parse(savedMonths)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAllowedMonths(parsed)
        }
      } catch (e) {}
    }
  }, [])

  // Cargar reportes de la Zona de Staging
  const fetchStagingReports = async () => {
    setIsLoading(true)
    setErrorMsg(null)
    try {
      const activeStagingId = stagingSheetId || DEFAULT_STAGING_SPREADSHEET_ID
      const res = await fetch(`/api/staging?spreadsheetId=${activeStagingId}`, { cache: 'no-store' })
      const data = await res.json()

      if (data.status === 'success' && Array.isArray(data.reportes)) {
        setReports(data.reportes)
      } else {
        console.warn('Respuesta del servidor:', data)
        setReports([])
        if (data.message) setErrorMsg(`Aviso del servidor: ${data.message}`)
      }
    } catch (err: any) {
      console.error('Error al cargar reportes:', err)
      setErrorMsg('No se pudo conectar con el servidor de Staging.')
      setReports([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStagingReports()
  }, [stagingSheetId])

  // Borrar todos los registros de la Zona de Staging
  const handleClearAllStaging = async () => {
    setIsClearingStaging(true)
    try {
      const activeStagingId = stagingSheetId || DEFAULT_STAGING_SPREADSHEET_ID
      const res = await fetch('/api/staging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'limpiarStaging',
          spreadsheetId: activeStagingId
        })
      })

      const data = await res.json()

      if (data.status === 'success') {
        setReports([])
        setShowClearStagingConfirm(false)
        setFeedbackModal({
          title: '🗑️ Staging Limpiado',
          message: 'Todos los registros han sido borrados exitosamente de la Zona de Staging.',
          type: 'success'
        })
      } else {
        alert(data.message || 'No se pudo limpiar la Zona de Staging.')
      }
    } catch (err: any) {
      console.error('Error al limpiar Staging:', err)
      alert('Error de conexión al intentar limpiar Staging.')
    } finally {
      setIsClearingStaging(false)
    }
  }

  // Borrar un solo reporte de la Zona de Staging
  const handleDeleteSingleReport = async () => {
    if (!reportToDelete) return
    setIsDeletingSingleReport(true)
    try {
      const activeStagingId = stagingSheetId || DEFAULT_STAGING_SPREADSHEET_ID
      const res = await fetch('/api/staging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'eliminarReporteStaging',
          id_transaccion: reportToDelete.id_transaccion,
          spreadsheetId: activeStagingId
        })
      })

      const data = await res.json()

      if (data.status === 'success') {
        const deletedId = reportToDelete.id_transaccion
        setReports((prev) => prev.filter((r) => r.id_transaccion !== deletedId))
        setReportToDelete(null)
        setFeedbackModal({
          title: '🗑️ Reporte Eliminado',
          message: `El reporte ${deletedId} ha sido eliminado exitosamente de la Zona de Staging.`,
          type: 'success'
        })
      } else {
        alert(data.message || 'No se pudo eliminar el reporte de la Zona de Staging.')
      }
    } catch (err: any) {
      console.error('Error al eliminar reporte:', err)
      alert('Error de conexión al intentar eliminar el reporte.')
    } finally {
      setIsDeletingSingleReport(false)
    }
  }

  // Manejar vinculación de nuevas hojas por URL
  const handleLinkNewSheets = () => {
    let newStaging = stagingSheetId
    let newMacro = macroSheetId

    if (inputStagingUrl.trim()) {
      const matchS = inputStagingUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      if (matchS && matchS[1]) {
        newStaging = matchS[1]
        setStagingSheetId(newStaging)
        localStorage.setItem('FACES_STAGING_SHEET_ID', newStaging)
      } else {
        alert('URL de Hoja de Staging inválida.')
        return
      }
    }

    if (inputMacroUrl.trim()) {
      const matchM = inputMacroUrl.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
      if (matchM && matchM[1]) {
        newMacro = matchM[1]
        setMacroSheetId(newMacro)
        localStorage.setItem('FACES_MACRO_SHEET_ID', newMacro)
      } else {
        alert('URL de Macro Archivo inválida.')
        return
      }
    }

    // Guardar meses habilitados
    localStorage.setItem('FACES_ALLOWED_MONTHS', JSON.stringify(allowedMonths))
    // Notificar a otras ventanas/componentes
    window.dispatchEvent(new Event('storage'))

    setConfigSuccessMsg('¡Configuración y Meses actualizados exitosamente!')
    setTimeout(() => {
      setConfigSuccessMsg(null)
      setShowConfigModal(false)
      setInputStagingUrl('')
      setInputMacroUrl('')
    }, 1500)
  }

  const handleToggleMonth = (month: string) => {
    setAllowedMonths((prev) => {
      if (prev.includes(month)) {
        // Evitar desmarcar todos si solo queda 1
        if (prev.length === 1) return prev
        return prev.filter((m) => m !== month)
      } else {
        return [...prev, month]
      }
    })
  }

  // Abrir modal de edición
  const handleOpenEdit = (report: StagingReport) => {
    setSelectedReport(report)
    setEditablePayload(JSON.parse(JSON.stringify(report.payload)))
  }

  // Copiar columna VERTICAL de métrica para las 7 carreras (separada por salto de línea \n)
  const handleCopyVerticalColumnToClipboard = (metricKey: string) => {
    if (!editablePayload || !editablePayload.registros) return

    const values: number[] = []
    editablePayload.registros.forEach((reg: any) => {
      reg.detalles?.forEach((det: any) => {
        if (det.variables && det.variables[metricKey] !== undefined) {
          const val = typeof det.variables[metricKey] === 'number'
            ? det.variables[metricKey]
            : parseInt(String(det.variables[metricKey])) || 0
          values.push(val)
        }
      })
    })

    const verticalString = values.join('\n')
    navigator.clipboard.writeText(verticalString)
    setCopiedItemIdx(`CONTROL_VERT_${metricKey}`)
    setTimeout(() => setCopiedItemIdx(null), 2500)
  }

  // Copiar solo el NOMBRE / ACTIVIDAD de un ítem (para pegar en la Columna A/B de Excel)
  const handleCopyTitleToClipboard = (det: any, itemKey: string) => {
    const titleText = det.sub_bloque || det.actividad || det.descripcion_item || det.descripcion || ''
    navigator.clipboard.writeText(titleText)
    setCopiedItemIdx(`TITLE_${itemKey}`)
    setTimeout(() => setCopiedItemIdx(null), 2500)
  }

  // Copiar solo las CANTIDADES / METRICAS de un ítem (para pegar en las celdas del mes)
  const handleCopyMetricsToClipboard = (det: any, itemKey: string) => {
    const vars = det.variables || {}
    const valuesArray = Object.values(vars).map(v => typeof v === 'number' ? v : (v !== null && v !== undefined ? String(v) : ''))
    
    const textToCopy = valuesArray.join('\t')

    navigator.clipboard.writeText(textToCopy)
    setCopiedItemIdx(`METRICS_${itemKey}`)
    setTimeout(() => setCopiedItemIdx(null), 2500)
  }

  // Guardar ediciones locales en estado
  const handleSaveEdits = () => {
    if (!selectedReport || !editablePayload) return
    setReports((prev) =>
      prev.map((r) =>
        r.id_transaccion === selectedReport.id_transaccion
          ? { ...r, payload: editablePayload }
          : r
      )
    )
    setFeedbackModal({
      title: '¡Edición Guardada!',
      message: `Los cambios locales para la transacción ${selectedReport.id_transaccion} han sido actualizados en pantalla.`,
      type: 'info'
    })
  }

  // Aprobar Reporte (Actualizar Estado a "Aprobado" en Staging Zone)
  const handleApproveReport = async () => {
    if (!selectedReport) return
    setIsSubmittingApproval(true)

    try {
      const activeStagingId = stagingSheetId || DEFAULT_STAGING_SPREADSHEET_ID
      const res = await fetch('/api/staging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'aprobarReporte',
          id_transaccion: selectedReport.id_transaccion,
          payload: editablePayload,
          spreadsheetId: activeStagingId
        })
      })

      const data = await res.json()

      if (data.status === 'success') {
        const updatedReports = reports.map((r) =>
          r.id_transaccion === selectedReport.id_transaccion
            ? { ...r, estado: 'Aprobado' as const, payload: editablePayload }
            : r
        )
        setReports(updatedReports)

        setFeedbackModal({
          title: '✅ ¡Reporte Aprobado!',
          message: `El reporte ${selectedReport.id_transaccion} ha sido marcado como Aprobado en la Zona de Staging.`,
          type: 'success'
        })
        setSelectedReport(null)
      } else {
        setFeedbackModal({
          title: '⚠️ Advertencia al Aprobar',
          message: data.message || 'No se pudo actualizar el estado en Staging.',
          type: 'error'
        })
      }
    } catch (err: any) {
      console.error('Error al aprobar reporte:', err)
      setFeedbackModal({
        title: '❌ Error de Conexión',
        message: err.message || 'Ocurrió un fallo de conexión con el servidor backend.',
        type: 'error'
      })
    } finally {
      setIsSubmittingApproval(false)
    }
  }

  // Filtrado de reportes
  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.id_transaccion.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.departamento_emisor.toLowerCase().includes(searchTerm.toLowerCase())
    
    if (selectedStatus === 'Todos') return matchesSearch
    return matchesSearch && r.estado === selectedStatus
  })

  // Estadísticas (solo Pendientes y Aprobados)
  const totalCount = reports.length
  const pendingCount = reports.filter((r) => r.estado === 'Pendiente de Revisión').length
  const approvedCount = reports.filter((r) => r.estado === 'Aprobado').length

  const isControlDeEstudios = editablePayload?.departamento_emisor?.toLowerCase().includes('control de estudios')
  const isEnero = editablePayload?.mes_reportado?.toLowerCase().includes('enero')

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-4">
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
                  Consolidación, revisión y copiado asistido al Macro Archivo FaCES
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowClearStagingConfirm(true)}
                variant="outline"
                className="bg-rose-950/80 hover:bg-rose-900 text-rose-200 border border-rose-800/80 text-xs font-semibold flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-400" />
                Limpiar Staging
              </Button>

              <Button
                onClick={() => setShowConfigModal(true)}
                className="bg-slate-900/90 hover:bg-slate-800 text-slate-100 border border-slate-700 text-xs font-semibold flex items-center gap-2 shadow-md"
              >
                <Settings className="w-4 h-4 text-secondary" />
                ⚙️ Configuración / Hojas
              </Button>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900/60 backdrop-blur border border-slate-800 p-4 rounded-xl">
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Staging</p>
              <p className="text-3xl font-bold text-white mt-1">{totalCount}</p>
            </div>
            <div className="bg-amber-950/40 backdrop-blur border border-amber-800/50 p-4 rounded-xl">
              <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">Pendientes de Revisión</p>
              <p className="text-3xl font-bold text-amber-300 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-emerald-950/40 backdrop-blur border border-emerald-800/50 p-4 rounded-xl">
              <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">Aprobados</p>
              <p className="text-3xl font-bold text-emerald-300 mt-1">{approvedCount}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-6xl px-6 py-8 space-y-6">
        {/* Banner Informativo de Hojas Vinculadas */}
        <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl backdrop-blur flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-col gap-1 text-slate-300">
            <div className="flex items-center gap-2">
              <LinkIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
              <span>Hoja de Staging (Entrada): <strong className="text-white font-mono">{stagingSheetId}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>Macro Archivo (Destino): <strong className="text-white font-mono">{macroSheetId}</strong></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={`https://docs.google.com/spreadsheets/d/${stagingSheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-secondary hover:underline flex items-center gap-1 font-semibold"
            >
              Staging <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-slate-600">|</span>
            <a
              href={`https://docs.google.com/spreadsheets/d/${macroSheetId}/edit`}
              target="_blank"
              rel="noreferrer"
              className="text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              Macro Archivo <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

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
            {['Todos', 'Pendiente de Revisión', 'Aprobado'].map((status) => (
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
              No hay transacciones registradas en la Zona de Staging de la hoja vinculada.
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
                      Revisar y Copiar Datos
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => setReportToDelete(report)}
                      variant="outline"
                      title="Eliminar este reporte"
                      className="bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 hover:text-white border border-rose-800/80 hover:border-rose-700 p-2.5 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4 text-rose-400" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal de Confirmación para Limpiar Staging Completo */}
      {showClearStagingConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-rose-950 border border-rose-700 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">¿Limpiar toda la Zona de Staging?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Esta acción borrará <strong>todos los registros acumulados</strong> en la pestaña Zona de Staging de Google Sheets. Use esta opción cuando desee reiniciar la lista de reportes recibidos.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => setShowClearStagingConfirm(false)}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleClearAllStaging}
                disabled={isClearingStaging}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                {isClearingStaging ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Limpiando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Sí, Limpiar Todo Staging
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Confirmación para Borrar Reporte Individual */}
      {reportToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4 text-center">
            <div className="w-12 h-12 rounded-full mx-auto bg-rose-950 border border-rose-700 text-rose-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white">¿Eliminar este reporte?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar el reporte <strong className="font-mono text-amber-300">{reportToDelete.id_transaccion}</strong> de <strong>{reportToDelete.departamento_emisor}</strong> de la Zona de Staging?
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => setReportToDelete(null)}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleDeleteSingleReport}
                disabled={isDeletingSingleReport}
                className="bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                {isDeletingSingleReport ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    Eliminando...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    Sí, Eliminar
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Configuración / Vincular Hojas */}
      {showConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <Settings className="w-5 h-5 text-secondary" />
                Vincular Hojas de Cálculo
              </div>
              <button
                onClick={() => setShowConfigModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Si ha creado o subido nuevos archivos a Google Drive, pegue las URLs a continuación para actualizar la aplicación.
            </p>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  URL de Hoja de Staging (Entrada)
                </label>
                <input
                  type="text"
                  placeholder={`Actual: ${stagingSheetId}`}
                  value={inputStagingUrl}
                  onChange={(e) => setInputStagingUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-secondary focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  URL del Macro Archivo (Destino)
                </label>
                <input
                  type="text"
                  placeholder={`Actual: ${macroSheetId}`}
                  value={inputMacroUrl}
                  onChange={(e) => setInputMacroUrl(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-100 focus:border-primary focus:outline-none"
                />
              </div>

              {/* Control de Meses Habilitados */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    📅 Meses Habilitados para Emisión
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAllowedMonths(ALL_MONTHS)}
                      className="text-[11px] text-secondary hover:underline font-semibold"
                    >
                      Todos
                    </button>
                    <span className="text-slate-600">|</span>
                    <button
                      type="button"
                      onClick={() => {
                        const currentMonthName = [
                          'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                          'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
                        ][new Date().getMonth()]
                        setAllowedMonths([currentMonthName])
                      }}
                      className="text-[11px] text-primary hover:underline font-semibold"
                    >
                      Solo Mes Actual
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800">
                  {ALL_MONTHS.map((m) => {
                    const isChecked = allowedMonths.includes(m)
                    return (
                      <label
                        key={m}
                        className={`flex items-center gap-1.5 text-xs font-semibold px-2 py-1.5 rounded cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-secondary/20 text-secondary border border-secondary/40'
                            : 'bg-slate-900 text-slate-500 border border-slate-800 hover:text-slate-300'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleMonth(m)}
                          className="rounded border-slate-700 text-secondary focus:ring-secondary h-3.5 w-3.5"
                        />
                        <span>{m}</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            </div>

            {configSuccessMsg && (
              <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{configSuccessMsg}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <Button
                variant="outline"
                onClick={() => setShowConfigModal(false)}
                className="border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleLinkNewSheets}
                className="bg-secondary hover:bg-secondary/90 text-white font-semibold text-xs flex items-center gap-1.5"
              >
                <LinkIcon className="w-3.5 h-3.5" />
                Vincular y Guardar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Revisión, Edición y Copiado Asistido */}
      {selectedReport && editablePayload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header Modal */}
            <div className="bg-gradient-to-r from-slate-900 via-primary/80 to-secondary/80 p-6 text-white flex justify-between items-center border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold">Asistente de Copiado y Aprobación</h2>
                  <span className="font-mono text-xs bg-black/40 px-2.5 py-0.5 rounded border border-white/20">
                    {selectedReport.id_transaccion}
                  </span>
                </div>
                <p className="text-xs text-slate-200 mt-1">
                  Remitente: <strong className="text-white">{selectedReport.departamento_emisor}</strong> | 
                  Mes: <strong className="text-white">{editablePayload.mes_reportado || 'No especificado'}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Cuerpo Editable con Asistente Especializado */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-slate-200">
              {/* ASISTENTE ESPECIALIZADO: Control de Estudios (Filas = Carreras, Columnas = Métricas) */}
              {isControlDeEstudios ? (
                <div className="bg-slate-950 border border-primary/50 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <Layers className="w-4 h-4 text-primary" />
                        Asistente Especializado: Control de Estudios (7 Carreras)
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {isEnero
                          ? 'Modo Enero: Incluye la columna de Prosecución Inicial.'
                          : 'Copia las columnas de métricas verticalmente para llenar las 7 carreras en Excel de un solo golpe.'}
                      </p>
                    </div>
                    <span className="text-[11px] bg-primary/20 text-primary border border-primary/40 font-bold px-2.5 py-1 rounded-full">
                      Mes: {editablePayload.mes_reportado || 'Enero'}
                    </span>
                  </div>

                  {/* Copiado por Columna Vertical (Hacia abajo) */}
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                      <ArrowDown className="w-4 h-4 text-emerald-400" />
                      Copiado por Columna Vertical (Llenar las 7 Carreras hacia abajo con 1 Ctrl+V)
                    </p>
                    <div className={`grid grid-cols-1 ${isEnero ? 'sm:grid-cols-4' : 'sm:grid-cols-3'} gap-3`}>
                      <Button
                        type="button"
                        onClick={() => handleCopyVerticalColumnToClipboard('nuevos_ingresos')}
                        className="bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-700/80 text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
                      >
                        {copiedItemIdx === 'CONTROL_VERT_nuevos_ingresos' ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                            ¡Columna Copiada!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-emerald-400" />
                            Nuevos Ingresos
                          </>
                        )}
                      </Button>

                      {/* Botón Prosecución - SOLO en Enero */}
                      {isEnero && (
                        <Button
                          type="button"
                          onClick={() => handleCopyVerticalColumnToClipboard('prosecucion')}
                          className="bg-purple-950/80 hover:bg-purple-900 text-purple-300 border border-purple-700/80 text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
                        >
                          {copiedItemIdx === 'CONTROL_VERT_prosecucion' ? (
                            <>
                              <ClipboardCheck className="w-4 h-4 text-purple-400" />
                              ¡Columna Copiada!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 text-purple-400" />
                              Prosecución (Enero)
                            </>
                          )}
                        </Button>
                      )}

                      <Button
                        type="button"
                        onClick={() => handleCopyVerticalColumnToClipboard('egresados')}
                        className="bg-blue-950/80 hover:bg-blue-900 text-blue-300 border border-blue-700/80 text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
                      >
                        {copiedItemIdx === 'CONTROL_VERT_egresados' ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-blue-400" />
                            ¡Columna Copiada!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-blue-400" />
                            Egresados
                          </>
                        )}
                      </Button>

                      <Button
                        type="button"
                        onClick={() => handleCopyVerticalColumnToClipboard('retiros')}
                        className="bg-amber-950/80 hover:bg-amber-900 text-amber-300 border border-amber-700/80 text-xs font-semibold py-2.5 flex items-center justify-center gap-2"
                      >
                        {copiedItemIdx === 'CONTROL_VERT_retiros' ? (
                          <>
                            <ClipboardCheck className="w-4 h-4 text-amber-400" />
                            ¡Columna Copiada!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 text-amber-400" />
                            Retiros
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* Nota aclaratoria */}
                  <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                    <Info className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                    <span>
                      <strong>Instrucción:</strong> Haga clic en la primera celda de la métrica deseada para la primera carrera (Administración) en el mes de <strong>{editablePayload.mes_reportado}</strong> y presione <code>Ctrl + V</code>. Pegará las 7 carreras hacia abajo verticalmente.
                    </span>
                  </div>
                </div>
              ) : (
                /* Banner Guía Estándar para los demás departamentos */
                <div className="bg-blue-950/50 border border-blue-800/60 p-4 rounded-xl text-xs text-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-white mb-0.5">📋 Asistente de Copiado por Segmento a Excel</p>
                    <p className="text-slate-300">
                      Utilice <strong>Copiar Nombre</strong> para la Columna A (Texto) y <strong>Copiar Cantidades</strong> para las celdas del mes (Números).
                    </p>
                  </div>
                </div>
              )}

              {/* Información General de Encabezado */}
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
                  Tablas y Secciones de Destino en el Macro Archivo
                </h3>

                {editablePayload.registros && editablePayload.registros.length > 0 ? (
                  editablePayload.registros.map((reg: any, rIdx: number) => (
                    <div key={rIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-5 space-y-4">
                      {/* Cabecera del Registro con ubicación clara */}
                      <div className="flex flex-col sm:flex-row gap-3 pb-3 border-b border-slate-800 items-start sm:items-center justify-between">
                        <div className="flex items-center flex-wrap gap-2">
                          <span className="bg-secondary/20 text-secondary text-xs font-bold px-2.5 py-1 rounded border border-secondary/40 flex items-center gap-1">
                            📍 Ir a Hoja Excel: <strong>{reg.hoja_destino}</strong>
                          </span>
                          <span className="bg-slate-800 text-slate-200 text-xs font-bold px-2.5 py-1 rounded border border-slate-700">
                            Sección: {reg.bloque}
                          </span>
                        </div>
                      </div>

                      {/* Detalles / Filas de la Tabla */}
                      <div className="space-y-4 pt-1">
                        {reg.detalles && reg.detalles.length > 0 ? (
                          reg.detalles.map((det: any, dIdx: number) => {
                            const itemKey = `${rIdx}-${dIdx}`
                            const title = det.sub_bloque || det.actividad || det.descripcion_item || det.descripcion || `Fila ${dIdx + 1}`

                            return (
                              <div key={dIdx} className="bg-slate-900 p-4 rounded-lg border border-slate-800 space-y-3">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                                  <div className="flex-1">
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                                      {det.sub_bloque ? 'Carrera / Mención' : 'Nombre de Actividad / Ítem'}
                                    </label>
                                    <input
                                      type="text"
                                      value={title}
                                      onChange={(e) => {
                                        const newRegs = [...editablePayload.registros]
                                        if (det.sub_bloque !== undefined) newRegs[rIdx].detalles[dIdx].sub_bloque = e.target.value
                                        else if (det.actividad !== undefined) newRegs[rIdx].detalles[dIdx].actividad = e.target.value
                                        else newRegs[rIdx].detalles[dIdx].descripcion_item = e.target.value
                                        setEditablePayload({ ...editablePayload, registros: newRegs })
                                      }}
                                      className="w-full bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs text-slate-200 focus:border-secondary focus:outline-none font-bold"
                                    />
                                  </div>

                                  {/* Botones de Copiado Segmentado por Fila */}
                                  {!isControlDeEstudios && (
                                    <div className="flex items-center gap-2 shrink-0">
                                      <Button
                                        type="button"
                                        onClick={() => handleCopyTitleToClipboard(det, itemKey)}
                                        className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 text-xs py-1 px-2.5 flex items-center gap-1"
                                      >
                                        {copiedItemIdx === `TITLE_${itemKey}` ? (
                                          <>
                                            <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400 font-bold">¡Nombre Copiado!</span>
                                          </>
                                        ) : (
                                          <>
                                            <Type className="w-3.5 h-3.5 text-secondary" />
                                            <span>Copiar Nombre</span>
                                          </>
                                        )}
                                      </Button>

                                      {det.variables && Object.keys(det.variables).length > 0 && (
                                        <Button
                                          type="button"
                                          onClick={() => handleCopyMetricsToClipboard(det, itemKey)}
                                          className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 text-xs py-1 px-2.5 flex items-center gap-1"
                                        >
                                          {copiedItemIdx === `METRICS_${itemKey}` ? (
                                            <>
                                              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-400" />
                                              <span className="text-emerald-400 font-bold">¡Cantidades Copiadas!</span>
                                            </>
                                          ) : (
                                            <>
                                              <Hash className="w-3.5 h-3.5 text-emerald-400" />
                                              <span>Copiar Cantidades</span>
                                            </>
                                          )}
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>

                                {/* Variables / Métricas */}
                                {det.variables && Object.keys(det.variables).length > 0 && (
                                  <div>
                                    <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                                      Métricas y Datos
                                    </label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                      {Object.entries(det.variables).map(([vKey, vVal]) => (
                                        <div key={vKey} className="bg-slate-950 p-2 rounded border border-slate-800">
                                          <span className="block text-[11px] font-medium text-slate-400 truncate mb-1">
                                            {vKey}
                                          </span>
                                          <input
                                            type={typeof vVal === 'number' ? 'number' : 'text'}
                                            min={typeof vVal === 'number' ? 0 : undefined}
                                            value={vVal as any}
                                            onChange={(e) => {
                                              const newRegs = [...editablePayload.registros]
                                              newRegs[rIdx].detalles[dIdx].variables[vKey] = typeof vVal === 'number' ? (parseInt(e.target.value) || 0) : e.target.value
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
                            )
                          })
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
                variant="outline"
                className="w-full sm:w-auto border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center justify-center gap-2"
              >
                <Save className="w-3.5 h-3.5" />
                Guardar Ediciones Locales
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  onClick={handleApproveReport}
                  disabled={isSubmittingApproval}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50"
                >
                  {isSubmittingApproval ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      Marcando como Aprobado...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5" />
                      Marcar como Aprobado
                    </>
                  )}
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
              feedbackModal.type === 'success'
                ? 'bg-emerald-950 border border-emerald-700 text-emerald-400'
                : feedbackModal.type === 'error'
                ? 'bg-rose-950 border border-rose-700 text-rose-400'
                : 'bg-blue-950 border border-blue-700 text-blue-400'
            }`}>
              {feedbackModal.type === 'error' ? <AlertTriangle className="w-6 h-6" /> : <Check className="w-6 h-6" />}
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
