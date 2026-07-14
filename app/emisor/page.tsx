'use client'

import { useRouter } from 'next/navigation'
import EmisorScreen from '@/components/emisor-screen'

export default function EmisorPage() {
  const router = useRouter()

  return (
    <EmisorScreen onBack={() => router.push('/')} />
  )
}
