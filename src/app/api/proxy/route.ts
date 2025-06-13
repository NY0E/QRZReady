import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { protocol, origin, path, method, headers, body: requestBody } = body;

    const url = `${protocol}://${origin}${path}`;
    
    const response = await fetch(url, {
      method: method || 'GET',
      headers: headers || {},
      body: requestBody ? JSON.stringify(requestBody) : undefined,
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}
