/** @type {import('next').NextConfig} */
const nextConfig = {
  cacheComponents: true,
  transpilePackages: ["@lost-n-found/api-client"],
  cacheLife: {
    none: {
      stale: 1,
      revalidate: 1,
      expire: 1,
    },
  },
};

export default nextConfig;
