export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Navigation */}
      <nav className="bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">GreenLink Capital</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#home" className="text-gray-300 hover:text-white">Home</a>
              <a href="#solution" className="text-gray-300 hover:text-white">Solution</a>
              <a href="#about" className="text-gray-300 hover:text-white">About</a>
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section id="home" className="relative min-h-screen flex items-center justify-center">
          {/* Content */}
          <div className="text-center max-w-5xl mx-auto px-4">
            <div className="mb-6">
              <div className="inline-flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full px-4 py-2">
                <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                <span className="text-sm text-emerald-400">Leading the Green Finance Revolution</span>
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              The Institutional Gateway to Verifiable Green Assets
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
              We provide an end-to-end, compliant solution for tokenizing China&apos;s high-quality CCER assets, 
              connecting global ESG capital with measurable environmental impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-8 rounded-lg">
                Discover Our Solution
              </button>
              <button className="border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white font-semibold py-3 px-8 rounded-lg">
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
        <section className="py-24 bg-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose CCER Assets?</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                China&apos;s CCER represents the gold standard in verifiable carbon reduction assets
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">National Standard</h3>
                <p className="text-gray-400 text-sm">Quality assured by China&apos;s Ministry of Ecology</p>
              </div>
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Data-Driven</h3>
                <p className="text-gray-400 text-sm">IoT monitoring ensures authentic emission reductions</p>
              </div>
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">High Impact</h3>
                <p className="text-gray-400 text-sm">Methane reduction with significant ESG impact</p>
              </div>
              <div className="bg-slate-700 border border-slate-600 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-2">Market Value</h3>
                <p className="text-gray-400 text-sm">Referenced to China&apos;s national carbon market</p>
              </div>
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