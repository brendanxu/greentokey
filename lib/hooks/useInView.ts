import { useEffect, useRef, useState } from 'react'

interface UseInViewOptions {
  threshold?: number
  root?: Element | null
  rootMargin?: string
  triggerOnce?: boolean
}

export function useInView(options: UseInViewOptions = {}) {
  const [isInView, setIsInView] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const ref = useRef<HTMLElement>(null)

  const {
    threshold = 0.1,
    root = null,
    rootMargin = '0px',
    triggerOnce = true,
  } = options

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // If already triggered and triggerOnce is true, don't create observer
    if (hasTriggered && triggerOnce) {
      setIsInView(false)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting
        setIsInView(inView)
        
        if (inView && triggerOnce) {
          setHasTriggered(true)
        }
      },
      {
        threshold,
        root,
        rootMargin,
      }
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [threshold, root, rootMargin, triggerOnce, hasTriggered])

  return { ref, isInView, hasTriggered }
}