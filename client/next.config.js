/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  modularizeImports: {
    "@mui/icons-material": {
      transform: "@mui/icons-material/{{member}}",
    },
  },
  images: {
    domains: [
      "hips.hearstapps.com",
      "upload.wikimedia.org",
      "feastingathome.com",
      "cookieandkate.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        port: "",
        pathname: "/random",
      },
      {
        protocol: "https",
        hostname: "www.themealdb.com",
        port: "",
        pathname: "/images/media/meals/**",
      },
      {
        protocol: "https",
        hostname: "www.feastingathome.com",
        port: "",
        pathname: "/wp-content/**",
      },
      {
        protocol: "https",
        hostname: "amiraspantry.com",
        port: "",
        pathname: "/wp-content/**",
      },

      {
        protocol: "https",
        hostname: "thishealthytable.com",
        port: "",
        pathname: "/wp-content/**",
      },

      {
        protocol: "https",
        hostname: "cookieandkate.com",
        port: "",
        pathname: "/images/**",
      },
      {
        protocol: "https",
        hostname: "baconmockup.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

module.exports = nextConfig;
