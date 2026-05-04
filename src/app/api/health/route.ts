/**
 * GET /health
 * Standard health check endpoint
 */

import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    service: 'qimen-zenith',
    version: '2.0.0',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
}
