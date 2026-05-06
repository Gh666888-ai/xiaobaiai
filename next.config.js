/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
  async rewrites() {
    return [
      { source: '/robots.txt', destination: '/robots.txt' },
      { source: '/sitemap.xml', destination: '/sitemap.xml' },
    ]
  },
}

module.exports = nextConfig
