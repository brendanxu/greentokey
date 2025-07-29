/**
 * @fileoverview Partner Portal Document Configuration
 * @version 1.0.0
 */

import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="zh-HK" className="h-full">
      <Head>
        {/* Font preloading for better performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          as="style"
          onLoad={(e: any) => e.target.onload = null; e.target.rel = 'stylesheet'}
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&display=swap"
          />
        </noscript>
        
        {/* Critical CSS for above-the-fold content */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical CSS for initial render */
            body {
              font-family: 'Manrope', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              color: #0f172a;
              line-height: 1.6;
              -webkit-font-smoothing: antialiased;
              -moz-osx-font-smoothing: grayscale;
            }
            
            * {
              box-sizing: border-box;
            }
            
            /* Loading state */
            .loading-screen {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: #f8fafc;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 9999;
            }
            
            .loading-spinner {
              width: 32px;
              height: 32px;
              border: 3px solid #e2e8f0;
              border-top: 3px solid #0ea5e9;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            
            /* Hide loading screen when app is ready */
            #__next {
              min-height: 100vh;
            }
          `
        }} />
      </Head>
      <body className="h-full bg-gray-50 font-sans antialiased">
        {/* Loading screen that will be hidden when React app loads */}
        <div id="loading-screen" className="loading-screen">
          <div className="text-center">
            <div className="loading-spinner mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">正在加载财富管理门户...</p>
          </div>
        </div>
        
        <Main />
        <NextScript />
        
        {/* Hide loading screen after app loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.addEventListener('load', function() {
                const loadingScreen = document.getElementById('loading-screen');
                if (loadingScreen) {
                  loadingScreen.style.display = 'none';
                }
              });
            `
          }}
        />
        
        {/* Analytics and monitoring scripts would go here */}
        {process.env.NODE_ENV === 'production' && (
          <>
            {/* Google Analytics or other analytics scripts */}
            {/* Error monitoring scripts (Sentry, etc.) */}
            {/* Performance monitoring scripts */}
          </>
        )}
      </body>
    </Html>
  );
}