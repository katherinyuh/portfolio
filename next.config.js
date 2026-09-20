/** @type {import('next').NextConfig} */
const nextConfig = {
  // The moment the site was built (or, in development, the dev server started): shown in the sidebar as "Last updated".
  env: {
    NEXT_PUBLIC_BUILD_TIME: new Date().toISOString(),
  },
  images: {
    // Add any external image domains here
    domains: [],
  },
};

module.exports = nextConfig;
