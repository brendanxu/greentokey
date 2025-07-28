'use client'
import React, { useState } from 'react'

export default function HomePage() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* ADDX-inspired Navigation */}
      <nav className="bg-background border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-semibold text-text-primary">GreenLink Capital</span>
            </div>

            {/* Main Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {/* Solutions Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('solutions')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-menu hover:text-text-tertiary transition-colors px-4 py-2">
                  Solutions
                </button>
                {activeDropdown === 'solutions' && (
                  <div className="absolute top-full left-0 mt-2 w-96 nav-dropdown">
                    <div className="grid grid-cols-1 gap-1">
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">CCER Tokenization</h3>
                        <p className="text-sm text-text-secondary">Transform carbon credits into digital assets</p>
                      </div>
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">Green Asset Management</h3>
                        <p className="text-sm text-text-secondary">Professional portfolio management for ESG investments</p>
                      </div>
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">ESG Verification</h3>
                        <p className="text-sm text-text-secondary">Real-time monitoring and impact measurement</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Products Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setActiveDropdown('products')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="nav-menu hover:text-text-tertiary transition-colors px-4 py-2">
                  Products
                </button>
                {activeDropdown === 'products' && (
                  <div className="absolute top-full left-0 mt-2 w-96 nav-dropdown">
                    <div className="grid grid-cols-1 gap-1">
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">Green Bonds</h3>
                        <p className="text-sm text-text-secondary">Fixed-income securities for environmental projects</p>
                      </div>
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">Carbon Credits</h3>
                        <p className="text-sm text-text-secondary">Verified CCER from renewable energy projects</p>
                      </div>
                      <div className="menu-item">
                        <h3 className="font-medium text-text-primary mb-1">ESG Funds</h3>
                        <p className="text-sm text-text-secondary">Diversified sustainable investment portfolios</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About */}
              <a href="#about" className="nav-menu hover:text-text-tertiary transition-colors px-4 py-2">
                About
              </a>

              {/* CTA Buttons */}
              <div className="flex items-center space-x-3 ml-4">
                <button className="text-text-primary hover:text-text-tertiary transition-colors px-4 py-2">
                  Learn More
                </button>
                <button className="btn-primary">
                  Start Investing
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="text-text-primary hover:text-text-tertiary">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - ADDX-inspired */}
      <main className="bg-background">
        <section id="home" className="relative section-padding">
          <div className="container">
            <div className="max-w-6xl mx-auto">
              {/* Announcement Badge */}
              <div className="text-center mb-8">
                <div className="inline-flex items-center space-x-2 bg-accent/10 border border-accent/20 rounded-full px-4 py-2">
                  <span className="w-2 h-2 bg-accent rounded-full"></span>
                  <span className="text-sm text-accent font-medium">Leading the Green Finance Revolution</span>
                </div>
              </div>
              
              {/* Main Heading */}
              <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading text-text-primary mb-6 leading-tight">
                  The Institutional Gateway to
                  <br />
                  <span className="gradient-text">Verifiable Green Assets</span>
                </h1>
                
                <p className="text-lg md:text-xl text-text-secondary max-w-4xl mx-auto mb-10 leading-relaxed">
                  We provide an end-to-end, compliant solution for tokenizing China&apos;s high-quality CCER assets, 
                  connecting global ESG capital with measurable environmental impact.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="btn-primary text-base py-3 px-8">
                    Discover Our Solution
                  </button>
                  <button className="btn-secondary text-base py-3 px-8">
                    Schedule Consultation
                  </button>
                </div>
              </div>
            
              {/* Stats Grid - ADDX inspired */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    ¥50B+
                  </div>
                  <div className="text-sm text-text-secondary">
                    CCER Assets Under Management
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    100+
                  </div>
                  <div className="text-sm text-text-secondary">
                    Institutional Partners
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    99.5%
                  </div>
                  <div className="text-sm text-text-secondary">
                    Carbon Reduction Verified
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-accent mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-text-secondary">
                    Real-time Monitoring
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - ADDX inspired */}
        <section className="section-padding bg-background-secondary">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading text-text-primary mb-6">
                Why Choose CCER Assets?
              </h2>
              <p className="text-lg text-text-secondary max-w-3xl mx-auto">
                China&apos;s CCER represents the gold standard in verifiable carbon reduction assets, 
                providing institutional investors with transparent, measurable environmental impact.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">National Standard</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Quality assured by China&apos;s Ministry of Ecology and Environment with rigorous verification protocols
                </p>
              </div>
              
              <div className="card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Data-Driven</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  IoT monitoring and blockchain verification ensure authentic emission reductions with real-time data
                </p>
              </div>
              
              <div className="card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">High Impact</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Focus on methane reduction projects with measurable environmental and financial returns
                </p>
              </div>
              
              <div className="card">
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-3">Market Value</h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Pricing referenced to China&apos;s national ETS with transparent market mechanisms
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Footer - ADDX inspired */}
        <footer className="bg-background border-t border-border py-16">
          <div className="container">
            <div className="text-center">
              {/* Logo */}
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">G</span>
                </div>
                <span className="text-2xl font-semibold text-text-primary">GreenLink Capital</span>
              </div>
              
              {/* Description */}
              <p className="text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
                The institutional gateway to verifiable green assets. We&apos;re transforming how global capital 
                accesses China&apos;s premium environmental impact opportunities through advanced tokenization technology.
              </p>
              
              {/* Links */}
              <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm">
                <a href="#solutions" className="text-text-secondary hover:text-text-primary transition-colors">
                  Solutions
                </a>
                <a href="#products" className="text-text-secondary hover:text-text-primary transition-colors">
                  Products
                </a>
                <a href="#about" className="text-text-secondary hover:text-text-primary transition-colors">
                  About Us
                </a>
                <a href="#contact" className="text-text-secondary hover:text-text-primary transition-colors">
                  Contact
                </a>
                <a href="#legal" className="text-text-secondary hover:text-text-primary transition-colors">
                  Legal
                </a>
              </div>
              
              {/* Copyright */}
              <div className="pt-8 border-t border-border">
                <p className="text-text-tertiary text-sm">
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