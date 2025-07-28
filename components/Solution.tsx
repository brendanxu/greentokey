'use client'

import { motion } from 'framer-motion'
import { Shield, Eye, Scale, Zap } from 'lucide-react'

const solutions = [
  {
    icon: Shield,
    title: 'Access Premium Assets',
    description: 'Invest in high-quality, high-integrity CCER assets based on the latest national methodologies.',
    gradient: 'from-primary to-primary-dark',
  },
  {
    icon: Eye,
    title: 'Ensure Verifiable Impact',
    description: 'Leverage IoT + blockchain technology for end-to-end data transparency, eliminating greenwashing risks.',
    gradient: 'from-accent to-accent-dark',
  },
  {
    icon: Scale,
    title: 'Navigate with Compliance',
    description: 'Utilize our "assets onshore, securities offshore" legal framework to navigate complex cross-border regulations.',
    gradient: 'from-primary to-accent',
  },
  {
    icon: Zap,
    title: 'Unlock Enhanced Liquidity',
    description: 'Transform traditionally illiquid green assets through tokenization and compliant secondary markets.',
    gradient: 'from-accent-dark to-primary',
  },
]

export default function Solution() {
  return (
    <section id="solution" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bridging Green Finance and Digital Innovation
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Our comprehensive solution addresses the key challenges in green asset tokenization
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card group hover:shadow-xl hover:shadow-primary/5 cursor-pointer"
            >
              <div className="flex items-start space-x-4">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${solution.gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                  <solution.icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {solution.title}
                  </h3>
                  <p className="text-text-secondary leading-relaxed">
                    {solution.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl p-8 text-center"
        >
          <h3 className="text-2xl font-semibold mb-4">
            Ready to Transform Your Green Investment Strategy?
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Join leading institutions in accessing verified, high-impact green assets through our cutting-edge platform
          </p>
          <button className="btn-primary">
            Explore Investment Opportunities
          </button>
        </motion.div>
      </div>
    </section>
  )
}