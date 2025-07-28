# GreenLink Capital - RWA Website

A professional enterprise website for GreenLink Capital, focusing on tokenization of China's CCER (Certified Emission Reduction) green assets.

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Language**: TypeScript

## 🎨 Design Features

- Dark theme with green/teal accents (inspired by ADDX)
- Responsive design for all devices
- Smooth animations and transitions
- Professional fintech aesthetic

## 📂 Project Structure

```
greentokey-website/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page
│   └── globals.css     # Global styles
├── components/
│   ├── Navbar.tsx      # Navigation bar
│   ├── Hero.tsx        # Hero section
│   ├── Partners.tsx    # Partners showcase
│   ├── Solution.tsx    # Solution cards
│   ├── Process.tsx     # Process flow
│   ├── AssetFocus.tsx  # Why CCER section
│   ├── ServiceSections.tsx # For Investors/Owners
│   ├── WhyChooseUs.tsx # About section
│   └── Footer.tsx      # Footer with legal
├── lib/
│   └── utils.ts        # Utility functions
└── public/             # Static assets
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 🌟 Key Sections

1. **Hero Section**: Eye-catching intro with particle animations
2. **Partners**: Showcases strategic partnerships
3. **Solution**: 4 key value propositions
4. **Process**: 4-step tokenization workflow
5. **Asset Focus**: Why CCER is superior
6. **Services**: Tailored for investors and asset owners
7. **Why Choose Us**: Trust and expertise
8. **Footer**: Comprehensive legal disclaimers

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly navigation

## 🔧 Customization

### Colors
Edit `tailwind.config.js` to modify the color scheme:
- Primary: #00D4AA (teal)
- Accent: #0EA5E9 (blue)
- Background: #0a0a0a (deep black)

### Content
All text content is in the component files for easy editing.

## 📄 License

© 2024 GreenLink Capital. All rights reserved.