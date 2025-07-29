# GreenLink Capital - Enterprise Green Asset Management Platform

A comprehensive monorepo for GreenLink Capital's multi-portal platform supporting CCER (China Certified Emission Reduction) asset tokenization and management.

## 🏗️ Monorepo Structure

```
greenlink-capital-monorepo/
├── apps/                           # Portal Applications
│   ├── landing-page/              # Public marketing website
│   ├── investor-portal/           # Asset investment and portfolio management
│   ├── issuer-portal/             # Asset issuance and tokenization management  
│   ├── partner-portal/            # Wealth management and client relationship management
│   └── operator-console/          # System administration and monitoring
│
├── packages/                       # Shared Packages
│   ├── ui/                        # Core UI component library
│   ├── auth-ui/                   # Authentication UI components
│   ├── data-viz/                  # Data visualization components
│   ├── design-tokens/             # Design system tokens and themes
│   ├── api-client/                # Type-safe API client
│   └── tsconfig/                  # Shared TypeScript configurations
│
├── turbo.json                     # Turborepo configuration
├── pnpm-workspace.yaml           # pnpm workspace configuration
└── package.json                  # Monorepo root package
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.17.0
- pnpm >= 9.0.0

### Installation

```bash
# Install all dependencies
pnpm install

# Build all packages and apps
pnpm build

# Start all development servers
pnpm dev
```

### Individual Application Development

```bash
# Landing Page (Port 3000)
cd apps/landing-page && pnpm dev

# Investor Portal (Port 3001)  
cd apps/investor-portal && pnpm dev

# Issuer Portal (Port 3002)
cd apps/issuer-portal && pnpm dev

# Partner Portal (Port 3003)
cd apps/partner-portal && pnpm dev

# Operator Console (Port 3004)
cd apps/operator-console && pnpm dev
```

## 📦 Applications

### Landing Page (`@greenlink/landing-page`)
- **Purpose**: Public marketing website showcasing GreenLink Capital's services
- **Technology**: Next.js 15.4.4 with Pages Router
- **Target Audience**: Potential clients and general public
- **Port**: 3000

### Investor Portal (`@greenlink/investor-portal`)
- **Purpose**: Asset investment and portfolio management for institutional investors
- **Features**: Asset browsing, investment tracking, portfolio analytics
- **Target Users**: Institutional investors, fund managers
- **Port**: 3001

### Issuer Portal (`@greenlink/issuer-portal`)
- **Purpose**: Asset issuance and tokenization management
- **Features**: Asset creation wizard, document management, tokenization configuration
- **Target Users**: Asset issuers, project developers
- **Port**: 3002

### Partner Portal (`@greenlink/partner-portal`)
- **Purpose**: Wealth management and client relationship management
- **Features**: Client management CRM, batch trading, report generation
- **Target Users**: Financial advisors, wealth managers
- **Port**: 3003

### Operator Console (`@greenlink/operator-console`)
- **Purpose**: System administration and monitoring
- **Features**: KYC approval workflows, system health monitoring, user management
- **Target Users**: Internal operations team, system administrators
- **Port**: 3004

## 🎨 Shared Packages

### UI Library (`@greenlink/ui`)
- **Purpose**: Core atomic design components
- **Components**: Button, Card, Input, Modal, etc.
- **Features**: ADDX-inspired design system, full TypeScript support
- **Documentation**: Storybook available on port 6006

### Authentication UI (`@greenlink/auth-ui`)
- **Purpose**: Authentication and authorization components
- **Components**: Login forms, MFA flows, permission guards
- **Features**: Multi-role support, NextAuth.js integration
- **Documentation**: Storybook available on port 6007

### Data Visualization (`@greenlink/data-viz`)
- **Purpose**: Charts and dashboard components for financial data
- **Components**: Line charts, bar charts, pie charts, dashboards
- **Libraries**: Recharts, D3.js
- **Documentation**: Storybook available on port 6008

### Design Tokens (`@greenlink/design-tokens`)
- **Purpose**: Centralized design system tokens and themes
- **Features**: Color palettes, typography scales, spacing systems
- **Export**: JavaScript tokens, Tailwind CSS configuration

### API Client (`@greenlink/api-client`)
- **Purpose**: Type-safe API client with error handling
- **Features**: React Query integration, automatic token refresh, type safety
- **Technologies**: Axios, Zod validation, TypeScript

### TypeScript Config (`@greenlink/tsconfig`)
- **Purpose**: Shared TypeScript configurations
- **Configurations**: Base, Next.js, React Library
- **Features**: Strict type checking, consistent compiler options

## 🛠️ Development Scripts

```bash
# Development (all apps)
pnpm dev

# Build (all packages and apps)
pnpm build  

# Lint (all packages and apps)
pnpm lint

# Type check (all packages and apps)
pnpm type-check

# Test (all packages and apps)
pnpm test

# Clean build artifacts
pnpm clean

# Format code
pnpm format
```

## 🏛️ Architecture

### Technology Stack
- **Frontend Framework**: Next.js 15.4.4 with Pages Router
- **Build System**: Turborepo for efficient monorepo builds
- **Package Manager**: pnpm with workspaces
- **Styling**: Tailwind CSS with design tokens
- **State Management**: Zustand + React Query
- **Authentication**: NextAuth.js + JWT
- **Language**: TypeScript with strict mode

### Design System
- **Inspiration**: ADDX.co design language adapted for green finance
- **Typography**: Manrope font family with Noto Sans SC for Chinese
- **Colors**: Blue primary (#0052FF) with green accent (#00D4AA)
- **Components**: Atomic design methodology with Storybook documentation

### API Architecture
- **Style**: RESTful APIs with OpenAPI 3.0 specifications
- **Authentication**: JWT with role-based access control (RBAC)
- **Gateway**: Next.js middleware-based API gateway
- **Client**: Type-safe API client with React Query

## 🔒 Security

### Authentication & Authorization
- **Multi-Factor Authentication (MFA)**: TOTP, SMS, biometric support
- **Role-Based Access Control**: Investor, Issuer, Partner, Operator roles  
- **Session Management**: Secure JWT tokens with refresh rotation
- **Zero Trust**: Every request authenticated and authorized

### Data Protection
- **Encryption**: TLS 1.3 in transit, AES-256-GCM at rest
- **Input Validation**: Zod schemas for all user inputs
- **XSS Protection**: Content Security Policy (CSP) headers
- **CSRF Protection**: Built-in Next.js CSRF protection

## 🌍 Deployment

### Environments
- **Development**: Local development with hot reload
- **Staging**: Vercel preview deployments for testing
- **Production**: Vercel edge deployment with global CDN

### CI/CD Pipeline
- **GitHub Actions**: Automated testing, building, and deployment
- **Quality Gates**: TypeScript compilation, ESLint, unit tests
- **Security Scanning**: Dependency vulnerabilities, code analysis
- **Performance Monitoring**: Core Web Vitals tracking

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Bundle Analysis**: Webpack bundle analyzer
- **Error Tracking**: Sentry integration for error monitoring
- **User Analytics**: Privacy-compliant user behavior tracking

### Business Metrics
- **User Engagement**: Portal usage analytics
- **Asset Performance**: Investment and issuance metrics
- **System Health**: API response times, uptime monitoring
- **Compliance Tracking**: Audit logs and regulatory reporting

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Develop using shared packages and design system
3. Write tests for new functionality
4. Run `pnpm lint` and `pnpm type-check`
5. Create pull request with comprehensive description
6. Code review and approval required
7. Merge to `main` triggers deployment

### Code Standards
- **TypeScript**: Strict mode with comprehensive type safety
- **ESLint**: Shared configuration with Prettier integration
- **Commit Messages**: Conventional commits for automated versioning
- **Testing**: Unit tests with 80%+ coverage requirement

## 📋 Roadmap

### Phase 1: Foundation (Weeks 1-6)
- ✅ Technical architecture design
- ✅ Monorepo platform setup
- 🔄 API contract design and mock services
- 🔄 Authentication system architecture
- 🔄 CI/CD pipeline setup

### Phase 2: Core Development (Weeks 7-18)
- 🔄 ADDX design system adaptation
- 🔄 Atomic component library development  
- 🔄 Portal applications development
- 🔄 Backend microservices implementation

### Phase 3: Integration & Testing (Weeks 19-22)
- 🔄 End-to-end system integration
- 🔄 Performance optimization
- 🔄 Security hardening and compliance
- 🔄 User acceptance testing

### Phase 4: Deployment & Launch (Weeks 23-26)
- 🔄 Production environment setup
- 🔄 Go-live preparation and training
- 🔄 Post-launch monitoring and support
- 🔄 Continuous quality assurance

## 📞 Support

### Development Team
- **Technical Architect**: System architecture and technology decisions
- **Frontend Lead**: UI/UX implementation and component development
- **Backend Lead**: API development and infrastructure
- **DevOps Engineer**: CI/CD pipeline and deployment automation

### Documentation
- **Technical Architecture**: `TECHNICAL_ARCHITECTURE.md`
- **API Documentation**: OpenAPI 3.0 specifications
- **Component Library**: Storybook documentation
- **Deployment Guide**: Production deployment procedures

---

**Repository**: [GreenLink Capital Monorepo](https://github.com/greenlink-capital/platform)  
**Version**: 1.0.0  
**Last Updated**: 2024-01-15  
**License**: Private - All Rights Reserved