'use client'

import Link from 'next/link'
import { Mail, MapPin, Phone, Linkedin, Twitter, Globe } from 'lucide-react'

const footerLinks = {
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
}

export default function Footer() {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-text-primary">
                GreenLink Capital
              </span>
            </Link>
            <p className="text-sm text-text-secondary">
              The institutional gateway to verifiable green assets, bridging sustainable finance with blockchain innovation.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-tertiary hover:text-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-tertiary hover:text-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-text-tertiary hover:text-primary transition-colors">
                <Globe className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-2">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-text-tertiary mt-0.5" />
                <span className="text-sm text-text-secondary">
                  Central, Hong Kong SAR
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <Mail className="w-4 h-4 text-text-tertiary mt-0.5" />
                <a
                  href="mailto:contact@greenlinkCapital.com"
                  className="text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  contact@greenlinkCapital.com
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-4 h-4 text-text-tertiary mt-0.5" />
                <span className="text-sm text-text-secondary">
                  +852 1234 5678
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="space-y-4">
            <div className="bg-background-tertiary rounded-lg p-6">
              <h5 className="font-semibold mb-3 text-sm">Important Legal Disclaimer</h5>
              <p className="text-xs text-text-tertiary leading-relaxed">
                This website and its contents do not constitute an offer, solicitation, or recommendation to buy or sell any securities or investment products. 
                The information provided is for general informational purposes only and should not be considered as investment advice. 
                All tokenized assets mentioned are subject to regulatory approvals and compliance requirements in their respective jurisdictions.
              </p>
              <p className="text-xs text-text-tertiary leading-relaxed mt-3">
                In the People&apos;s Republic of China: This website and any securities offerings mentioned herein are not directed at or intended for access by persons in mainland China. 
                All securities tokenization and trading activities are conducted strictly within the regulatory framework of Hong Kong SAR.
              </p>
              <p className="text-xs text-text-tertiary leading-relaxed mt-3">
                In Hong Kong SAR: Any securities offerings are available only to Professional Investors as defined under the Securities and Futures Ordinance (Cap. 571) 
                and are subject to all applicable Hong Kong securities laws and regulations.
              </p>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-xs text-text-tertiary">
                © 2024 GreenLink Capital. All rights reserved.
              </p>
              <div className="flex space-x-6">
                <Link href="#privacy" className="text-xs text-text-tertiary hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link href="#terms" className="text-xs text-text-tertiary hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link href="#cookies" className="text-xs text-text-tertiary hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}