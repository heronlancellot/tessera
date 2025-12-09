import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cryptologos.cc',
        pathname: '/logos/**',
      },
    ],
  },
  serverExternalPackages: ['pino', 'thread-stream'],
  transpilePackages: ['@tessera/sdk'],
}

export default nextConfig
