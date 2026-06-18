import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
  return handleProxy(request, params);
}

export async function POST(request, { params }) {
  return handleProxy(request, params);
}

export async function PUT(request, { params }) {
  return handleProxy(request, params);
}

export async function DELETE(request, { params }) {
  return handleProxy(request, params);
}

export async function PATCH(request, { params }) {
  return handleProxy(request, params);
}

async function handleProxy(request, { params }) {
  const backendUrl = 'https://revorafit.vercel.app';
  const path = params.proxy ? params.proxy.join('/') : '';
  
  // Extract query parameters
  const url = new URL(request.url);
  const searchParams = url.search;
  
  const targetUrl = `${backendUrl}/api/${path}${searchParams}`;
  
  try {
    // Only forward safe headers to prevent backend crashes
    const safeHeaders = new Headers();
    const contentType = request.headers.get('content-type');
    if (contentType) safeHeaders.set('content-type', contentType);
    
    const auth = request.headers.get('authorization');
    if (auth) safeHeaders.set('authorization', auth);
    
    // Read the body if not GET/HEAD
    let body = null;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      if (contentType && contentType.includes('application/json')) {
        body = await request.text();
      } else if (contentType && contentType.includes('multipart/form-data')) {
        // For multipart, we should ideally not parse and just stream it
        body = await request.blob();
      } else {
        try { body = await request.text(); } catch(e) {}
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: safeHeaders,
      body: body,
      redirect: 'manual'
    });

    const responseHeaders = new Headers(response.headers);
    // Prevent double CORS issues
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Return the exact response from the backend
    return new NextResponse(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(`Proxy Error for ${targetUrl}:`, error);
    return NextResponse.json({ 
      error: 'Proxy failed', 
      message: error.message,
      targetUrl 
    }, { 
      status: 502,
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
