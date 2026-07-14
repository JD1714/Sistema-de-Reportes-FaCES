import Image from 'next/image'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="relative min-h-screen bg-muted px-6 py-12 overflow-hidden flex flex-col items-center justify-center">
      {/* Logo top left */}
      <div className="fixed top-4 left-4 z-10 pointer-events-none opacity-90">
        <Image
          src="/faces_logo_light.png"
          alt="FaCES UCV"
          width={64}
          height={64}
          className="w-16 h-16 object-contain"
          priority
        />
      </div>

      <div className="w-full max-w-4xl flex flex-col items-center">
        {/* Title Section */}
        <div className="mb-16 text-center">
          <span className="text-xs font-semibold uppercase tracking-widest text-secondary bg-secondary/10 px-3 py-1 rounded-full">
            Plataforma Institucional
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary mt-4 tracking-tight">
            Sistema de Reportes FaCES
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Automatización y consolidación de información académico-administrativa para la Facultad de Ciencias Económicas y Sociales (UCV).
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid gap-8 md:grid-cols-2 w-full">
          {/* Emisor Portal Card */}
          <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-secondary/10">
              <svg className="h-7 w-7 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Portal Emisor</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Permite a los departamentos autorizados registrar y enviar métricas de gestión mensual directo a la Zona de Staging.
              </p>
            </div>
            <Link
              href="/emisor"
              className="mt-auto inline-flex justify-center items-center px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/90 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Acceder como Emisor
            </Link>
          </div>

          {/* Receptor Portal Card */}
          <div className="flex flex-col gap-6 rounded-xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10">
              <svg className="h-7 w-7 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-primary">Portal Receptor (Revisor)</h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Área reservada para coordinadores. Permite auditar, aprobar o rechazar los reportes de la Zona de Staging antes de su consolidación en producción.
              </p>
            </div>
            <Link
              href="/receptor"
              className="mt-auto inline-flex justify-center items-center px-4 py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-semibold text-sm transition-all cursor-pointer shadow-sm hover:shadow"
            >
              Acceder como Revisor
            </Link>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-16 text-center text-xs text-muted-foreground">
          <p>Universidad Central de Venezuela — Facultad de Ciencias Económicas y Sociales</p>
        </div>
      </div>
    </div>
  )
}
