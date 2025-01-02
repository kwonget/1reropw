/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias['@'] = __dirname;
    return config;
  },
}

module.exports = nextConfig

