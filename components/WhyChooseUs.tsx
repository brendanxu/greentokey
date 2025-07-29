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
          className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-2xl p-8 text-center border border-primary/10"
        >
          <h3 className="text-2xl font-bold mb-4">
            Trusted by Leading Institutions
          </h3>
          <p className="text-text-secondary mb-6 max-w-2xl mx-auto">
            Join forward-thinking financial institutions already leveraging our platform for verified green asset exposure.
          </p>
          <button className="btn-secondary">
            Schedule a Consultation
          </button>
        </motion.div>

      </div>
    </section>
  )
}