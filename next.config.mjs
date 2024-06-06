/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: process.env.NEXT_PUBLIC_FRONT_IMAGE_URL,
        pathname: '**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/:path*',
        destination: `${process.env.NEXT_PUBLIC_BACK_URL}/:path*`,
      },
    ];
  },
};

export default nextConfig;
