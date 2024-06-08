/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_FRONT_IMAGE_URL,
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['shared.akamai.steamstatic.com'],
  },
};

export default nextConfig;
