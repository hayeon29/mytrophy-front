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
};

export default nextConfig;
