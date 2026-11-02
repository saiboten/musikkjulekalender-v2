/** @type {import('next').NextConfig} */

const nextConfig = {
  transpilePackages: ["@mdxeditor/editor"],
  reactStrictMode: true,
  images: {
    // The background image is served at quality 100.
    qualities: [75, 100],
  },
};

module.exports = nextConfig;
