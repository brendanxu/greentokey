import { LucideIcon } from 'lucide-react'

// ===== 基础类型 =====
export interface BaseComponent {
  id: string
  className?: string
}

export interface WithChildren {
  children: React.ReactNode
}

export interface WithAnimation {
  animate?: boolean
  delay?: number
}

// ===== 内容相关类型 =====
export interface ContentItem {
  id: string
  title: string
  description: string
}

export interface CTAButton {
  text: string
  href: string
  variant?: 'primary' | 'secondary'
  icon?: LucideIcon
}

// ===== 导航相关类型 =====
export interface NavItem {
  name: string
  href: string
  external?: boolean
}

export interface SocialLink {
  name: string
  href: string
  icon: LucideIcon
}

// ===== Hero Section Types =====
export interface HeroContent {
  badge?: {
    text: string
    icon?: LucideIcon
  }
  headline: string
  subheadline: string
  description: string
  cta: {
    primary: CTAButton
    secondary: CTAButton
  }
  stats: Array<{
    value: string
    label: string
  }>
}

// ===== Partners Types =====
export interface Partner {
  id: string
  name: string
  logo: string
  description?: string
}

export interface PartnerSection {
  title: string
  description: string
  partners: Partner[]
  highlights: Array<{
    icon: string
    title: string
    description: string
  }>
}

// ===== Solution Types =====
export interface SolutionCard {
  id: string
  icon: LucideIcon
  title: string
  description: string
  gradient: string
}

export interface SolutionSection {
  title: string
  description: string
  solutions: SolutionCard[]
  cta?: {
    title: string
    description: string
    button: CTAButton
  }
}

// ===== Process Types =====
export interface ProcessStep {
  number: string
  title: string
  description: string
  icon: LucideIcon
}

export interface ProcessSection {
  title: string
  description: string
  steps: ProcessStep[]
  features: Array<{
    title: string
    items: string[]
  }>
}

// ===== Asset Focus Types =====
export interface AssetFeature {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export interface AssetFocusSection {
  title: string
  description: string
  features: AssetFeature[]
  spotlight: {
    title: string
    description: string
    stats: {
      value: string
      label: string
      sublabel?: string
    }
    benefits: string[]
  }
}

// ===== Service Types =====
export interface ServiceOffering {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
  features: string[]
  cta: CTAButton
  gradient: string
}

export interface ServiceSection {
  title: string
  description: string
  offerings: ServiceOffering[]
}

// ===== Why Choose Us Types =====
export interface Reason {
  id: string
  icon: LucideIcon
  title: string
  description: string
}

export interface WhyChooseUsSection {
  title: string
  description: string
  reasons: Reason[]
  cta: {
    title: string
    description: string
    buttons: CTAButton[]
  }
  stats: Array<{
    label: string
    value: string
  }>
}

// ===== Footer Types =====
export interface FooterLink {
  name: string
  href: string
}

export interface FooterSection {
  title: string
  links: FooterLink[]
}

export interface ContactInfo {
  type: 'address' | 'email' | 'phone'
  icon: LucideIcon
  content: string
  href?: string
}

export interface LegalDisclaimer {
  title: string
  content: string[]
}

export interface FooterContent {
  company: {
    name: string
    description: string
    social: SocialLink[]
  }
  sections: FooterSection[]
  contact: ContactInfo[]
  legal: {
    disclaimers: LegalDisclaimer[]
    links: FooterLink[]
    copyright: string
  }
}

// ===== Site Configuration Types =====
export interface SiteConfig {
  name: string
  description: string
  url: string
  keywords: string[]
  author: string
  social: {
    twitter: string
    linkedin: string
  }
}

// ===== Theme Types =====
export interface ThemeColors {
  background: {
    DEFAULT: string
    secondary: string
    tertiary: string
  }
  primary: {
    DEFAULT: string
    dark: string
    light: string
  }
  accent: {
    DEFAULT: string
    dark: string
    light: string
  }
  text: {
    primary: string
    secondary: string
    tertiary: string
  }
  border: {
    DEFAULT: string
    light: string
  }
}

// ===== API Types =====
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface ContactFormData {
  name: string
  email: string
  company?: string
  message: string
  type: 'investor' | 'asset_owner' | 'general'
}

// ===== Error Types =====
export interface AppError {
  code: string
  message: string
  details?: unknown
}

export interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

// ===== Utility Types =====
export type Variant = 'primary' | 'secondary' | 'tertiary'
export type Size = 'sm' | 'md' | 'lg' | 'xl'
export type Status = 'idle' | 'loading' | 'success' | 'error'

// Re-export commonly used types
export type { LucideIcon } from 'lucide-react'