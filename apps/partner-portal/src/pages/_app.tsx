/**
 * @fileoverview Partner Portal App Configuration
 * @version 1.0.0
 */

import type { AppProps } from 'next/app';
import Head from 'next/head';
import '../styles/globals.css';

function PartnerPortalApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GreenLink Capital - 财富管理门户</title>
        <meta name="description" content="GreenLink Capital 财富管理门户 - 专业的绿色投资管理平台" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Security headers */}
        <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
        <meta httpEquiv="X-Frame-Options" content="DENY" />
        <meta httpEquiv="X-XSS-Protection" content="1; mode=block" />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        
        {/* Manifest for PWA capabilities */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple touch icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      </Head>
      
      <div id="__next">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default PartnerPortalApp;