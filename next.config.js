/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true, // if you kept Server Actions; harmless otherwise
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '<YOUR-PROJECT-REF>.supabase.co',
        pathname: '/storage/v1/object/public/property-images/**',
      },
      {
        protocol: 'https',
        hostname: '<YOUR-PROJECT-REF>.supabase.co',
        pathname: '/storage/v1/object/sign/**',
      },
    ],
  },
  
};
module.exports = nextConfig;
