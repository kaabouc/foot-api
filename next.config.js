/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow existing src/ structure
  eslint: {
    dirs: ['src', 'pages'],
  },
  // Optional: proxy API in dev (or use existing proxy-server)
  async rewrites() {
    return [];
  },
  // Ensure static assets work
  trailingSlash: false,
};

module.exports = nextConfig;
