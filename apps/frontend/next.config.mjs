/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { esmExternals: true },
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.NEXT_PUBLIC_BACKEND_URL,
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,OPTIONS,POST,PUT,DELETE,PATCH",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "X-Requested-With, Content-Type, Accept",
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
        ],
      },
    ];
  }
};

export default nextConfig;
