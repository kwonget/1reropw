import { NextResponse } from 'next/server'

export const revalidate = 0

interface DashboardData {
  chartData: {
    dailyData: Array<{
      date: string
      transactions: number
      sessions: number
      conversion_rate: number
    }>
    hourlyData: Array<{
      created_at: number
      count: number
    }>
    frameData: Array<{
      type: string
      count: number
    }>
    lightData: Array<{
      type: string
      count: number
    }>
    usersData: Array<{
      Date: string
      Gloframe_Users: number
      Infiniwalk_Users: number
      Total_Users: number
    }>
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

export async function GET() {
  try {
    // Instead of parsing HTML, we'll fetch JSON directly
    const response = await fetch('https://fuse-4ad00.web.app/api/dashboard', {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data: DashboardData = await response.json()

    return NextResponse.json({
      chartData: data.chartData,
      totalPrints: data.totalPrints,
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    console.error('대시보드 데이터 가져오기 에러:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : '알 수 없는 에러가 발생했습니다',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

