import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'not set',
    nextPublicApiUrl: process.env.NEXT_PUBLIC_API_URL || 'not set',
    vercelUrl: process.env.VERCEL_URL || 'not set',
    nodeEnv: process.env.NODE_ENV,
  });
}
