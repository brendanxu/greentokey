import { Variants } from 'framer-motion'
import { ANIMATION } from '../constants'

// Common animation variants
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: ANIMATION.durations.slow / 1000 }
  }
}

export const slideInUp: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: ANIMATION.durations.slow / 1000,
      ease: "easeOut"
    }
  }
}

// Container variants for staggered animations
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: ANIMATION.delays.stagger / 1000,
      delayChildren: 0.1,
    }
  }
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION.durations.slow / 1000,
      ease: "easeOut"
    }
  }
}

// Hero section specific animations
export const heroTitle: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
}

export const heroSubtitle: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.2,
      ease: "easeOut"
    }
  }
}

export const heroDescription: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.4,
      ease: "easeOut"
    }
  }
}

export const heroCTA: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      delay: 0.6,
      ease: "easeOut"
    }
  }
}

// Card hover animations
export const cardHover: Variants = {
  rest: { scale: 1, y: 0 },
  hover: { 
    scale: 1.02, 
    y: -4,
    transition: {
      duration: ANIMATION.durations.normal / 1000,
      ease: "easeOut"
    }
  }
}

// Button animations
export const buttonTap: Variants = {
  tap: { scale: 0.95 }
}

// Floating animation for background elements
export const float: Variants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
}

export const floatDelay: Variants = {
  animate: {
    y: [0, -15, 0],
    transition: {
      duration: 5,
      repeat: Infinity,
      ease: "easeInOut",
      delay: 2
    }
  }
}

// Navigation animations
export const navSlideDown: Variants = {
  hidden: { y: -100 },
  visible: { 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
}

export const mobileMenuSlide: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: ANIMATION.durations.normal / 1000 }
  },
  exit: { 
    opacity: 0, 
    y: -20, 
    transition: { duration: ANIMATION.durations.fast / 1000 }
  }
}

// Utility functions for creating custom animations
export const createStaggerVariants = (staggerDelay: number = 0.1) => ({
  hidden: {},
  visible: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren: 0.1,
    }
  }
})

export const createFadeInVariants = (
  direction: 'up' | 'down' | 'left' | 'right' | 'none' = 'up',
  distance: number = 20,
  duration: number = 0.5,
  delay: number = 0
) => {
  const getOffset = () => {
    switch (direction) {
      case 'up': return { y: distance }
      case 'down': return { y: -distance }
      case 'left': return { x: distance }
      case 'right': return { x: -distance }
      default: return {}
    }
  }

  return {
    hidden: { opacity: 0, ...getOffset() },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration, delay, ease: "easeOut" }
    }
  }
}