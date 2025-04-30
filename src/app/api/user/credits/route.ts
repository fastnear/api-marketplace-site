import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { getUserCredits, getMonthlyApiUsage } from '@/lib/credit-utils';
import { authOptions } from '@/lib/auth';

// Determine environment for conditional logging
const isDevelopment = process.env.NODE_ENV === 'development';

export async function GET(request: NextRequest) {
  // Get user session
  const session = await getServerSession(authOptions);
  
  // Check if user is authenticated
  if (!session?.user?.id) {
    if (isDevelopment) {
      console.log('Authentication failed: No valid session found');
    }
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  try {
    const userId = session.user.id;
    
    if (isDevelopment) {
      console.log(`Fetching credits for authenticated user: ${userId}`);
    }
    
    // Get actual credit data from database
    let credits = 1000; // Default fallback
    let monthlyUsage = 0;
    
    try {
      credits = await getUserCredits(userId);
      monthlyUsage = await getMonthlyApiUsage(userId);
      
      if (isDevelopment) {
        console.log(`Retrieved credits: ${credits}, monthly usage: ${monthlyUsage}`);
      }
    } catch (error) {
      // If database operations fail, use default values
      console.error('Database error when fetching credits:', error);
      
      if (isDevelopment) {
        console.log('Using default values due to database error');
      }
    }
    
    return NextResponse.json({
      credits,
      monthlyUsage
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}