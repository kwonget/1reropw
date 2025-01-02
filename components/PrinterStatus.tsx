'use client'

import { useEffect, useState } from 'react'
import { motion, useAnimation } from 'framer-motion'

interface PrinterStatusProps {
  status: {
    status: string
    remaining_prints: number
    last_check: number
  } | null
}

export default function PrinterStatus({ status }: PrinterStatusProps) {
  const [isOffline, setIsOffline] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const controls = useAnimation()

  const formatTimeDifference = (milliseconds: number) => {
    const seconds = Math.floor(milliseconds / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  useEffect(() => {
    if (status) {
      const checkOffline = () => {
        const now = Date.now()
        const timeSinceLastCheck = now - status.last_check
        setIsOffline(timeSinceLastCheck > 30000) // 30 seconds threshold
      }

      checkOffline()
      const timer = setInterval(checkOffline, 1000)

      return () => clearInterval(timer)
    }
  }, [status])

  useEffect(() => {
    if (isOffline || (status && status.remaining_prints < 30)) {
      controls.start({
        x: [0, -5, 5, -5, 5, 0],
        transition: { duration: 0.5, repeat: Infinity, repeatDelay: 1 }
      })
    } else {
      controls.stop()
    }
  }, [isOffline, status, controls])

  if (!status) return null

  const statusText = isOffline ? "OFFLINE ❌" : (status.status === "true" ? "NORMAL ✨" : "ERROR 💥")
  const statusColor = isOffline || status.status !== "true" ? "text-red-500" : "text-green-400"

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl"
      whileHover={{ scale: 1.01 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      animate={controls}
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-6 tracking-tight">Printer Status</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400 mb-1">Status</p>
            <p className={`text-xl font-bold ${statusColor}`}>{statusText}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400 mb-1">Remaining Prints</p>
            <p className="text-xl font-bold">{status.remaining_prints}</p>
          </div>
        </div>
        {isOffline && (
          <p className="mt-4 text-sm text-gray-400">
            Last checked: {formatTimeDifference(Date.now() - status.last_check)}
          </p>
        )}
      </div>
    </motion.div>
  )
}

