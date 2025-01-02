import { NextResponse } from 'next/server'
import { chartData as mockData } from '@/lib/dashboardData'

export const revalidate = 0

export async function GET() {
  try {
    // First try to fetch from the actual API
    const response = await fetch('https://fuse-4ad00.web.app/api/dashboard', {
      cache: 'no-store',
      headers: {
        'Accept': 'application/json',
      }
    })

    if (!response.ok) {
      // If the API fails, use mock data
      return NextResponse.json({
        chartData: mockData,
        totalPrints: mockData.summary.totalPrints,
        lastUpdate: new Date().toISOString()
      })
    }

    const data = await response.json()
    return NextResponse.json({
      chartData: data.chartData,
      totalPrints: data.totalPrints,
      lastUpdate: new Date().toISOString()
    })

  } catch (error) {
    // If there's an error, fall back to mock data
    return NextResponse.json({
      chartData: mockData,
      totalPrints: mockData.summary.totalPrints,
      lastUpdate: new Date().toISOString()
    })
  }
}

