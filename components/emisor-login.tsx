'use client'

import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { Lock, ArrowLeft, ShieldAlert, CheckCircle2, Loader2, Building2, KeyRound } from 'lucide-react'
import { Button } from '@/components/ui/button'

export interface EmisorDepartment {
  id: string
  name: string
  icon: string
}

export const OFFICIAL_DEPARTMENTS: EmisorDepartment[] = [
  { id: 'control-estudios-pregrado', name: 'Control de Estudios - Pregrado', icon: '🎓' },
  { id: 'control-estudios-postgrado', name: 'Control de Estudios - Postgrado', icon: '🏛️' },
  { id: 'servicio-comunitario', name: 'Servicio Comunitario', icon: '🤝' },
  { id: 'biblioteca', name: 'Biblioteca', icon: '📚' },
  { id: 'desarrollo-estudiantil', name: 'Desarrollo Estudiantil', icon: '🌱' },
  { id: 'coordinacion-extension', name: 'Coordinación de Extensión', icon: '📣' },
  { id: 'compras', name: 'Departamento de Compras', icon: '🛒' },
  { id: 'extension-profesional', name: 'Centro de Extensión Profesional', icon: '💼' },
  { id: 'instituto-investigaciones', name: 'Instituto de Investigaciones', icon: '🔬' },
]

interface EmisorLoginProps {
  onSuccess: (departmentId: string, departmentName: string) => void
  onBack: () => void
  spreadsheetId?: string
}

export default function EmisorLogin({ onSuccess, onBack, spreadsheetId }: EmisorLoginProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string>('')
  const [pinDigits, setPinDigits] = useState<string[]>(['', '', '', '', '', ''])
  const [isVerifying, setIsVerifying] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const selectedDept = OFFICIAL_DEPARTMENTS.find((d) => d.id === selectedDeptId)

  const handleInputChange = (index: number, value: string) => {
    if (value.length > 1) {
      const cleaned = value.replace(/\D/g, '').slice(0, 6)
      if (cleaned.length > 0) {
        const newDigits = ['', '', '', '', '', '']
        cleaned.split('').forEach((char, idx) => {
          if (idx < 6) newDigits[idx] = char
        })
        setPinDigits(newDigits)
        setErrorMessage(null)
        if (cleaned.length === 6 && selectedDept) {
          verifyPin(selectedDept.name, cleaned)
        } else {
          const nextIndex = Math.min(cleaned.length, 5)
          inputRefs.current[nextIndex]?.focus()
        }
        return
      }
    }

    const digit = value.replace(/\D/g, '').slice(-1)
    const newDigits = [...pinDigits]
    newDigits[index] = digit
    setPinDigits(newDigits)
    setErrorMessage(null)

    if (digit !== '') {
      if (index < 5) {
        inputRefs.current[index + 1]?.focus()
      } else {
        const completePin = newDigits.join('')
        if (completePin.length === 6 && selectedDept) {
          verifyPin(selectedDept.name, completePin)
        }
      }
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (pinDigits[index] === '' && index > 0) {
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

  const verifyPin = async (deptName: string, pinToVerify: string) => {
    if (!deptName) {
      setErrorMessage('Por favor seleccione su departamento primero.')
      return
    }

    setIsVerifying(true)
    setErrorMessage(null)

    try {
      const res = await fetch('/api/auth/emisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          departamento: deptName,
          pin: pinToVerify,
          spreadsheetId: spreadsheetId,
        }),
      })

      const data = await res.json()

      if (data.valid) {
        setIsSuccess(true)
        const sessionData = {
          departamentoId: selectedDeptId,
          departamentoNombre: deptName,
          authenticated: true,
        }
        sessionStorage.setItem('FACES_EMISOR_AUTH', JSON.stringify(sessionData))
        setTimeout(() => {
          onSuccess(selectedDeptId, deptName)
        }, 600)
      } else {
        setErrorMessage(data.message || 'PIN incorrecto. Verifique con la Administración.')
        setPinDigits(['', '', '', '', '', ''])
        setTimeout(() => {
          inputRefs.current[0]?.focus()
        }, 100)
      }
    } catch (err) {
      console.error('Error al validar emisor:', err)
      setErrorMessage('Error de conexión al verificar el PIN. Intente nuevamente.')
    } finally {
      setIsVerifying(false)
    }
  }

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDept) {
      setErrorMessage('Por favor seleccione su departamento.')
      return
    }
    const pin = pinDigits.join('')
    if (pin.length !== 6) {
      setErrorMessage('Por favor ingrese los 6 dígitos del PIN.')
      return
    }
    verifyPin(selectedDept.name, pin)
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

      {/* Tarjeta Central de Login */}
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
            <Building2 className="w-3.5 h-3.5" />
            Acceso para Departamentos Emisores
          </div>

          <h2 className="text-2xl font-black tracking-tight text-white">Módulo Emisor</h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            Seleccione su departamento e ingrese el PIN asignado por la Administración para cargar su reporte.
          </p>
        </div>

        <form onSubmit={handleManualSubmit} className="space-y-4">
          {/* Selector de Departamento */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
              Departamento / Escuela
            </label>
            <div className="relative">
              <select
                value={selectedDeptId}
                onChange={(e) => {
                  setSelectedDeptId(e.target.value)
                  setErrorMessage(null)
                  setTimeout(() => {
                    inputRefs.current[0]?.focus()
                  }, 100)
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs sm:text-sm text-white focus:border-secondary focus:ring-2 focus:ring-secondary/30 outline-none appearance-none cursor-pointer"
              >
                <option value="" disabled>
                  -- Seleccione su Departamento --
                </option>
                {OFFICIAL_DEPARTMENTS.map((dept) => (
                  <option key={dept.id} value={dept.id} className="bg-slate-900 text-white py-2">
                    {dept.icon} {dept.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-xs">
                ▼
              </div>
            </div>
          </div>

          {/* Entrada de 6 dígitos del PIN */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider text-center">
              PIN de Acceso (6 dígitos)
            </label>

            <div className="flex justify-center items-center gap-2 sm:gap-2.5">
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
                  disabled={isVerifying || isSuccess || !selectedDeptId}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={`w-10 h-13 sm:w-12 sm:h-14 text-center text-2xl font-mono font-bold rounded-xl border transition-all outline-none ${
                    !selectedDeptId
                      ? 'border-slate-800 bg-slate-950/40 text-slate-600 cursor-not-allowed'
                      : isSuccess
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

            {/* Mensajes de carga o error */}
            <div className="min-h-[26px] flex items-center justify-center pt-1">
              {isVerifying && (
                <div className="flex items-center gap-2 text-xs font-semibold text-secondary animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verificando credenciales...</span>
                </div>
              )}
              {isSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>¡Acceso Autorizado! Cargando formulario...</span>
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

          {/* Botón de Ingreso */}
          <Button
            type="submit"
            disabled={isVerifying || isSuccess || !selectedDeptId || pinDigits.join('').length !== 6}
            className="w-full bg-secondary hover:bg-secondary/90 disabled:opacity-40 text-white font-bold text-sm py-2.5 rounded-xl transition-all shadow-lg shadow-secondary/20 flex items-center justify-center gap-2"
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Ingresando...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                Ingresar al Módulo
              </>
            )}
          </Button>
        </form>

        {/* Teclado numérico táctil / rápido */}
        <div className="grid grid-cols-3 gap-2 max-w-[280px] mx-auto pt-1">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((num) => (
            <button
              key={num}
              type="button"
              disabled={isVerifying || isSuccess || !selectedDeptId}
              onClick={() => handleKeyPadClick(num)}
              className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 border border-slate-700/80 text-base font-bold text-white transition-colors"
            >
              {num}
            </button>
          ))}
          <button
            type="button"
            disabled={isVerifying || isSuccess || !selectedDeptId}
            onClick={handleClear}
            className="h-10 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-xs font-semibold text-slate-400 hover:text-slate-200 border border-slate-800 transition-colors"
          >
            Borrar
          </button>
          <button
            type="button"
            disabled={isVerifying || isSuccess || !selectedDeptId}
            onClick={() => handleKeyPadClick('0')}
            className="h-10 rounded-lg bg-slate-800/80 hover:bg-slate-700 active:bg-slate-600 disabled:opacity-40 border border-slate-700/80 text-base font-bold text-white transition-colors"
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
            🔒 Administrado en la pestaña <strong className="text-white">Usuarios</strong> de la Hoja de Staging en Google Sheets.
          </p>
        </div>
      </div>
    </div>
  )
}
