import { SiteConfig } from '../types'

export const siteConfig: SiteConfig = {
  name: 'GreenLink Capital',
  description: 'The Institutional Gateway to Verifiable Green Assets. We provide an end-to-end, compliant solution for tokenizing China\'s high-quality CCER assets.',
  url: 'https://greenlinkCapital.com',
  keywords: [
    'CCER',
    'RWA',
    'tokenization',
    'green assets',
    'ESG',
    'blockchain',
    'carbon credits',
    'China',
    'green finance',
    'sustainable investing'
  ],
  author: 'GreenLink Capital',
  social: {
    twitter: '@greenlinkCapital',
    linkedin: 'company/greenlink-capital'
  }
}

export const navigation = {
  main: [
    { name: 'Home', href: '#home' },
    { name: 'Solution', href: '#solution' },
    { name: 'Process', href: '#process' },
    { name: 'Why CCER', href: '#why-ccer' },
    { name: 'About', href: '#about' },
  ],
  footer: {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Team', href: '#team' },
      { name: 'Careers', href: '#careers' },
      { name: 'News & Press', href: '#news' },
    ],
    solutions: [
      { name: 'For Investors', href: '#investors' },
      { name: 'For Asset Owners', href: '#owners' },
      { name: 'Technology', href: '#technology' },
      { name: 'Compliance', href: '#compliance' },
    ],
    resources: [
      { name: 'Whitepaper', href: '#whitepaper' },
      { name: 'Documentation', href: '#docs' },
      { name: 'FAQ', href: '#faq' },
      { name: 'Contact Us', href: '#contact' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '#privacy' },
      { name: 'Terms of Service', href: '#terms' },
      { name: 'Cookie Policy', href: '#cookies' },
    ]
  }
}

export const company = {
  name: 'GreenLink Capital',
  tagline: 'The Institutional Gateway to Verifiable Green Assets',
  description: 'The institutional gateway to verifiable green assets, bridging sustainable finance with blockchain innovation.',
  contact: {
    address: 'Central, Hong Kong SAR',
    email: 'contact@greenlinkCapital.com',
    phone: '+852 1234 5678'
  },
  social: [
    { name: 'LinkedIn', href: '#', platform: 'linkedin' },
    { name: 'Twitter', href: '#', platform: 'twitter' },
    { name: 'Website', href: '#', platform: 'website' },
  ]
}

export const legal = {
  copyright: '© 2024 GreenLink Capital. All rights reserved.',
  disclaimers: [
    {
      title: 'Important Legal Disclaimer',
      content: [
        'This website and its contents do not constitute an offer, solicitation, or recommendation to buy or sell any securities or investment products. The information provided is for general informational purposes only and should not be considered as investment advice. All tokenized assets mentioned are subject to regulatory approvals and compliance requirements in their respective jurisdictions.',
        
        'In the People\'s Republic of China: This website and any securities offerings mentioned herein are not directed at or intended for access by persons in mainland China. All securities tokenization and trading activities are conducted strictly within the regulatory framework of Hong Kong SAR.',
        
        'In Hong Kong SAR: Any securities offerings are available only to Professional Investors as defined under the Securities and Futures Ordinance (Cap. 571) and are subject to all applicable Hong Kong securities laws and regulations.'
      ]
    }
  ]
}