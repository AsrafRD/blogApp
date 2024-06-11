/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["lh3.googleusercontent.com"],
  },
  env: {
    URL: process.env.URL
  }
};

module.exports = nextConfig;
