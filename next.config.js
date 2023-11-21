/** @type {import('next').NextConfig} */
const nextConfig = {}

module.exports = nextConfig

module.exports = {
    async rewrites() {
      return [
        {
          source: '/',
          destination: '/campaigns', // The path you want as your new root
        },
      ];
    },
  };
  
