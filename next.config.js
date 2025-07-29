// Performance optimization imports
const { NextBundleAnalyzer } = require('@next/bundle-analyzer');

const withBundleAnalyzer = NextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
  openAnalyzer: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image optimization with performance focus
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 768, 1024, 1280, 1600],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year cache
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance and bundle optimization
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'date-fns', 
      'lodash-es',
      '@radix-ui/react-icons',
      'framer-motion'
    ],
    
    // Server Components optimization
    serverComponentsExternalPackages: [
      '@prisma/client',
      'mysql2'
    ],
    
    // Enable advanced optimizations
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },
  
  // Build-time optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn']
    } : false,
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },
  
  // HTTP headers for caching and security
  async headers() {
    return [
      // Static assets caching
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // Image caching
      {
        source: '/:path*.(jpg|jpeg|png|webp|avif|gif|svg|ico)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2592000' // 30 days
          }
        ]
      },
      
      // Font caching
      {
        source: '/fonts/:path*.(woff|woff2|ttf|otf)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          }
        ]
      },
      
      // API caching for static data
      {
        source: '/api/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=7200' // 1h browser, 2h CDN
          }
        ]
      },
      
      // Security headers
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ];
  },
  
  // Webpack optimizations
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Production optimizations
    if (!dev && !isServer) {
      // Bundle splitting optimization
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          
          // Vendor libraries
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            enforce: true,
            maxSize: 200000, // 200KB max chunk size
          },
          
          // UI libraries  
          ui: {
            test: /[\\/]node_modules[\\/](@radix-ui|lucide-react|framer-motion)[\\/]/,
            name: 'ui-libs',
            chunks: 'all',
            priority: 10,
          },
          
          // Utility libraries
          utils: {
            test: /[\\/]node_modules[\\/](lodash|date-fns|clsx)[\\/]/,
            name: 'utils',
            chunks: 'all',
            priority: 5,
          },
          
          // Web3 libraries
          web3: {
            test: /[\\/]node_modules[\\/](ethers|web3)[\\/]/,
            name: 'web3-libs',
            chunks: 'all',
            priority: 8,
          }
        }
      };
      
      // Performance budgets
      config.performance = {
        maxAssetSize: 500000, // 500KB warning
        maxEntrypointSize: 500000,
        hints: process.env.NODE_ENV === 'production' ? 'warning' : false
      };
    }
    
    // SVG optimization
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });
    
    return config;
  },
  
  // Build settings
  eslint: {
    ignoreDuringBuilds: false,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // Output settings
  output: 'standalone',
  poweredByHeader: false,
  
  // Compression
  compress: true,
  
  // Development optimizations
  ...(process.env.NODE_ENV === 'development' && {
    onDemandEntries: {
      maxInactiveAge: 25 * 1000,
      pagesBufferLength: 2,
    }
  })
};

module.exports = withBundleAnalyzer(nextConfig);