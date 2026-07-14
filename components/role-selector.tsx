import Image from 'next/image'
import { Button } from '@/components/ui/button'

interface RoleSelectorProps {
  onSelectRole: (role: 'receptor' | 'emisor') => void
}

export default function RoleSelector({ onSelectRole }: RoleSelectorProps) {
  return (
    <div className="relative min-h-screen bg-muted px-6 py-12 overflow-hidden">
      {/* Logo top left - fixed positioning */}
      <div className="fixed top-4 left-4 z-10 pointer-events-none opacity-90">
        <Image
          src="/faces_logo_light.png"
          alt="FaCES UCV"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
        />
      </div>

      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* Title */}
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-bold text-primary">Sistema de Reportes</h1>
          <p className="mt-3 text-muted-foreground">Facultad de Ciencias Económicas y Sociales</p>
        </div>

        {/* Role Selection */}
        <div className="grid gap-8 md:grid-cols-2 w-full max-w-4xl">
          {/* Receptor Card */}
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <svg className="h-8 w-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8m0 8l-6-4m6 4l6-4" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Receptor</h2>
              <p className="mt-2 text-muted-foreground">Recibe y gestiona reportes de otros departamentos</p>
            </div>
            <Button
              onClick={() => onSelectRole('receptor')}
              className="mt-auto bg-primary hover:bg-primary/90 text-white"
            >
              Seleccionar Receptor
            </Button>
          </div>

          {/* Emisor Card */}
          <div className="flex flex-col gap-6 rounded-lg border border-border bg-card p-8 shadow-sm transition-all hover:shadow-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-secondary/10">
              <svg className="h-8 w-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-secondary">Emisor</h2>
              <p className="mt-2 text-muted-foreground">Envía reportes a otros departamentos</p>
            </div>
            <Button
              onClick={() => onSelectRole('emisor')}
              className="mt-auto bg-secondary hover:bg-secondary/90 text-white"
            >
              Seleccionar Emisor
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
