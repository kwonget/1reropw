'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

interface HeaderProps {
  totalPrints: number
}

export default function Header({ totalPrints }: HeaderProps) {
  const [currentDateTime, setCurrentDateTime] = useState('')

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      const koreanTime = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }))
      const formattedDate = koreanTime.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      })
      setCurrentDateTime(formattedDate)
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <motion.header 
      className="relative flex flex-col md:flex-row justify-between items-center rounded-2xl overflow-hidden"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Glowing background effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-500/30 via-pink-500/30 to-purple-500/30 animate-pulse" style={{ animationDuration: '3s' }} />
      
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20" />
      
      <div className="relative py-6 px-8 flex-1">
        <h1 className="text-4xl font-bold text-white tracking-tight">LPK DATA</h1>
      </div>
      <div className="relative py-6 px-8 text-right">
        <motion.div 
          className="text-[28px] font-bold mb-3 bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent tracking-tight leading-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          {currentDateTime}
        </motion.div>
        <motion.div 
          className="text-lg text-red-400 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Total Count: {totalPrints.toLocaleString()}
        </motion.div>
      </div>
    </motion.header>
  )
}

