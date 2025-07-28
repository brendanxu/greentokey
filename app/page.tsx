import { Suspense } from 'react'
import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
import { ErrorBoundary } from '@/components/ui'

// Lazy import legacy components with error boundaries
import Partners from '@/components/Partners'
import Solution from '@/components/Solution'
import Process from '@/components/Process'
import AssetFocus from '@/components/AssetFocus'
import ServiceSections from '@/components/ServiceSections'
import WhyChooseUs from '@/components/WhyChooseUs'
import Footer from '@/components/Footer'

// Loading component
function LoadingSection() {
  return (
    <div className="section-padding">
      <div className="container">
        <div className="flex justify-center items-center h-32">
          <div className="text-text-secondary">Loading...</div>
        </div>
      </div>
    </div>
  )
}

// Section wrapper with error boundary
function SafeSection({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSection />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  )
}

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <HeroSection />
        
        <SafeSection>
          <Partners />
        </SafeSection>
        
        <SafeSection>
          <Solution />
        </SafeSection>
        
        <SafeSection>
          <Process />
        </SafeSection>
        
        <SafeSection>
          <AssetFocus />
        </SafeSection>
        
        <SafeSection>
          <ServiceSections />
        </SafeSection>
        
        <SafeSection>
          <WhyChooseUs />
        </SafeSection>
      </main>
      
      <SafeSection>
        <Footer />
      </SafeSection>
    </>
  )
}