import React from 'react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GreenLink Capital</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white transition-colors">Home</a>
              <a href="#solution" className="text-gray-300 hover:text-white transition-colors">Solution</a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-16">
        <section id="home" className="relative min-h-screen flex items-center justify-center">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px]" />
          
          {/* Content */}
          <div className="relative z-10 text-center max-w-5xl mx-auto px-4">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm text-emerald-400">Leading the Green Finance Revolution</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              The Institutional Gateway to
              <br />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-500 to-blue-500 bg-clip-text text-transparent">
                Verifiable Green Assets
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              We provide an end-to-end, compliant solution for tokenizing China&apos;s high-quality CCER assets, 
              connecting global ESG capital with measurable environmental impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg transition-all transform hover:scale-105">
                Discover Our Solution →
              </button>
              <button className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold py-3 px-8 rounded-lg transition-all">
                Schedule Consultation
              </button>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '$100M+', label: 'Assets Under Management' },
                { value: '50+', label: 'Institutional Partners' },
                { value: '95%', label: 'Carbon Reduction Verified' },
                { value: '24/7', label: 'Real-time Monitoring' },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-500">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Simple Features Section */}
        <section className="py-24 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CCER Assets?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                China&apos;s CCER represents the gold standard in verifiable carbon reduction assets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'National Standard', desc: 'Quality assured by China&apos;s Ministry of Ecology' },
                { title: 'Data-Driven', desc: 'IoT monitoring ensures authentic emission reductions' },
                { title: 'High Impact', desc: 'Methane reduction with significant ESG impact' },
                { title: 'Market Value', desc: 'Referenced to China&apos;s national carbon market' },
              ].map((feature, index) => (
                <div key={index} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 hover:border-emerald-500/50 transition-colors">
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GreenLink Capital</span>
            </div>
            <p className="text-gray-400 mb-6">
              The institutional gateway to verifiable green assets
            </p>
            <p className="text-xs text-gray-600">
              © 2024 GreenLink Capital. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </div>
  )
}