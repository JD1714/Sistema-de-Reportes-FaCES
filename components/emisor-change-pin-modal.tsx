'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { KeyRound, CheckCircle2, AlertCircle, X, ShieldAlert } from 'lucide-react'

interface EmisorChangePinModalProps {
  isOpen: boolean
  onClose: () => void
  departamento: string
  spreadsheetId?: string
}

export default function EmisorChangePinModal({
  isOpen,
  onClose,
  departamento,
  spreadsheetId,
}: EmisorChangePinModalProps) {
  const [pinActual, setPinActual] = useState('')
  const [pinNuevo, setPinNuevo] = useState('')
  const [pinConfirm, setPinConfirm] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleClose = () => {
    setPinActual('')
    setPinNuevo('')
    setPinConfirm('')
    setErrorMessage(null)
    setSuccessMessage(null)
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!pinActual.trim()) {
      setErrorMessage('Por favor ingrese su PIN actual.')
      return
    }

    if (!/^\d{6}$/.test(pinNuevo.trim())) {
      setErrorMessage('El nuevo PIN debe tener exactamente 6 números.')
      return
    }

    if (pinNuevo.trim() !== pinConfirm.trim()) {
      setErrorMessage('La confirmación no coincide con el nuevo PIN.')
      return
    }

    if (pinActual.trim() === pinNuevo.trim()) {
      setErrorMessage('El nuevo PIN debe ser diferente al actual.')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/auth/emisor', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departamento,
          pinActual: pinActual.trim(),
          pinNuevo: pinNuevo.trim(),
          spreadsheetId,
        }),
      })

      const data = await res.json()
      if (data.success) {
        setSuccessMessage(data.message || '¡PIN actualizado exitosamente!')
        setTimeout(() => {
          handleClose()
        }, 1800)
      } else {
        setErrorMessage(data.message || 'Error al cambiar el PIN.')
      }
    } catch (err: any) {
      setErrorMessage('Fallo de conexión al cambiar el PIN. Intente de nuevo.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-md rounded-xl p-6 shadow-2xl relative text-foreground">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary border border-secondary/20">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Cambiar PIN de Acceso</h3>
            <p className="text-xs text-muted-foreground line-clamp-1">{departamento}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg flex items-start gap-2.5 text-xs text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-start gap-2.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              PIN Actual
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinActual}
              onChange={(e) => setPinActual(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              disabled={isSubmitting || !!successMessage}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground tracking-widest text-center font-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Nuevo PIN (6 números)
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinNuevo}
              onChange={(e) => setPinNuevo(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              disabled={isSubmitting || !!successMessage}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground tracking-widest text-center font-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground mb-1">
              Confirmar Nuevo PIN
            </label>
            <input
              type="password"
              maxLength={6}
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              placeholder="••••••"
              disabled={isSubmitting || !!successMessage}
              className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground tracking-widest text-center font-mono focus:border-secondary focus:ring-1 focus:ring-secondary focus:outline-none"
              required
            />
          </div>

          <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-secondary mt-0.5" />
            <p>
              El nuevo PIN se guardará en la pestaña <strong>Usuarios</strong> de Google Sheets. Si olvida su clave, solicite el restablecimiento a la <strong>Administración</strong>.
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !!successMessage}
              className="flex-1 bg-secondary text-white hover:bg-secondary/90 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Actualizando...
                </>
              ) : (
                'Guardar PIN'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
