import { NextRequest, NextResponse } from 'next/server';
import { getQuote, createShift, getShiftStatus } from '@/lib/sideshift';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'quote': {
        const { depositCoin, settleCoin, settleAmount } = params;
        
        if (!depositCoin || !settleCoin || !settleAmount) {
          return NextResponse.json(
            { error: 'Missing required parameters for quote' },
            { status: 400 }
          );
        }

        const quote = await getQuote(depositCoin, settleCoin, settleAmount);
        return NextResponse.json({ quote });
      }

      case 'shift': {
        const { quoteId, settleAddress, refundAddress } = params;
        
        if (!quoteId || !settleAddress || !refundAddress) {
          return NextResponse.json(
            { error: 'Missing required parameters for shift' },
            { status: 400 }
          );
        }

        const shift = await createShift(quoteId, settleAddress, refundAddress);
        return NextResponse.json({ shift });
      }

      case 'status': {
        const { shiftId } = params;
        
        if (!shiftId) {
          return NextResponse.json(
            { error: 'Missing shiftId parameter' },
            { status: 400 }
          );
        }

        const status = await getShiftStatus(shiftId);
        return NextResponse.json({ status });
      }

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Payment API error:', error);
    return NextResponse.json(
      { error: 'Payment processing failed' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const shiftId = searchParams.get('shiftId');

  if (shiftId) {
    try {
      const status = await getShiftStatus(shiftId);
      return NextResponse.json({ status });
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to get shift status' },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    supportedCoins: ['ETH', 'BTC', 'USDC', 'MATIC', 'SOL', 'USDT'],
    subscriptionPrice: '9.99',
    settleCoin: 'USDC',
  });
}
