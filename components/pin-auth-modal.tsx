'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Lock, ArrowLeft, ShieldAlert, CheckCircle2, Loader2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PinAuthModalProps {
  onSuccess: () => void
  onBack: () => void
  spreadsheetId?: string
}

export default function PinAuthModal({ onSuccess, onBack, spreadsheetId }: PinAuthModalProps) {
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  useEffect(() => {
    // Auto-focus en el primer campo al cargar
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [])

  const handleInputChange = (index: number, value: string) => {
    // Si se pegan varios dígitos juntos
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, '').slice(0, 6)
      if (cleaned.length > 0) {
        const newDigits = ['', '', '', '', '', '']
        cleaned.split('').forEach((char, idx) => {
          if (idx < 6) newDigits[idx] = char
        })
        setPinDigits(newDigits)
        setErrorMessage(null)
        if (cleaned.length === 6) {
          verifyPin(cleaned)
        } else {
          const nextIndex = Math.min(cleaned.length, 5)
          inputRefs.current[nextIndex]?.focus()
        }
        return
      }
    }

    // Un solo dígito
    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...pinDigits]
    newDigits[index] = digit
    setPinDigits(newDigits)
    setErrorMessage(null)

    if (digit !== '') {
      // Avanzar al siguiente input
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      } else {
        // Se completaron los 6 dígitos
        const completePin = newDigits.join('')
        if (completePin.length === 6) {
          verifyPin(completePin)
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (pinDigits[index] === '' && index > 0) {
        // Si el actual está vacío, retroceder y borrar el anterior
        const newDigits = [...pinDigits]
        newDigits[index - 1] = ''
        setPinDigits(newDigits)
        inputRefs.current[index - 1]?.focus()
      } else {
        const newDigits = [...pinDigits]
        newDigits[index] = ''
        setPinDigits(newDigits)
      }
      setErrorMessage(null)
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyPadClick = (num: string) => {
    const emptyIndex = pinDigits.findIndex((d) => d === '')
    if (emptyIndex !== -1) {
      handleInputChange(emptyIndex, num)
    }
  }

  const handleClear = () => {
    setPinDigits(['', '', '', '', '', ''])
    setErrorMessage(null)
    inputRefs.current[0]?.focus()
  }

  const verifyPin = async (pinToVerify: string) => {
    setIsVerifying(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/auth/pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pin: pinToVerify,
          spreadsheetId: spreadsheetId,
        }),
      })

      const data = await res.json()

      if (data.valid) {
        setIsSuccess(true)
        sessionStorage.setItem('FACES_RECEPTOR_AUTH', 'true')
        setTimeout(() => {
          onSuccess()
        }, 600)
      } else {
        setErrorMessage('El PIN ingresado es incorrecto. Verifique con la Administración.')
        setPinDigits(['', '', '', '', '', ''])
        setTimeout(() => {
          inputRefs.current[0]?.focus()
        }, 100)
      }
    } catch (err) {
      console.error('Error al validar PIN:', err)
      setErrorMessage('Error de conexión al validar el PIN. Intente nuevamente.')
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Luces de fondo decorativas */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

      {/* Botón Volver */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-slate-900/80 backdrop-blur hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs flex items-center gap-1.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al Inicio
        </Button>
      </div>

      {/* Tarjeta Central de Autenticación */}
      <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur relative z-10 space-y-6 animate-fade-in">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-1">
            <Image
              src="/faces_logo_dark.png"
              alt="FaCES UCV"
              width={64}
              height={64}
              className="w-16 h-16 object-contain filter drop-shadow"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-semibold text-secondary">
            <Lock className="w-3.5 h-3.5" />
            Acceso Administrativo Protegido
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">Módulo Receptor</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Ingrese el PIN de 6 dígitos autorizado para consultar, revisar y consolidar los reportes institucionales.
          </p>
        </div>

        {/* Inputs de los 6 dígitos */}
        <div className="space-y-4">
          <div className="flex justify-center items-center gap-2 sm:gap-3">
            {pinDigits.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el
                }}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                disabled={isVerifying || isSuccess}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
                  isSuccess
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-300'
                    : errorMessage
                    ? 'border-rose-600 bg-rose-950/30 text-rose-300 ring-1 ring-rose-500/50'
                    : digit !== ''
                    ? 'border-secondary bg-slate-900 text-white ring-1 ring-secondary/50 shadow-md shadow-secondary/10'
                    : 'border-slate-700 bg-slate-950/80 text-white focus:border-secondary focus:ring-2 focus:ring-secondary/30'
                }`}
              />
            ))}
          </div>

          {/* Estado de carga o error */}
          <div className="min-h-[28px] flex items-center justify-center">
            {isVerifying && (
              <div className="flex items-center gap-2 text-xs font-semibold text-secondary animate-pulse">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verificando credenciales...</span>
              </div>
            )}
            {isSuccess && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-fade-in">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡PIN Correcto! Accediendo al sistema...</span>
              </div>
            )}
            {errorMessage && !isVerifying && (
              <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 animate-shake">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Teclado numérico táctil / rápido */}
        <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto pt-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isVerifying || isSuccess}
              onClick={() => handleKeyPadClick(num)}
              className="h-11 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-base font-bold text-white transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={isVerifying || isSuccess}
            onClick={handleClear}
            className="h-11 rounded-lg bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            Borrar
          </button>
          <button
            type="button"
            disabled={isVerifying || isSuccess}
            onClick={() => handleKeyPadClick('0')}
            className="h-11 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 border border-slate-700/80 text-base font-bold text-white transition-colors"
          >
            0
          </button>
          <div className="flex items-center justify-center text-slate-600">
            <KeyRound className="w-4 h-4" />
          </div>
        </div>

        {/* Nota informativa al pie */}
        <div className="pt-2 border-t border-slate-800/80 text-center">
          <p className="text-[11px] text-slate-400">
            🔒 El PIN se administra directamente en la pestaña <strong className="text-white">Configuración</strong> de la Hoja de Staging en Google Sheets.
          </p>
        </div>
      </div>
    </div>
  )
}
