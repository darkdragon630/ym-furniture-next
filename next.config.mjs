/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.1.101'],

  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co'
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com'
      },
      {
        protocol: 'https',
        hostname: 'stream.mux.com'
      }
    ]
  },

  experimental: {
    optimizeCss: true
  },

  turbopack: {
    root: process.cwd()
  }
}

export default nextConfig