import { NextResponse } from 'next/server'
import * as cheerio from 'cheerio'

export const revalidate = 0 // 캐시를 비활성화하여 매번 새로운 데이터를 가져옴

export async function GET() {
  try {
    // 웹사이트에서 HTML 콘텐츠 가져오기
    const response = await fetch('https://fuse-4ad00.web.app/', {
      cache: 'no-store', // 캐시를 사용하지 않음
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const html = await response.text()
    const $ = cheerio.load(html)

    // 카드에서 데이터 추출
    const cards = $('.card')
    const summary = {
      totalTransactions: 0,
      totalPrints: 0,
      totalAmount: 0,
      avgAmount: 0,
      avgConversionRate: 0
    }

    cards.each((i, card) => {
      const title = $(card).find('.card-title').text().trim()
      const value = $(card).find('.card-value').text().trim()

      switch (title) {
        case 'Total Transactions':
          const transactionValues = value.split('(').map(v => parseInt(v.replace(/[^\d]/g, '')))
          if (transactionValues.length === 2 && !isNaN(transactionValues[0]) && !isNaN(transactionValues[1])) {
            summary.totalTransactions = transactionValues[0]
            summary.totalPrints = transactionValues[1]
          } else {
            console.error('Failed to parse Total Transactions:', value)
          }
          break
        case 'Total Amount':
          const totalAmount = parseInt(value.replace(/[^\d]/g, ''))
          if (!isNaN(totalAmount)) {
            summary.totalAmount = totalAmount
          } else {
            console.error('Failed to parse Total Amount:', value)
          }
          break
        case 'Average Amount':
          const avgAmount = parseInt(value.replace(/[^\d]/g, ''))
          if (!isNaN(avgAmount)) {
            summary.avgAmount = avgAmount
          } else {
            console.error('Failed to parse Average Amount:', value)
          }
          break
        case 'Conversion Rate':
          const conversionRate = parseFloat(value.replace('%', ''))
          if (!isNaN(conversionRate)) {
            summary.avgConversionRate = conversionRate
          } else {
            console.error('Failed to parse Conversion Rate:', value)
          }
          break
      }
    })

    // 총 프린트 수 추출
    const totalPrintsText = $('.total-prints').text()
    const totalPrintsMatch = totalPrintsText.match(/Total Count:\s*(\d+)/)
    const totalPrints = totalPrintsMatch ? parseInt(totalPrintsMatch[1]) : null

    // 차트 데이터 추출
    const scriptContent = $('script:not([src])').text()
    const chartDataMatch = scriptContent.match(/const chartData = ({[\s\S]*?});/)
    
    let chartData: { summary?: any } = {}
    if (chartDataMatch) {
      try {
        chartData = JSON.parse(chartDataMatch[1]) as { summary?: any }
        // summary 데이터 업데이트
        if (chartData.summary) {
          chartData.summary = {
            ...chartData.summary,
            ...summary
          }
        } else {
          chartData.summary = summary
        }
      } catch (error) {
        console.error('차트 데이터 파싱 에러:', error)
      }
    }

    return NextResponse.json({
      chartData: {
        ...chartData,
        summary: chartData.summary ? {
          ...chartData.summary,
          ...summary
        } : summary
      },
      totalPrints: totalPrints || summary.totalPrints,
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

