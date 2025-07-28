import { 
  HeroContent, 
  PartnerSection, 
  SolutionSection, 
  ProcessSection, 
  AssetFocusSection,
  ServiceSection,
  WhyChooseUsSection 
} from '../types'
import { 
  ArrowRight, 
  Leaf, 
  Shield, 
  Eye, 
  Scale, 
  Zap,
  Search,
  FileCheck,
  Globe,
  BarChart3,
  Award,
  Activity,
  TrendingUp,
  Users,
  Building2,
  CheckCircle,
  Cpu,
  Target
} from 'lucide-react'

export const heroContent: HeroContent = {
  badge: {
    text: 'Leading the Green Finance Revolution',
    icon: Leaf
  },
  headline: 'The Institutional Gateway to Verifiable Green Assets',
  subheadline: 'Verifiable Green Assets',
  description: 'We provide an end-to-end, compliant solution for tokenizing China\'s high-quality CCER assets, connecting global ESG capital with measurable environmental impact.',
  cta: {
    primary: {
      text: 'Discover Our Solution',
      href: '#solution',
      icon: ArrowRight
    },
    secondary: {
      text: 'Schedule a Consultation',
      href: '#contact'
    }
  },
  stats: [
    { value: '$100M+', label: 'Assets Under Management' },
    { value: '50+', label: 'Institutional Partners' },
    { value: '95%', label: 'Carbon Reduction Verified' },
    { value: '24/7', label: 'Real-time Monitoring' },
  ]
}

export const partnersContent: PartnerSection = {
  title: 'A Trusted Ecosystem for Green Asset Tokenization',
  description: 'Partnering with industry leaders to build the future of sustainable finance',
  partners: [
    { id: '1', name: 'Ant Digital', logo: 'AD' },
    { id: '2', name: 'HKMA Project Ensemble', logo: 'HKMA' },
    { id: '3', name: 'Leading HK STO Legal Advisor', logo: 'Legal' },
    { id: '4', name: 'China CCER Projects', logo: 'CCER' },
  ],
  highlights: [
    {
      icon: '🔗',
      title: 'Technology Core',
      description: 'Powered by Ant Digital\'s blockchain infrastructure'
    },
    {
      icon: '⚖️',
      title: 'Regulatory Framework',
      description: 'Aligned with HKMA\'s Project Ensemble standards'
    },
    {
      icon: '🌱',
      title: 'Asset Quality',
      description: 'Premium CCER assets verified by national standards'
    }
  ]
}

export const solutionContent: SolutionSection = {
  title: 'Bridging Green Finance and Digital Innovation',
  description: 'Our comprehensive solution addresses the key challenges in green asset tokenization',
  solutions: [
    {
      id: 'premium-assets',
      icon: Shield,
      title: 'Access Premium Assets',
      description: 'Invest in high-quality, high-integrity CCER assets based on the latest national methodologies.',
      gradient: 'from-primary to-primary-dark',
    },
    {
      id: 'verifiable-impact',
      icon: Eye,
      title: 'Ensure Verifiable Impact',
      description: 'Leverage IoT + blockchain technology for end-to-end data transparency, eliminating greenwashing risks.',
      gradient: 'from-accent to-accent-dark',
    },
    {
      id: 'compliance',
      icon: Scale,
      title: 'Navigate with Compliance',
      description: 'Utilize our "assets onshore, securities offshore" legal framework to navigate complex cross-border regulations.',
      gradient: 'from-primary to-accent',
    },
    {
      id: 'liquidity',
      icon: Zap,
      title: 'Unlock Enhanced Liquidity',
      description: 'Transform traditionally illiquid green assets through tokenization and compliant secondary markets.',
      gradient: 'from-accent-dark to-primary',
    },
  ],
  cta: {
    title: 'Ready to Transform Your Green Investment Strategy?',
    description: 'Join leading institutions in accessing verified, high-impact green assets through our cutting-edge platform',
    button: {
      text: 'Explore Investment Opportunities',
      href: '#contact'
    }
  }
}

export const processContent: ProcessSection = {
  title: 'Our End-to-End Tokenization Process',
  description: 'A streamlined approach to bringing verified green assets to global markets',
  steps: [
    {
      number: '01',
      title: 'Asset Screening & Due Diligence',
      description: 'We identify and verify top-tier low-concentration gas emission reduction projects that comply with the latest national CCER methodologies.',
      icon: Search,
    },
    {
      number: '02',
      title: 'Structuring & Tokenization',
      description: 'We design offshore SPV legal structures and utilize our "dual-chain bridge" technical architecture for compliant tokenization in Hong Kong.',
      icon: FileCheck,
    },
    {
      number: '03',
      title: 'Global Distribution',
      description: 'Through licensed Hong Kong financial institutions, we conduct primary offerings to qualified global ESG investors.',
      icon: Globe,
    },
    {
      number: '04',
      title: 'Lifecycle Management',
      description: 'We provide continuous, transparent asset performance reporting and facilitate secondary market liquidity.',
      icon: BarChart3,
    },
  ],
  features: [
    {
      title: 'Technology Infrastructure',
      items: [
        'Dual-chain architecture with cross-chain bridge',
        'Real-time IoT data integration',
        'Immutable blockchain verification'
      ]
    },
    {
      title: 'Compliance Framework',
      items: [
        'Hong Kong SFC regulatory compliance',
        'International securities law adherence',
        'Cross-border data protection standards'
      ]
    }
  ]
}

export const assetFocusContent: AssetFocusSection = {
  title: 'A Superior Class of Green Asset',
  description: 'China\'s CCER represents the gold standard in verifiable carbon reduction assets',
  features: [
    {
      id: 'national-standard',
      icon: Award,
      title: 'National Standard',
      description: 'Quality assured by methodologies jointly issued by China\'s Ministry of Ecology and Environment and other authoritative departments.',
    },
    {
      id: 'data-driven',
      icon: Activity,
      title: 'Data-Driven & Verifiable',
      description: 'Mandatory IoT real-time monitoring and data on-chain ensure every emission reduction is authentic and credible.',
    },
    {
      id: 'high-impact',
      icon: TrendingUp,
      title: 'High Impact',
      description: 'Methane reduction is one of the most efficient ways to combat climate change, with significant ESG impact.',
    },
    {
      id: 'market-value',
      icon: Shield,
      title: 'Market-Based Value',
      description: 'Asset values reference China\'s national carbon market (CEA) price benchmarks with transparent market pricing.',
    },
  ],
  spotlight: {
    title: 'Methane Reduction: The Climate Game-Changer',
    description: 'Our focus on low-concentration gas emission reduction projects targets one of the most potent greenhouse gases. With methane having 84x the warming potential of CO2 over 20 years, these projects deliver immediate and measurable climate impact.',
    stats: {
      value: '84x',
      label: 'More potent than CO2',
      sublabel: 'Over 20 years'
    },
    benefits: [
      'Real-time monitoring via IoT sensors',
      'Blockchain-verified emission data',
      'Third-party audited results'
    ]
  }
}

export const serviceContent: ServiceSection = {
  title: 'Who We Serve',
  description: 'Tailored solutions for different stakeholders in the green finance ecosystem',
  offerings: [
    {
      icon: Users,
      title: 'For ESG Investors',
      subtitle: 'The Clear Path to Invest in China\'s Green Transition',
      description: 'Access institutional-grade green assets with unprecedented transparency and liquidity. Our platform connects global capital with China\'s most impactful carbon reduction projects.',
      features: [
        'Minimum investment from $100,000',
        'Real-time impact tracking dashboard',
        'Secondary market liquidity options',
        'Quarterly ESG impact reports'
      ],
      cta: {
        text: 'Schedule a Consultation',
        href: '#contact',
        icon: ArrowRight
      },
      gradient: 'from-primary/5 to-transparent'
    },
    {
      icon: Building2,
      title: 'For Asset Owners',
      subtitle: 'Unlock the Global Value of Your Green Assets',
      description: 'Transform your carbon reduction projects into globally accessible investment opportunities. Our platform provides the technology and compliance framework for seamless tokenization.',
      features: [
        'End-to-end tokenization services',
        'Legal and regulatory compliance',
        'Global investor network access',
        'Platform-as-a-Service options'
      ],
      cta: {
        text: 'Partner with Us',
        href: '#contact',
        variant: 'secondary' as const,
        icon: ArrowRight
      },
      gradient: 'from-accent/5 to-transparent'
    }
  ]
}

export const whyChooseUsContent: WhyChooseUsSection = {
  title: 'Built on Trust, Expertise, and Technology',
  description: 'Why leading institutions choose GreenLink Capital for their green asset investments',
  reasons: [
    {
      id: 'partnership',
      icon: Cpu,
      title: 'Strategic Partnership with Ant Digital',
      description: 'Leverage cutting-edge blockchain infrastructure and ecosystem advantages from one of the world\'s leading fintech innovators.',
    },
    {
      id: 'compliance',
      icon: Shield,
      title: 'Deep Compliance & Legal Expertise',
      description: 'Our core competency in cross-border STO and data compliance ensures seamless navigation of complex regulatory landscapes.',
    },
    {
      id: 'focus',
      icon: Target,
      title: 'Unparalleled Industry Focus',
      description: 'As CCER specialists, we bring deep domain expertise and established relationships in China\'s carbon reduction ecosystem.',
    },
  ],
  cta: {
    title: 'Ready to Join the Green Finance Revolution?',
    description: 'Whether you\'re an investor seeking verified green assets or an asset owner looking to unlock global capital, we\'re here to help you succeed.',
    buttons: [
      {
        text: 'Start Your Journey',
        href: '#contact'
      },
      {
        text: 'Download Whitepaper',
        href: '#whitepaper',
        variant: 'secondary' as const
      }
    ]
  },
  stats: [
    { label: 'Years of Experience', value: '10+' },
    { label: 'Regulatory Approvals', value: '5' },
    { label: 'Team Members', value: '50+' },
    { label: 'Countries Served', value: '15' },
  ]
}