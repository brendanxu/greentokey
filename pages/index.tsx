'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Header } from '../components/layout/Header'
import Hero from '../components/Hero'
import AssetFocus from '../components/AssetFocus'
import Solution from '../components/Solution'
import DataShowcase from '../components/DataShowcase'
import Process from '../components/Process'
import WhyChooseUs from '../components/WhyChooseUs'
import Partners from '../components/Partners'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      <Header />
      
      <main>
        <Hero />
        <AssetFocus />
        <DataShowcase />
        <Solution />
        <Process />
        <WhyChooseUs />
        <Partners />
      </main>
      
      <Footer />
    </div>
  )
}