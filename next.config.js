/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://192.168.1.20:8080/api/:path*',
      },
    ]
  }
}

module.exports = nextConfig
