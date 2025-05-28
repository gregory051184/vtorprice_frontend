/** @type {import('next').NextConfig} */
const path = require('path')

/// <reference types="next-pwa" />
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting:true,
  buildExcludes: [/app-build-manifest.*$/]
});


const nextConfig = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  output: { path: path.resolve(__dirname, 'static'), },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    config.module.rules.push({
      test: /\.pdf/,
      type: 'asset/resource',
      generator: {
        filename: 'static/[hash][ext]',
      },
    })
    return config;
  },
});

module.exports = nextConfig
