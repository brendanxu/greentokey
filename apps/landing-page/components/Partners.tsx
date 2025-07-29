'use client'

import { motion } from 'framer-motion'

const partners = [
  { name: 'Ant Digital', logo: 'AD' },
  { name: 'HKMA Project Ensemble', logo: 'HKMA' },
  { name: 'Leading HK STO Legal Advisor', logo: 'Legal' },
  { name: 'China CCER Projects', logo: 'CCER' },
]

export default function Partners() {
  return (
    <section className="section-padding bg-background-secondary border-y border-border">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Trusted Ecosystem for Green Asset Tokenization
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Partnering with industry leaders to build the future of sustainable finance
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-32 h-32 bg-background border border-border rounded-lg flex items-center justify-center mb-4 hover:border-primary transition-colors duration-300">
                <span className="text-2xl font-bold text-text-tertiary">
                  {partner.logo}
                </span>
              </div>
              <h3 className="text-sm text-text-secondary text-center">
                {partner.name}
              </h3>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🔗</span>
            </div>
            <h4 className="font-semibold mb-2">Technology Core</h4>
            <p className="text-sm text-text-secondary">
              Powered by Ant Digital&apos;s blockchain infrastructure
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">⚖️</span>
            </div>
            <h4 className="font-semibold mb-2">Regulatory Framework</h4>
            <p className="text-sm text-text-secondary">
              Aligned with HKMA&apos;s Project Ensemble standards
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary text-2xl">🌱</span>
            </div>
            <h4 className="font-semibold mb-2">Asset Quality</h4>
            <p className="text-sm text-text-secondary">
              Premium CCER assets verified by national standards
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}