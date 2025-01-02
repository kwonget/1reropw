import { Metadata } from 'next'
import Dashboard from '@/components/Dashboard'

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Real-time data visualization dashboard',
}

export default function Page() {
  return (
    <main className="min-h-screen w-full">
      <Dashboard />
    </main>
  )
}

