# GreenLink Capital - Enterprise Green Asset Management Platform

![Version](https://img.shields.io/badge/version-1.0.0-green.svg)
![Next.js](https://img.shields.io/badge/Next.js-15.4.4-black.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4.0-cyan.svg)

An institutional-grade platform for tokenizing China's CCER (Chinese Certified Emission Reduction) assets, connecting global ESG capital with measurable environmental impact through advanced blockchain technology.

## 🚀 Features

### Core Platform Capabilities
- **Multi-Portal Architecture**: Issuer, Wealth Manager, and Operations portals
- **Blockchain Integration**: Web3 wallet connectivity and ERC20 token management
- **Real-time Monitoring**: IoT data streams and blockchain event tracking
- **Enterprise Security**: JWT authentication, RBAC, and comprehensive audit trails
- **Performance Optimized**: <3s load times, Core Web Vitals compliant

### Portal-Specific Features

#### 🏭 Issuer Portal
- Asset issuance wizard with multi-step validation
- Document management with blockchain verification
- Tokenization configuration and deployment
- Real-time asset performance monitoring

#### 💼 Wealth Manager Portal
- Advanced customer relationship management
- Batch trading with risk controls
- Automated report generation
- API key management and integration

#### ⚙️ Operations Portal
- KYC review queue with automated workflows
- Asset approval pipeline
- Real-time trading surveillance
- System health monitoring and alerting

## 🛠 Technology Stack

### Frontend
- **Framework**: Next.js 15.4.4 with Pages Router
- **Language**: TypeScript 5.8.3
- **Styling**: Tailwind CSS 3.4.0 with ADDX Design System
- **UI Components**: Radix UI primitives with custom variants
- **Animation**: Framer Motion for enhanced UX
- **Icons**: Heroicons & Lucide React

### Blockchain & Web3
- **Web3 Library**: Ethers.js 6.8.1
- **Network**: Polygon Mainnet (Chain ID: 137)
- **Wallet Integration**: MetaMask, WalletConnect
- **Token Standards**: ERC20 compliance

### Development & Build
- **Build Tool**: Next.js with bundle analyzer
- **Linting**: ESLint with Next.js config
- **Type Checking**: TypeScript strict mode
- **Formatting**: Prettier with custom rules

### Performance & Monitoring
- **Core Web Vitals**: LCP <2.5s, INP <200ms, CLS <0.1
- **Bundle Size**: <500KB initial load, <2MB total
- **Caching**: Intelligent static asset caching
- **Compression**: Gzip and Brotli support

## 📦 Project Structure

```
greentokey-website/
├── app/                          # Next.js App Router
│   ├── blockchain/              # Blockchain integration demo
│   ├── globals.css              # Global styles and design tokens
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Homepage
├── components/                   # Reusable UI components
│   ├── ui/                      # Atomic design system components
│   ├── layout/                  # Layout components (Header, Footer)
│   ├── web3/                    # Blockchain interaction components
│   └── portals/                 # Portal-specific components
├── lib/                         # Utilities and configurations
│   ├── hooks/                   # Custom React hooks
│   ├── utils/                   # Helper functions
│   └── types/                   # TypeScript type definitions
├── pages/                       # Legacy pages (index.tsx)
├── public/                      # Static assets
├── docs/                        # Comprehensive documentation
├── tests/                       # E2E and integration tests
└── config files                 # Next.js, Tailwind, TypeScript configs
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18.17.0 or higher
- npm or yarn package manager
- Git for version control

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd greentokey-website
```

2. **Install dependencies**
```bash
npm install --legacy-peer-deps
```

3. **Environment setup**
```bash
cp .env.example .env.local
# Configure your environment variables
```

4. **Start development server**
```bash
npm run dev
```

5. **Open browser**
Navigate to `http://localhost:3000`

### Development Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Production build
npm run start           # Start production server

# Quality Assurance
npm run lint            # ESLint code analysis
npm run type-check      # TypeScript type checking
npm run format          # Prettier code formatting

# Analysis
npm run analyze         # Bundle size analysis
```

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect repository to Vercel**
2. **Configure environment variables**
3. **Deploy with optimized settings**

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Manual Deployment

1. **Build production assets**
```bash
npm run build
```

2. **Start production server**
```bash
npm run start
```

3. **Configure reverse proxy** (Nginx example)
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🔧 Configuration

### Environment Variables

```bash
# Application
NEXT_PUBLIC_APP_URL=https://your-domain.com
NODE_ENV=production

# Blockchain
NEXT_PUBLIC_POLYGON_RPC_URL=https://polygon-rpc.com
NEXT_PUBLIC_CHAIN_ID=137

# Analytics (optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Performance Budgets

```json
{
  "budgets": {
    "initial_js": "200kb",
    "initial_css": "50kb",
    "total_js": "2mb",
    "lcp": "2.5s",
    "cls": "0.1"
  }
}
```

## 🧪 Testing

### E2E Testing with Playwright

```bash
# Install Playwright
npx playwright install

# Run tests
npm run test:e2e

# Run tests in UI mode
npm run test:e2e:ui
```

### Performance Testing

```bash
# Bundle analysis
npm run analyze

# Lighthouse audit
npm run lighthouse

# Bundle size check
npm run bundlesize
```

## 🔒 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control (RBAC)
- Multi-factor authentication support
- Session management with secure cookies

### Security Headers
- Content Security Policy (CSP)
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff
- X-XSS-Protection enabled

### Blockchain Security
- Read-only wallet integration
- No private key operations
- Secure RPC endpoint configuration
- Event signature verification

## 📊 Performance Metrics

### Core Web Vitals
- **LCP (Largest Contentful Paint)**: <2.5s
- **INP (Interaction to Next Paint)**: <200ms
- **CLS (Cumulative Layout Shift)**: <0.1

### Bundle Optimization
- **Initial JavaScript**: <200KB (gzipped)
- **Initial CSS**: <50KB (gzipped)
- **Total Bundle**: <2MB
- **Tree Shaking**: Enabled for all libraries

### Caching Strategy
- **Static Assets**: 1 year cache with immutable flag
- **Images**: 30 days cache with optimization
- **API Responses**: 1 hour browser, 2 hours CDN
- **Fonts**: 1 year cache with preload hints

## 🏗 Architecture Overview

### Multi-Portal Design
The platform implements a sophisticated multi-portal architecture:

1. **Issuer Portal**: Asset creation and management
2. **Wealth Manager Portal**: Client relationship and trading
3. **Operations Portal**: System administration and compliance

### Blockchain Integration
- **Network**: Polygon Mainnet for low-cost transactions
- **Tokens**: ERC20 standard with custom metadata
- **Events**: Real-time Transfer event monitoring
- **Wallet Support**: MetaMask, WalletConnect compatible

### Design System
- **ADDX Specification**: Institutional-grade design tokens
- **Responsive**: Mobile-first approach with breakpoint system
- **Accessibility**: WCAG 2.1 AA compliance
- **Dark Mode**: System preference detection

## 📚 Documentation

Comprehensive documentation is available in the `/docs` directory:

- [Architecture Guide](docs/ARCHITECTURE.md)
- [Development Guide](docs/DEVELOPMENT.md) 
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Security Guide](docs/SECURITY.md)
- [Performance Guide](docs/PERFORMANCE.md)
- [API Documentation](docs/API.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript strict mode required
- ESLint + Prettier formatting
- Conventional commits
- 80%+ test coverage for new features

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For technical support and questions:
- **Documentation**: Check `/docs` directory
- **Issues**: Create GitHub issue with detailed description
- **Security**: Report via private channel

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Multi-portal architecture implementation
- ✅ Blockchain integration with Polygon
- ✅ ADDX design system integration
- ✅ Performance optimization (<3s load times)
- ✅ Comprehensive security hardening
- ✅ E2E testing framework
- ✅ Production deployment configuration

---

Built with ❤️ for institutional green finance innovation.