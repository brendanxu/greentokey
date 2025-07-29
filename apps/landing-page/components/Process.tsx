'use client'

import { motion } from 'framer-motion'
import { Search, FileCheck, Globe, BarChart3 } from 'lucide-react'

const steps = [
  {
    number: '01',
    title: 'Asset Screening & Due Diligence',
    description: 'We identify and verify top-tier low-concentration gas emission reduction projects that comply with the latest national CCER methodologies.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Structuring & Tokenization',
    description: 'We design offshore SPV legal structures and utilize our "dual-chain bridge" technical architecture for compliant tokenization in Hong Kong.',
    icon: FileCheck,
  },
  {
    number: '03',
    title: 'Global Distribution',
    description: 'Through licensed Hong Kong financial institutions, we conduct primary offerings to qualified global ESG investors.',
    icon: Globe,
  },
  {
    number: '04',
    title: 'Lifecycle Management',
    description: 'We provide continuous, transparent asset performance reporting and facilitate secondary market liquidity.',
    icon: BarChart3,
  },
]

export default function Process() {
  return (
    <section id="process" className="section-padding bg-background-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our End-to-End Tokenization Process
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            A streamlined approach to bringing verified green assets to global markets
          </p>
        </motion.div>

        <div className="relative">
          <div className="hidden md:block absolute top-24 left-0 right-0 h-0.5 bg-border">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-flex">
                    <div className="w-20 h-20 bg-background border-2 border-primary rounded-full flex items-center justify-center mb-4">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 text-primary font-bold text-xl">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-3">
                    {step.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="card">
            <h4 className="text-xl font-semibold mb-3 text-primary">
              Technology Infrastructure
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Dual-chain architecture with cross-chain bridge
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Real-time IoT data integration
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Immutable blockchain verification
              </li>
            </ul>
          </div>
          <div className="card">
            <h4 className="text-xl font-semibold mb-3 text-primary">
              Compliance Framework
            </h4>
            <ul className="space-y-2 text-text-secondary">
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Hong Kong SFC regulatory compliance
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                International securities law adherence
              </li>
              <li className="flex items-start">
                <span className="text-primary mr-2">•</span>
                Cross-border data protection standards
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}