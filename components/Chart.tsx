'use client'

import { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, ChartType } from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'
import { motion } from 'framer-motion'

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, ArcElement)

interface ChartProps {
  type: 'daily' | 'hourly' | 'users' | 'frame' | 'light'
  data: any[]
  className?: string
}

export default function Chart({ type, data, className = '' }: ChartProps) {
  // Removed specific chart type from ref to make it more generic
  const chartRef = useRef<any>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.update()
    }
  }, [data])

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.8)',
          font: {
            family: 'Inter, sans-serif',
            size: 13,
            weight: 500,
          },
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: 'rgba(255, 255, 255, 0.9)',
        bodyColor: 'rgba(255, 255, 255, 0.9)',
        borderColor: 'rgba(255, 255, 255, 0.1)',
        borderWidth: 1,
        padding: 12,
        bodySpacing: 4,
        titleSpacing: 8,
        titleFont: {
          size: 14,
          weight: 600,
        },
        bodyFont: {
          size: 13,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 8,
          font: {
            size: 12,
          },
        },
      },
      y: {
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          color: 'rgba(255, 255, 255, 0.8)',
          padding: 8,
          font: {
            size: 12,
          },
        },
      },
    },
  } as const

  const getChartConfig = () => {
    switch (type) {
      case 'daily':
      case 'hourly':
        return {
          type: Bar,
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: type === 'daily' ? 'Daily Transactions & Sessions' : 'Hourly Distribution',
                font: { size: 16, weight: 700 },
                color: 'rgba(255, 255, 255, 0.9)',
              },
            },
          },
          data: type === 'daily' ? {
            labels: data.map((d) => d.date),
            datasets: [
              {
                label: 'Sessions',
                data: data.map((d) => d.sessions),
                backgroundColor: 'rgba(128, 128, 128, 0.3)',
                borderColor: 'rgba(128, 128, 128, 0.5)',
                borderWidth: 1,
              },
              {
                label: 'Transactions',
                data: data.map((d) => d.transactions),
                backgroundColor: 'rgba(255, 0, 127, 0.8)',
                borderColor: 'rgba(255, 0, 127, 1)',
                borderWidth: 1,
              },
            ],
          } : {
            labels: data.map((d) => `${d.created_at}:00`),
            datasets: [{
              label: 'Transactions',
              data: data.map((d) => d.count),
              backgroundColor: 'rgba(0, 255, 255, 0.5)',
              borderColor: 'rgba(0, 255, 255, 1)',
              borderWidth: 1,
            }],
          },
        }
      case 'users':
        return {
          type: Line,
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Daily Users (Last 7 Days)',
                font: { size: 16, weight: 700 },
                color: 'rgba(255, 255, 255, 0.9)',
              },
            },
          },
          data: {
            labels: data.map((d) => d.Date),
            datasets: [
              {
                label: 'Gloframe',
                data: data.map((d) => d.Gloframe_Users),
                borderColor: 'rgba(255, 0, 127, 1)',
                backgroundColor: 'rgba(255, 0, 127, 0.1)',
                tension: 0.4,
              },
              {
                label: 'Infiniwalk',
                data: data.map((d) => d.Infiniwalk_Users),
                borderColor: 'rgba(0, 255, 255, 1)',
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                tension: 0.4,
              },
            ],
          },
        }
      case 'frame':
        return {
          type: Doughnut,
          options: {
            ...commonOptions,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Frame Type Distribution',
                font: { size: 16, weight: 700 },
                color: 'rgba(255, 255, 255, 0.9)',
              },
            },
            elements: {
              arc: {
                borderWidth: 0,
              },
            },
          },
          data: {
            labels: data.map((d) => d.type),
            datasets: [{
              data: data.map((d) => d.count),
              backgroundColor: [
                'rgba(255, 204, 0, 0.8)',
                'rgba(0, 255, 255, 0.8)',
                'rgba(255, 0, 127, 0.8)',
              ],
              borderColor: [
                'rgba(255, 204, 0, 1)',
                'rgba(0, 255, 255, 1)',
                'rgba(255, 0, 127, 1)',
              ],
              borderWidth: 1,
            }],
          },
        }
      case 'light':
        return {
          type: Bar,
          options: {
            ...commonOptions,
            indexAxis: 'y' as const,
            plugins: {
              ...commonOptions.plugins,
              title: {
                display: true,
                text: 'Light Type Ranking',
                font: { size: 16, weight: 700 },
                color: 'rgba(255, 255, 255, 0.9)',
              },
            },
          },
          data: {
            labels: data.map((d) => d.type),
            datasets: [{
              label: 'Selections',
              data: data.map((d) => d.count),
              backgroundColor: [
                'rgba(255, 215, 0, 0.8)',
                'rgba(192, 192, 192, 0.8)',
                'rgba(205, 127, 50, 0.8)',
                'rgba(128, 128, 128, 0.8)',
              ],
              borderColor: [
                'rgb(255, 215, 0)',
                'rgb(192, 192, 192)',
                'rgb(205, 127, 50)',
                'rgb(128, 128, 128)',
              ],
              borderWidth: 1,
            }],
          },
        }
      default:
        return null
    }
  }

  const chartConfig = getChartConfig()

  if (!data || data.length === 0) {
    return (
      <motion.div 
        className={`relative overflow-hidden rounded-2xl ${className}`}
      >
        <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
        <div className="relative p-6 md:p-8 flex items-center justify-center">
          <p className="text-white/50">No data available</p>
        </div>
      </motion.div>
    )
  }

  if (!chartConfig) return null

  const ChartComponent = chartConfig.type

  return (
    <motion.div 
      className={`relative overflow-hidden rounded-2xl ${className}`}
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
      
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-6 md:p-8" style={{ height: type === 'light' ? '400px' : '320px' }}>
        <ChartComponent ref={chartRef} options={chartConfig.options} data={chartConfig.data} />
      </div>
    </motion.div>
  )
}