/**
 * @fileoverview Issuer Portal App Component
 * @description Global app configuration for the issuer portal
 */

import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { Inter } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '../styles/globals.css';

// Initialize Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function IssuerPortalApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <div className={`${inter.variable} font-sans antialiased`}>
        <Component {...pageProps} />
        
        {/* Global toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgb(var(--background-primary))',
              color: 'rgb(var(--text-primary))',
              border: '1px solid rgb(var(--border-primary))',
              borderRadius: '8px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            },
            success: {
              iconTheme: {
                primary: '#00D4AA',
                secondary: '#ffffff',
              },
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </div>
    </SessionProvider>
  );
}