/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  images: {
    domains: ['images.genius.com', 'images.rapgenius.com']
  }
};

module.exports = nextConfig;
