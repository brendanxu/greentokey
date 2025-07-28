'use client'

import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { useScroll } from '@/lib/hooks/useScroll'
import { useMobileMenu } from '@/lib/hooks/useMobileMenu'
import { navigation, company } from '@/data/config/site'
import { navSlideDown, mobileMenuSlide } from '@/lib/utils/animations'
import { cn } from '@/lib/utils'

// Logo Component
const Logo = () => (
  <Link href="/" className="flex items-center space-x-2">
    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
      <span className="text-white font-bold text-lg">G</span>
    </div>
    <span className="text-xl font-bold text-text-primary">
      {company.name}
    </span>
  </Link>
)

// Desktop Navigation
const DesktopNav = () => (
  <div className="hidden md:flex items-center space-x-8">
    {navigation.main.map((item) => (
      <Link
        key={item.name}
        href={item.href}
        className="text-text-secondary hover:text-text-primary transition-colors duration-200"
      >
        {item.name}
      </Link>
    ))}
    <Button size="sm">
      Get Started
    </Button>
  </div>
)

// Mobile Menu Toggle
interface MobileMenuToggleProps {
  isOpen: boolean
  onToggle: () => void
}

const MobileMenuToggle = ({ isOpen, onToggle }: MobileMenuToggleProps) => (
  <button
    onClick={onToggle}
    className="md:hidden text-text-primary p-2 -m-2"
    aria-label="Toggle mobile menu"
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
)

// Mobile Menu
interface MobileMenuProps {
  isOpen: boolean
  onClose: () => void
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        variants={mobileMenuSlide}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="md:hidden bg-background-secondary border-b border-border"
      >
        <Container padding="sm">
          <div className="py-4 space-y-2">
            {navigation.main.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 text-text-secondary hover:text-text-primary transition-colors duration-200"
                onClick={onClose}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-2">
              <Button fullWidth size="sm">
                Get Started
              </Button>
            </div>
          </div>
        </Container>
      </motion.div>
    )}
  </AnimatePresence>
)

export default function Navbar() {
  const { isScrolled } = useScroll(20)
  const { isOpen, toggle, close } = useMobileMenu()

  return (
    <motion.nav
      variants={navSlideDown}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        isScrolled
          ? 'bg-background/80 backdrop-blur-lg border-b border-border'
          : 'bg-transparent'
      )}
    >
      <Container>
        <div className="flex items-center justify-between h-16">
          <Logo />
          <DesktopNav />
          <MobileMenuToggle isOpen={isOpen} onToggle={toggle} />
        </div>
      </Container>
      
      <MobileMenu isOpen={isOpen} onClose={close} />
    </motion.nav>
  )
}