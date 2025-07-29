'use client'
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/Button'

// 导航链接类型定义
interface NavLink {
  label: string
  href?: string
  dropdown?: DropdownItem[]
}

interface DropdownItem {
  title: string
  description: string
  href: string
  icon?: React.ReactNode
}

// ADDX 风格的导航下拉菜单
const NavDropdown: React.FC<{
  items: DropdownItem[]
  isOpen: boolean
}> = ({ items, isOpen }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="absolute top-full left-0 mt-2 w-96 nav-dropdown"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid gap-1">
            {items.map((item, index) => (
              <motion.a
                key={item.title}
                href={item.href}
                className="block p-4 rounded-lg hover:bg-bg-subtle transition-colors group"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="flex items-start space-x-3">
                  {item.icon && (
                    <div className="w-6 h-6 text-primary-blue flex-shrink-0 mt-0.5">
                      {item.icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-h4-mobile font-semibold text-text-primary group-hover:text-primary-blue transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-caption-mobile text-text-secondary mt-1">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// 导航链接下划线动画组件
const NavLinkUnderline: React.FC<{
  isActive: boolean
  layoutId: string
}> = ({ isActive, layoutId }) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          layoutId={layoutId}
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-blue"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          exit={{ scaleX: 0 }}
          transition={{ 
            duration: 0.25, 
            ease: [0.25, 0.46, 0.45, 0.94] 
          }}
        />
      )}
    </AnimatePresence>
  )
}

// 主导航栏组件
export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)
  const { scrollY } = useScroll()

  // 监听滚动位置
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50)
  })

  // 绿色金融导航数据
  const navLinks: NavLink[] = [
    {
      label: 'Solutions',
      dropdown: [
        {
          title: 'CCER Tokenization',
          description: 'Transform China\'s carbon credits into tradeable digital assets',
          href: '/solutions/tokenization',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
            </svg>
          )
        },
        {
          title: 'ESG Verification',
          description: 'Real-time monitoring and impact measurement for green assets',
          href: '/solutions/verification',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        },
        {
          title: 'Green Asset Management',
          description: 'Professional portfolio management for sustainable investments',
          href: '/solutions/management',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          )
        }
      ]
    },
    {
      label: 'Products',
      dropdown: [
        {
          title: 'CCER Credits',
          description: 'Verified emission reduction credits from renewable energy projects',
          href: '/products/ccer',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          )
        },
        {
          title: 'Green Bonds',
          description: 'Fixed-income securities financing environmental projects',
          href: '/products/bonds',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          )
        },
        {
          title: 'ESG Funds',
          description: 'Diversified sustainable investment portfolios',
          href: '/products/funds',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          )
        }
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ]

  return (
    <motion.header
      className={`nav-header ${isScrolled ? 'scrolled' : ''}`}
      animate={{
        backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
      }}
      transition={{ duration: 0.3 }}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-10 h-10 bg-green-primary rounded-lg flex items-center justify-center">
              <span className="text-text-on-dark font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-text-primary">
              GreenLink Capital
            </span>
          </motion.div>

          {/* 桌面导航 */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => {
                  if (link.dropdown) setActiveDropdown(link.label)
                  setHoveredLink(link.label)
                }}
                onMouseLeave={() => {
                  setActiveDropdown(null)
                  setHoveredLink(null)
                }}
              >
                <motion.a
                  href={link.href || '#'}
                  className="relative flex items-center space-x-1 py-2 px-3 text-link font-medium text-text-secondary hover:text-primary-blue transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                >
                  <span>{link.label}</span>
                  {link.dropdown && (
                    <ChevronDownIcon 
                      className={`w-4 h-4 transition-transform duration-200 ${
                        activeDropdown === link.label ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                  <NavLinkUnderline 
                    isActive={hoveredLink === link.label}
                    layoutId="navUnderline"
                  />
                </motion.a>

                {link.dropdown && (
                  <NavDropdown 
                    items={link.dropdown}
                    isOpen={activeDropdown === link.label}
                  />
                )}
              </div>
            ))}
          </nav>

          {/* CTA 按钮 */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="tertiary" size="sm">
              Learn More
            </Button>
            <Button variant="green-primary" size="sm">
              Start Investing
            </Button>
          </div>

          {/* 移动端菜单按钮 */}
          <button 
            className="md:hidden p-2 text-text-primary hover:text-primary-blue transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-blue"
            aria-label="Open mobile menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </motion.header>
  )
}

export default Header