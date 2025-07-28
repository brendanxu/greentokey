'use client'
import React from 'react'
import { motion } from 'framer-motion'
import { 
  CheckCircleIcon, 
  ChartBarIcon, 
  BoltIcon, 
  CurrencyDollarIcon,
  HeartIcon,
  ShieldCheckIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline'
import { Header } from '../components/layout/Header'
import { Button } from '../components/ui/Button'
import { FeatureCard, TestimonialCard } from '../components/ui/Card'

export default function HomePage() {
  const features = [
    {
      icon: <CheckCircleIcon className="w-6 h-6" />,
      title: 'National Standard',
      description: 'Quality assured by China\'s Ministry of Ecology and Environment with rigorous verification protocols'
    },
    {
      icon: <ChartBarIcon className="w-6 h-6" />,
      title: 'Data-Driven',
      description: 'IoT monitoring and blockchain verification ensure authentic emission reductions with real-time data'
    },
    {
      icon: <BoltIcon className="w-6 h-6" />,
      title: 'High Impact',
      description: 'Focus on methane reduction projects with measurable environmental and financial returns'
    },
    {
      icon: <CurrencyDollarIcon className="w-6 h-6" />,
      title: 'Market Value',
      description: 'Pricing referenced to China\'s national ETS with transparent market mechanisms'
    }
  ]

  const testimonials = [
    {
      quote: "GreenLink Capital has revolutionized our approach to ESG investing. Their CCER tokenization platform provides unprecedented transparency and liquidity in the green finance space.",
      author: {
        name: "Sarah Chen",
        title: "Chief Investment Officer, Asia Green Fund",
        avatar: "/api/placeholder/48/48"
      }
    },
    {
      quote: "The real-time verification and blockchain-based transparency gives us confidence in the environmental impact of our investments. This is the future of sustainable finance.",
      author: {
        name: "Michael Zhang",
        title: "ESG Portfolio Manager, China Asset Management",
        avatar: "/api/placeholder/48/48"
      }
    },
    {
      quote: "Working with GreenLink has allowed us to access premium CCER assets with institutional-grade due diligence. The platform's efficiency is remarkable.",
      author: {
        name: "Lisa Wang",
        title: "Managing Director, Sustainable Capital Partners",
        avatar: "/api/placeholder/48/48"
      }
    }
  ]

  const stats = [
    { value: '¥50B+', label: 'CCER Assets Under Management' },
    { value: '100+', label: 'Institutional Partners' },
    { value: '99.5%', label: 'Carbon Reduction Verified' },
    { value: '24/7', label: 'Real-time Monitoring' }
  ]

  const trustFeatures = [
    {
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      title: 'Regulatory Compliance',
      description: 'Fully licensed and regulated by China\'s financial authorities'
    },
    {
      icon: <BuildingOfficeIcon className="w-8 h-8" />,
      title: 'Institutional Grade',
      description: 'Professional custody and asset management services'
    },
    {
      icon: <HeartIcon className="w-8 h-8" />,
      title: 'Impact Verified',
      description: 'Third-party verification of environmental impact metrics'
    }
  ]

  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />

      {/* Hero Section - ADDX 规格 */}
      <main>
        <section className="section-spacing">
          <div className="container">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Announcement Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 bg-green-primary/10 border border-green-primary/20 rounded-full px-4 py-2 mb-8"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <span className="w-2 h-2 bg-green-primary rounded-full"></span>
                <span className="text-caption-desktop text-green-primary font-medium">
                  Leading the Green Finance Revolution
                </span>
              </motion.div>
              
              {/* Hero Heading */}
              <motion.h1 
                className="text-hero mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                The Institutional Gateway to
                <br />
                <span className="gradient-green">Verifiable Green Assets</span>
              </motion.h1>
              
              <motion.p 
                className="text-lead max-w-4xl mx-auto mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                We provide an end-to-end, compliant solution for tokenizing China&apos;s high-quality CCER assets, 
                connecting global ESG capital with measurable environmental impact.
              </motion.p>
              
              {/* CTA Buttons */}
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <Button variant="green-primary" size="lg">
                  Discover Our Solution
                </Button>
                <Button variant="secondary" size="lg">
                  Schedule Consultation
                </Button>
              </motion.div>

              {/* Stats Grid */}
              <motion.div 
                className="grid grid-cols-2 md:grid-cols-4 gap-8"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                {stats.map((stat, index) => (
                  <motion.div 
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="text-h2-mobile md:text-h2-desktop font-bold text-green-primary mb-2">
                      {stat.value}
                    </div>
                    <div className="text-caption-desktop text-text-secondary">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="section-spacing bg-bg-subtle">
          <div className="container">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h2-mobile md:text-h2-desktop mb-6">
                Why Choose CCER Assets?
              </h2>
              <p className="text-lead max-w-3xl mx-auto">
                China&apos;s CCER represents the gold standard in verifiable carbon reduction assets, 
                providing institutional investors with transparent, measurable environmental impact.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <FeatureCard {...feature} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Section */}
        <section className="section-spacing">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-h2-mobile md:text-h2-desktop mb-6">
                  A Trusted Platform
                </h2>
                <p className="text-lead mb-8">
                  Built with institutional-grade security and compliance standards, 
                  our platform ensures the highest level of trust and transparency 
                  in green finance operations.
                </p>
                <div className="space-y-6">
                  {trustFeatures.map((feature, index) => (
                    <motion.div 
                      key={feature.title}
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <div className="text-green-primary flex-shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-h4-mobile font-semibold text-text-primary mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-body-md text-text-secondary">
                          {feature.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-br from-green-primary/20 to-green-dark/20 rounded-2xl p-8 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-green-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ShieldCheckIcon className="w-12 h-12 text-green-primary" />
                    </div>
                    <p className="text-h3-mobile font-semibold text-text-primary">
                      Institutional Grade Security
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section-spacing bg-bg-subtle">
          <div className="container">
            <motion.div 
              className="text-center mb-16"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h2-mobile md:text-h2-desktop mb-6">
                Trusted by Industry Leaders
              </h2>
              <p className="text-lead max-w-3xl mx-auto">
                Join hundreds of institutional investors who rely on our platform 
                for transparent, compliant access to China&apos;s premium green assets.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={testimonial.author.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <TestimonialCard {...testimonial} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-spacing">
          <div className="container">
            <motion.div 
              className="text-center bg-gradient-to-r from-green-primary/5 to-green-dark/5 rounded-2xl p-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-h2-mobile md:text-h2-desktop mb-6">
                Ready to Transform Your ESG Portfolio?
              </h2>
              <p className="text-lead max-w-2xl mx-auto mb-8">
                Join the institutional gateway to China&apos;s verified green assets. 
                Experience transparency, compliance, and impact at scale.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="green-primary" size="lg">
                  Start Your Journey
                </Button>
                <Button variant="secondary" size="lg">
                  Schedule Demo
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-text-primary text-text-on-dark">
          <div className="container">
            <div className="section-spacing">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-green-primary rounded-lg flex items-center justify-center">
                      <span className="text-text-on-dark font-bold text-xl">G</span>
                    </div>
                    <span className="text-2xl font-bold">GreenLink Capital</span>
                  </div>
                  <p className="text-body-md text-text-on-dark/80 max-w-md leading-relaxed">
                    The institutional gateway to verifiable green assets. 
                    Transforming global access to China&apos;s premium environmental 
                    impact opportunities through advanced tokenization.
                  </p>
                </div>
                
                <div>
                  <h3 className="text-h4-mobile font-semibold mb-4">Solutions</h3>
                  <div className="space-y-2">
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      CCER Tokenization
                    </a>
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      ESG Verification
                    </a>
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      Asset Management
                    </a>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-h4-mobile font-semibold mb-4">Company</h3>
                  <div className="space-y-2">
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      About Us
                    </a>
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      Contact
                    </a>
                    <a href="#" className="block text-body-md text-text-on-dark/80 hover:text-green-primary transition-colors">
                      Legal
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-text-on-dark/20 pt-8 mt-8 text-center">
                <p className="text-caption-desktop text-text-on-dark/60">
                  © 2024 GreenLink Capital. All rights reserved. | Licensed by relevant financial authorities.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}