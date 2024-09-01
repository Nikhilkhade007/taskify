/** @type {import('next').NextConfig} */
const nextConfig = {
    // experimental: {
    //   serverActions: true,
    // },
    images: {
      remotePatterns:[{
        protocol: 'https',
        hostname: 'bqjzxefpplfpxmoswnxy.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/workspace-logos/**',
      }],
      domains: ['bqjzxefpplfpxmoswnxy.supabase.co'],
    },
  };
export default nextConfig;
