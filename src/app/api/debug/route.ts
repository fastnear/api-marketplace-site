import { NextRequest, NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Return environment info for debugging
    const info = {
      env: process.env.NODE_ENV,
      nextauth_url: process.env.NEXTAUTH_URL,
      nextauth_secret_set: !!process.env.NEXTAUTH_SECRET,
      database_url_set: !!process.env.NEXT_DATABASE_URL,
      use_clickhouse: process.env.NEXT_USE_CLICKHOUSE === 'true',
      clickhouse_config_set: !!(process.env.NEXT_CLICKHOUSE_HOST && process.env.NEXT_CLICKHOUSE_DATABASE),
      session_strategy: authOptions.session?.strategy || 'unknown',
      providers: authOptions.providers.map(p => p.id),
      adapter_type: authOptions.adapter ? typeof authOptions.adapter : 'undefined',
      callbacks_defined: {
        session: !!authOptions.callbacks?.session,
        jwt: !!authOptions.callbacks?.jwt,
      },
    };
    
    return NextResponse.json(info);
  } catch (error) {
    console.error('Debug route error:', error);
    return NextResponse.json({ 
      error: 'Server error',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}