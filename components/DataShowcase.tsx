'use client'

import { motion } from 'framer-motion'
import DataCard from './ui/DataCard'

export default function DataShowcase() {
  const marketData = [
    {
      title: 'Total Market Value',
      value: 127500000,
      prefix: '$',
      change: 12.5,
      trend: 'up' as const,
      description: 'Year-over-year growth'
    },
    {
      title: 'Carbon Credits Issued',
      value: '2.4M',
      suffix: 'tCO₂e',
      change: 8.3,
      trend: 'up' as const,
      description: 'Verified emission reductions'
    },
    {
      title: 'Active Projects',
      value: 156,
      change: -2.1,
      trend: 'down' as const,
      description: 'Methane reduction facilities'
    },
    {
      title: 'Verification Rate',
      value: '98.7',
      suffix: '%',
      change: 0.5,
      trend: 'up' as const,
      description: 'Third-party audited'
    }
  ]

  return (
    <section className="section-padding bg-background-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-h2 font-bold mb-4">
            Real-Time Market Intelligence
          </h2>
          <p className="text-lead max-w-3xl mx-auto">
            Track verified green asset performance with institutional-grade data
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {marketData.map((data, index) => (
            <DataCard
              key={data.title}
              {...data}
              className="transform hover:scale-105 transition-transform duration-300"
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="inline-flex items-center space-x-8 p-8 bg-white rounded-2xl shadow-sm">
            <div>
              <div className="stat-hero-number text-primary">84x</div>
              <div className="stat-label mt-2">Methane Impact</div>
            </div>
            <div className="w-px h-20 bg-border"></div>
            <div className="text-left max-w-xs">
              <h4 className="text-h5 font-semibold mb-2">Climate Multiplier Effect</h4>
              <p className="text-body-sm text-text-secondary">
                Methane has 84 times the warming potential of CO₂ over 20 years, 
                making our projects exceptionally impactful.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}