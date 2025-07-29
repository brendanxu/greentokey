'use client'

import { motion } from 'framer-motion'
import { Award, Activity, TrendingUp, Shield } from 'lucide-react'

const features = [
  {
    icon: Award,
    title: 'National Standard',
    description: 'Quality assured by methodologies jointly issued by China\'s Ministry of Ecology and Environment and other authoritative departments.',
  },
  {
    icon: Activity,
    title: 'Data-Driven & Verifiable',
    description: 'Mandatory IoT real-time monitoring and data on-chain ensure every emission reduction is authentic and credible.',
  },
  {
    icon: TrendingUp,
    title: 'High Impact',
    description: 'Methane reduction is one of the most efficient ways to combat climate change, with significant ESG impact.',
  },
  {
    icon: Shield,
    title: 'Market-Based Value',
    description: 'Asset values reference China\'s national carbon market (CEA) price benchmarks with transparent market pricing.',
  },
]

export default function AssetFocus() {
  return (
    <section id="why-ccer" className="section-padding">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            A Superior Class of Green Asset
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto">
            China&apos;s CCER represents the gold standard in verifiable carbon reduction assets
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="flex items-start space-x-4"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-text-secondary">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-background-secondary to-background-tertiary rounded-2xl p-8 md:p-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-4">
                Methane Reduction: The Climate Game-Changer
              </h3>
              <p className="text-text-secondary mb-6">
                Our focus on low-concentration gas emission reduction projects targets one of the most potent greenhouse gases. 
                With methane having 84x the warming potential of CO2 over 20 years, these projects deliver immediate and measurable climate impact.
              </p>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Real-time monitoring via IoT sensors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Blockchain-verified emission data</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="text-sm">Third-party audited results</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold gradient-text mb-2">84x</div>
                  <p className="text-text-secondary">More potent than CO2</p>
                  <p className="text-sm text-text-tertiary mt-1">Over 20 years</p>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-accent/10 rounded-full blur-3xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}