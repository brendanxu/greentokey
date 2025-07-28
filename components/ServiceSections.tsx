'use client'

import { motion } from 'framer-motion'
import { Users, Building2, CheckCircle, ArrowRight } from 'lucide-react'

export default function ServiceSections() {
  return (
    <section className="section-padding bg-background-secondary">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Who We Serve
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            Tailored solutions for different stakeholders in the green finance ecosystem
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-primary/5 to-transparent rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Users className="w-8 h-8 text-primary" />
              <h3 className="text-2xl font-bold">For ESG Investors</h3>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-text-primary">
              The Clear Path to Invest in China&apos;s Green Transition
            </h4>
            <p className="text-text-secondary mb-6">
              Access institutional-grade green assets with unprecedented transparency and liquidity. 
              Our platform connects global capital with China&apos;s most impactful carbon reduction projects.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Minimum investment from $100,000</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Real-time impact tracking dashboard</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Secondary market liquidity options</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <span className="text-sm">Quarterly ESG impact reports</span>
              </div>
            </div>
            <button className="btn-primary group">
              Schedule a Consultation
              <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-accent/5 to-transparent rounded-2xl p-8"
          >
            <div className="flex items-center space-x-3 mb-6">
              <Building2 className="w-8 h-8 text-accent" />
              <h3 className="text-2xl font-bold">For Asset Owners</h3>
            </div>
            <h4 className="text-xl font-semibold mb-4 text-text-primary">
              Unlock the Global Value of Your Green Assets
            </h4>
            <p className="text-text-secondary mb-6">
              Transform your carbon reduction projects into globally accessible investment opportunities. 
              Our platform provides the technology and compliance framework for seamless tokenization.
            </p>
            <div className="space-y-3 mb-8">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">End-to-end tokenization services</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">Legal and regulatory compliance</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">Global investor network access</span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-sm">Platform-as-a-Service options</span>
              </div>
            </div>
            <button className="btn-secondary group">
              Partner with Us
              <ArrowRight className="inline-block ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-text-secondary mb-4">
            Trusted by leading institutions worldwide
          </p>
          <div className="flex flex-wrap justify-center gap-8 items-center">
            {['Institution A', 'Fund B', 'Bank C', 'Investor D'].map((name, index) => (
              <div key={index} className="text-text-tertiary font-semibold">
                {name}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}