'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Section } from '@/components/ui/Section'
import { heroContent } from '@/data/content/sections'
import { heroTitle, heroSubtitle, heroDescription, heroCTA } from '@/lib/utils/animations'

// Background particles component
const ParticleBackground = () => (
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
)

// Scroll indicator component
const ScrollIndicator = () => (
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
)

// Stats component
interface StatItemProps {
  stat: { value: string; label: string }
  index: number
}

const StatItem = ({ stat, index }: StatItemProps) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 1 + index * 0.1 }}
    className="space-y-2 text-center"
  >
    <div className="text-2xl md:text-3xl font-bold text-primary">
      {stat.value}
    </div>
    <div className="text-sm text-text-tertiary">
      {stat.label}
    </div>
  </motion.div>
)

export default function HeroSection() {
  const { badge, headline, subheadline, description, cta, stats } = heroContent

  return (
    <Section
      id="home"
      spacing="none"
      background="default"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      containerProps={{ size: 'lg' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-hero-gradient" />
      
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-radial-gradient" />
      </div>

      <ParticleBackground />

      {/* Main content */}
      <div className="relative z-10 text-center">
        {/* Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="flex items-center space-x-2 bg-primary/10 border border-primary/30 rounded-full px-4 py-2">
              {badge.icon && <badge.icon className="w-4 h-4 text-primary" />}
              <span className="text-sm text-primary">{badge.text}</span>
            </div>
          </motion.div>
        )}

        {/* Main headline */}
        <motion.h1
          variants={heroTitle}
          initial="hidden"
          animate="visible"
          className="text-hero-mobile md:text-hero font-bold mb-6 text-text-primary"
        >
          {headline}
          <br />
          <span className="gradient-text">{subheadline}</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={heroDescription}
          initial="hidden"
          animate="visible"
          className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto mb-10"
        >
          {description}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={heroCTA}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            asChild
            size="lg"
            rightIcon={cta.primary.icon}
            className="group"
          >
            <Link href={cta.primary.href}>
              {cta.primary.text}
            </Link>
          </Button>
          <Button
            asChild
            variant="secondary"
            size="lg"
          >
            <Link href={cta.secondary.href}>
              {cta.secondary.text}
            </Link>
          </Button>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <StatItem key={index} stat={stat} index={index} />
          ))}
        </div>
      </div>

      <ScrollIndicator />
    </Section>
  )
}