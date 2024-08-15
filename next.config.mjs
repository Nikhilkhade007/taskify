/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverActions: true,
    },
    images: {
      remotePatterns:[{
        protocol: 'https',
        hostname: 'bqjzxefpplfpxmoswnxy.supabase.co',
        port: '',
        pathname: '/account123/**',
      }],
      domains: ['bqjzxefpplfpxmoswnxy.supabase.co'],
    },
  };
export default nextConfig;
