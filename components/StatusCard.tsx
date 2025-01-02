'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface StatusCardProps {
  title: string
  value: string | number
}

export default function StatusCard({ title, value }: StatusCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div 
      className="relative overflow-hidden rounded-2xl"
      whileHover={{ scale: 1.02 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10" />
      
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-transparent rounded-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />

      <div className="relative p-6 md:p-8">
        <h3 className="text-base font-medium mb-3 text-white/80 tracking-wide">{title}</h3>
        <motion.p 
          className="text-2xl md:text-[26px] font-bold bg-gradient-to-r from-red-500 to-red-300 bg-clip-text text-transparent tracking-tight leading-none"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.p>
      </div>
    </motion.div>
  )
}

