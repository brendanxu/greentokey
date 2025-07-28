'use client'

import { motion } from 'framer-motion'
import { Cpu, Shield, Target } from 'lucide-react'

const reasons = [
  {
    icon: Cpu,
    title: 'Strategic Partnership with Ant Digital',
    description: 'Leverage cutting-edge blockchain infrastructure and ecosystem advantages from one of the world\'s leading fintech innovators.',
  },
  {
    icon: Shield,
    title: 'Deep Compliance & Legal Expertise',
    description: 'Our core competency in cross-border STO and data compliance ensures seamless navigation of complex regulatory landscapes.',
  },
  {
    icon: Target,
    title: 'Unparalleled Industry Focus',
    description: 'As CCER specialists, we bring deep domain expertise and established relationships in China\'s carbon reduction ecosystem.',
  },
]

export default function WhyChooseUs() {
  return (
    <section id="about" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Built on Trust, Expertise, and Technology
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Why leading institutions choose GreenLink Capital for their green asset investments
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <reason.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3">
                {reason.title}
              </h3>
              <p className="text-text-secondary">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-12 text-center"
        >
          <h3 className="text-3xl font-bold mb-6">
            Ready to Join the Green Finance Revolution?
          </h3>
          <p className="text-lg text-text-secondary mb-8 max-w-2xl mx-auto">
            Whether you&apos;re an investor seeking verified green assets or an asset owner looking to unlock global capital, 
            we&apos;re here to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-primary">
              Start Your Journey
            </button>
            <button className="btn-secondary">
              Download Whitepaper
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
        >
          {[
            { label: 'Years of Experience', value: '10+' },
            { label: 'Regulatory Approvals', value: '5' },
            { label: 'Team Members', value: '50+' },
            { label: 'Countries Served', value: '15' },
          ].map((stat, index) => (
            <div key={index}>
              <div className="text-3xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-text-tertiary">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}