import Navbar from '@/components/layout/Navbar'
import HeroSection from '@/components/sections/HeroSection'
// Import other sections as they are refactored
import Partners from '@/components/Partners'
import Solution from '@/components/Solution'
import Process from '@/components/Process'
import AssetFocus from '@/components/AssetFocus'
import ServiceSections from '@/components/ServiceSections'
import WhyChooseUs from '@/components/WhyChooseUs'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <HeroSection />
        <Partners />
        <Solution />
        <Process />
        <AssetFocus />
        <ServiceSections />
        <WhyChooseUs />
      </main>
      <Footer />
    </>
  )
}