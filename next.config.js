/** @type {import('next').NextConfig} */
const path = require("path");
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, "src/sass")],
  },
  images: {
    unoptimized: true,
    domains: ["image.tmdb.org", "api.themoviedb.org"],
  },
};

module.exports = nextConfig;
