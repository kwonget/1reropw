'use client'

import { useEffect, useState, useCallback } from 'react'
import { initializeApp } from 'firebase/app'
import { getDatabase, ref, onValue } from 'firebase/database'
import Header from './Header'
import StatusCard from './StatusCard'
import Chart from './Chart'
import PrinterStatus from './PrinterStatus'
import LoadingScreen from './LoadingScreen'
import FloatingOrbs from './FloatingOrbs'
import ErrorBoundary from './ErrorBoundary'
import { firebaseConfig } from '@/config/firebase'

interface DashboardData {
  chartData: {
    dailyData: any[]
    hourlyData: any[]
    frameData: any[]
    lightData: any[]
    usersData: any[]
    summary: {
      totalTransactions: number
      totalAmount: number
      avgAmount: number
      avgConversionRate: number
      totalPrints: number
    }
  }
  totalPrints: number
  lastUpdate: string
}

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [printerStatus, setPrinterStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = useCallback(async () => {
    try {
      console.log('Fetching dashboard data...')
      const response = await fetch('/api/dashboard-data')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
      }

      if (data.error) {
        throw new Error(data.error)
      }

      console.log('Dashboard data received:', data)
      setDashboardData(data)
      setError(null)
      setRetryCount(0)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      setError(error instanceof Error ? error.message : 'An unknown error occurred')
      
      if (retryCount < 3) {
        setRetryCount(prev => prev + 1)
        setTimeout(fetchData, 5000)
      }
    }
  }, [retryCount])

  useEffect(() => {
    try {
      const app = initializeApp(firebaseConfig)
      const db = getDatabase(app)
      const printerRef = ref(db, 'printers/DS620')
      
      const unsubscribe = onValue(printerRef, (snapshot) => {
        setPrinterStatus(snapshot.val())
      }, (error) => {
        console.error('Error fetching printer status:', error)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error('Error initializing Firebase:', error)
    }
  }, [])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    const initializeDashboard = async () => {
      await fetchData()
      setIsLoading(false)
    }

    initializeDashboard()

    intervalId = setInterval(fetchData, 10000)

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [fetchData])

  if (isLoading) {
    return <LoadingScreen />
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-4">
          <div className="text-red-500 text-2xl font-bold tracking-wider">
            {error}
          </div>
          <button
            onClick={() => {
              setRetryCount(0)
              setError(null)
              fetchData()
            }}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (!dashboardData?.chartData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-red-500 text-2xl font-bold animate-pulse tracking-wider">
          No data available
        </div>
      </div>
    )
  }

  const { chartData } = dashboardData

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-black text-white px-4 py-6 md:p-8 overflow-x-hidden relative">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-red-500/20 to-transparent animate-pulse" 
             style={{ animationDuration: '3s' }} />
        <FloatingOrbs />

        <div className="max-w-[1440px] mx-auto space-y-6 md:space-y-8 relative">
          <Header totalPrints={dashboardData.totalPrints} />
          <PrinterStatus status={printerStatus} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            <StatusCard 
              title="Total Transactions" 
              value={`${chartData.summary.totalTransactions} (${chartData.summary.totalPrints})`} 
            />
            <StatusCard 
              title="Total Amount" 
              value={`₩${chartData.summary.totalAmount.toLocaleString()}`} 
            />
            <StatusCard 
              title="Average Amount" 
              value={`₩${chartData.summary.avgAmount.toLocaleString()}`} 
            />
            <StatusCard 
              title="Conversion Rate" 
              value={`${chartData.summary.avgConversionRate.toFixed(1)}%`} 
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <Chart type="daily" data={chartData.dailyData} />
            <Chart type="hourly" data={chartData.hourlyData} />
            <Chart type="users" data={chartData.usersData} />
            <Chart type="frame" data={chartData.frameData} />
            <Chart type="light" data={chartData.lightData} className="lg:col-span-2" />
          </div>

          <div className="text-center text-sm text-gray-400">
            Last updated: {new Date(dashboardData.lastUpdate).toLocaleString()}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  )
}

