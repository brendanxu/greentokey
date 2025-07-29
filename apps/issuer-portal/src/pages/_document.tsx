/**
 * @fileoverview Issuer Portal Document Component
 * @description HTML document structure for the issuer portal
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Primary Meta Tags */}
        <meta name="title" content="GreenLink Capital - Issuer Portal" />
        <meta 
          name="description" 
          content="Professional green asset tokenization platform for institutional issuers. Issue, manage, and monitor tokenized carbon credits and sustainable assets." 
        />
        <meta name="robots" content="noindex, nofollow" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Fonts preload */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="GreenLink Capital - Issuer Portal" />
        <meta 
          property="og:description" 
          content="Professional green asset tokenization platform for institutional issuers." 
        />
        <meta property="og:image" content="/og-image-issuer.png" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="GreenLink Capital - Issuer Portal" />
        <meta 
          property="twitter:description" 
          content="Professional green asset tokenization platform for institutional issuers." 
        />
        <meta property="twitter:image" content="/og-image-issuer.png" />
        
        {/* Security Headers */}
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Progressive Web App */}
        <meta name="theme-color" content="#00D4AA" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="GreenLink Issuer" />
        
        {/* Viewport for mobile optimization */}
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="//api.greenlink.capital" />
        <link rel="dns-prefetch" href="//images.unsplash.com" />
        
        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'GreenLink Capital Issuer Portal',
              description: 'Professional green asset tokenization platform for institutional issuers',
              url: 'https://issuer.greenlink.capital',
              applicationCategory: 'FinanceApplication',
              operatingSystem: 'Web',
              permissions: 'Restricted to verified institutional users',
              creator: {
                '@type': 'Organization',
                name: 'GreenLink Capital',
                url: 'https://greenlink.capital',
              },
            }),
          }}
        />
      </Head>
      <body className="bg-background-primary text-text-primary">
        {/* Loading indicator for better UX */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Show loading indicator
              document.body.classList.add('loading');
              
              // Remove loading indicator when page is ready
              window.addEventListener('load', function() {
                document.body.classList.remove('loading');
              });
            `,
          }}
        />
        
        <Main />
        <NextScript />
        
        {/* Analytics placeholder - to be configured in production */}
        {process.env.NODE_ENV === 'production' && (
          <script
            dangerouslySetInnerHTML={{
              __html: `
                // Analytics initialization will go here
                // Google Analytics, Mixpanel, etc.
              `,
            }}
          />
        )}
      </body>
    </Html>
  );
}