import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { query } from '@/lib/db';

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
      console.log(`Fetching credit history for user: ${userId}`);
    }
    
    // Try to fetch real transaction data if the credit_transactions table exists
    try {
      // Check if the credit_transactions table exists first
      const tableCheck = await query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = 'credit_transactions'
        );
      `);
      
      const tableExists = tableCheck.rows[0].exists;
      
      if (tableExists) {
        const result = await query(`
          SELECT 
            id, 
            type, 
            amount, 
            balance_after, 
            reference_type, 
            reference_id, 
            description, 
            created_at
          FROM credit_transactions
          WHERE user_id = $1
          ORDER BY created_at DESC
          LIMIT 10
        `, [userId]);
        
        if (isDevelopment) {
          console.log(`Found ${result.rows.length} credit transactions`);
        }
        
        return NextResponse.json({
          transactions: result.rows
        });
      } else {
        if (isDevelopment) {
          console.log('Credit transactions table does not exist yet, returning demo data');
        }
        
        // Return demo data
        return NextResponse.json({
          transactions: [
            {
              id: 1,
              type: 'initial',
              amount: 1000,
              balance_after: 1000,
              reference_type: 'system',
              description: 'Initial credit allocation',
              created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 2,
              type: 'usage',
              amount: -5,
              balance_after: 995,
              reference_type: 'api_call',
              reference_id: 123,
              description: 'API call to /near/account-info',
              created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 3,
              type: 'usage',
              amount: -10,
              balance_after: 985,
              reference_type: 'api_call',
              reference_id: 124,
              description: 'API call to /near/transaction-status',
              created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
            },
            {
              id: 4,
              type: 'bonus',
              amount: 50,
              balance_after: 1035,
              reference_type: 'promotion',
              description: 'Welcome bonus',
              created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
            }
          ]
        });
      }
    } catch (error) {
      console.error('Error querying credit transactions:', error);
      
      // Return demo data if there's a database error
      return NextResponse.json({
        transactions: [
          {
            id: 1,
            type: 'initial',
            amount: 1000,
            balance_after: 1000,
            reference_type: 'system',
            description: 'Initial credit allocation',
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      });
    }
  } catch (error) {
    console.error('Error fetching credit history:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 