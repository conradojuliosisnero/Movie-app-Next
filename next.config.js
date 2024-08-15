/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias["@"] = path.resolve(__dirname, "src");
    return config;
  },
  sassOptions: {
    includePaths: [path.join(__dirname, "src/sass")],
  },
  images: {
    unoptimized: true,
    domains: [
      "image.tmdb.org",
      "api.themoviedb.org",
      "lh3.googleusercontent.com",
    ],
  },
};

module.exports = nextConfig;
