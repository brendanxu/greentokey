'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Leaf } from 'lucide-react'
import Link from 'next/link'

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient" />
      </div>

      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
            <Leaf className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">Leading the Green Finance Revolution</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-hero-mobile md:text-hero font-bold mb-6 text-text-primary"
        >
          The Institutional Gateway to
          <br />
          <span className="gradient-text">Verifiable Green Assets</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10"
        >
          We provide an end-to-end, compliant solution for tokenizing China&apos;s high-quality CCER assets, 
          connecting global ESG capital with measurable environmental impact.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="#solution" className="btn-primary group">
            Discover Our Solution
            <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="#contact" className="btn-secondary">
            Schedule a Consultation
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-primary/10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '$100M+', label: 'Assets Under Management', icon: '💰' },
              { value: '50+', label: 'Institutional Partners', icon: '🤝' },
              { value: '95%', label: 'Carbon Reduction Verified', icon: '✅' },
              { value: '24/7', label: 'Real-time Monitoring', icon: '📊' },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-2xl mb-2">{stat.icon}</div>
                <div className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-text-secondary font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-text-tertiary rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 15, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-text-tertiary rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}