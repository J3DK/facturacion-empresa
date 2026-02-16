/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para PM2 + Hosting Business
  output: 'standalone',
  
  // Optimizaciones
  compress: true,
  poweredByHeader: false,
  
  // Imágenes
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    unoptimized: false,
  },
  
  // API y rewrites
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [],
    };
  },

  // Comportamiento de páginas
  pageExtensions: ['ts', 'tsx', 'js', 'jsx'],
};

module.exports = nextConfig;
