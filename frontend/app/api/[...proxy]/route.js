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
    const headers = new Headers(request.headers);
    // Remove host header to avoid SSL issues
    headers.delete('host');
    headers.delete('connection');
    
    // Read the body if not GET/HEAD
    let body = null;
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      // Check if there's a body
      const contentType = request.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        body = await request.text();
      } else if (contentType && contentType.includes('multipart/form-data')) {
        body = await request.formData();
      } else {
        try { body = await request.text(); } catch(e) {}
      }
    }

    const response = await fetch(targetUrl, {
      method: request.method,
      headers: headers,
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
