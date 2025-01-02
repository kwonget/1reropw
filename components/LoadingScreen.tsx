'use client'

import { motion } from 'framer-motion'

export default function LoadingScreen() {
  // Segments for the loading spinner (8 segments)
  const segments = Array.from({ length: 8 })
  
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center">
      <div className="relative w-24 h-24">
        {segments.map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 rounded-full"
            style={{
              left: '50%',
              top: '50%',
              transform: `rotate(${i * 45}deg) translate(40px, -50%)`,
            }}
            initial={{ opacity: 0.3 }}
            animate={{
              opacity: [0.3, 1, 0.3],
              filter: [
                'brightness(1) blur(0px)',
                'brightness(1.5) blur(2px)',
                'brightness(1) blur(0px)'
              ]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.1,
              ease: "easeInOut"
            }}
          >
            <div 
              className="w-full h-full rounded-full"
              style={{
                background: i < 6 ? 'rgb(255, 0, 127)' : 'rgb(0, 255, 255)',
                boxShadow: i < 6 
                  ? '0 0 15px rgb(255, 0, 127), 0 0 30px rgb(255, 0, 127)'
                  : '0 0 15px rgb(0, 255, 255), 0 0 30px rgb(0, 255, 255)'
              }}
            />
          </motion.div>
        ))}
      </div>
      <motion.div
        className="mt-12 text-[2rem] font-bold tracking-wider"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-600" 
              style={{
                textShadow: '0 0 10px rgba(255, 0, 127, 0.5)',
                WebkitTextStroke: '1px rgba(255, 0, 127, 0.1)'
              }}>
          CONNECTING.
        </span>
      </motion.div>
    </div>
  )
}

