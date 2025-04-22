import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// In development, we'll use mock data since database might not be set up
const isDevelopment = process.env.NODE_ENV === 'development';

export async function GET(request: NextRequest) {
  // Get user token from request
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // Check if user is authenticated
  if (!token || !token.sub) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Get the user ID (either from the query param or from the token)
  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get('userId');
  
  // Only allow users to access their own data
  // Admin users could have special permissions here
  if (requestedUserId && requestedUserId !== token.sub) {
    return NextResponse.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  try {
    // In development mode, use mock data
    if (isDevelopment) {
      return NextResponse.json({
        credits: 1000,
        monthlyUsage: 243
      });
    }
    
    // In production, we would use the actual database
    // Get user credits and usage from database
    const userId = token.sub;
    
    // For now, we don't have the actual database connection
    // so we'll return mock data
    return NextResponse.json({
      credits: 1000,
      monthlyUsage: 243
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}