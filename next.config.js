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
  env: {
    NEXT_PUBLIC_SUPABASE_URL: 'https://mehpjxoheirtktriokon.supabase.co',
    SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1laHBqeG9oZWlydGt0cmlva29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzA2NzgsImV4cCI6MjA3NDcwNjY3OH0.3cFNnsnE12WE8Xhi6qyrieN04yiYKB7UhJYtpmZaq4o',
  },
};
module.exports = nextConfig;
