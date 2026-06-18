/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_WHATSAPP_NUMBER: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
  },
  async rewrites() {
    const API_URL = 'https://revorafit.vercel.app';
    return [
      {
        source: '/api/feedback',
        destination: `${API_URL}/api/feedback`,
      },
      {
        source: '/api/products',
        destination: `${API_URL}/api/products`,
      },
      {
        source: '/api/products/:id',
        destination: `${API_URL}/api/products/:id`,
      },
      {
        source: '/api/users/:path*',
        destination: `${API_URL}/api/users/:path*`,
      },
      {
        source: '/api/orders/:path*',
        destination: `${API_URL}/api/orders/:path*`,
      },
      {
        source: '/api/payment/:path*',
        destination: `${API_URL}/api/payment/:path*`,
      }
    ];
  },
};

export default nextConfig;
