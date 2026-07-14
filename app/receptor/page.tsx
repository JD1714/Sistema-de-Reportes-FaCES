'use client'

import { useRouter } from 'next/navigation'
import ReceptorScreen from '@/components/receptor-screen'

export default function ReceptorPage() {
  const router = useRouter()

  return (
    <ReceptorScreen onBack={() => router.push('/')} />
  )
}
