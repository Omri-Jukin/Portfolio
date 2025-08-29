/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['payload'],
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/collections',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
