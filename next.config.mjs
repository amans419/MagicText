/** @type {import('next').NextConfig} */
const nextConfig = {
  // optimizeFonts: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        // hostname: "lxlfwrdbdhafahrrgtzk.supabase.co",
        hostname: "hmcjfupbzbebkintemqt.supabase.co",
      },
    ],
  },
};

export default nextConfig;
