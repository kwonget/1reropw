import { motion } from 'framer-motion';

const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full mix-blend-screen filter blur-lg"
          style={{
            background: `radial-gradient(circle, rgba(255,150,150,1) 0%, rgba(255,150,150,0) 70%)`,
            width: `${Math.random() * 300 + 100}px`,
            height: `${Math.random() * 300 + 100}px`,
          }}
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            opacity: 0.5 + Math.random() * 0.5,
          }}
          animate={{
            x: [null, Math.random() * window.innerWidth, Math.random() * window.innerWidth],
            y: [null, Math.random() * window.innerHeight, Math.random() * window.innerHeight],
            scale: [1, 1.2, 1],
            opacity: [null, 0.8, 0.5],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export default FloatingOrbs;

