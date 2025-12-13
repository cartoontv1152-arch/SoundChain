import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Artist } from '@/lib/models/Artist';
import { Earnings } from '@/lib/models/Earnings';
import { createShiftOrder, getShiftStatus } from '@/lib/sideshift';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, amount, withdrawalToken, withdrawalAddress } = body;

    if (!walletAddress || !amount || !withdrawalToken || !withdrawalAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Check available balance
    if (artist.availableBalance < amount) {
      return NextResponse.json(
        { error: 'Insufficient balance' },
        { status: 400 }
      );
    }

    // Minimum withdrawal amount
    if (amount < 1) {
      return NextResponse.json(
        { error: 'Minimum withdrawal amount is $1' },
        { status: 400 }
      );
    }

    // Create SideShift order to convert USDC to chosen token
    const shiftOrder = await createShiftOrder(
      'usdc', // from USDC earnings
      withdrawalToken.toLowerCase(),
      amount.toString(),
      withdrawalAddress
    );

    // Deduct from artist balance
    artist.availableBalance -= amount;
    await artist.save();

    // Record withdrawal
    const withdrawal = await Earnings.create({
      artistId: artist._id,
      amount: -amount,
      type: 'withdrawal',
      status: 'pending',
      withdrawalAddress,
      withdrawalToken,
      sideshiftOrderId: shiftOrder.id,
      notes: `Withdrawal to ${withdrawalToken.toUpperCase()}`,
    });

    return NextResponse.json({
      withdrawal,
      shiftOrder,
      message: 'Withdrawal initiated successfully',
    });
  } catch (error: any) {
    console.error('Error processing withdrawal:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Check withdrawal status
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');
    const orderId = searchParams.get('orderId');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    // Get withdrawal history
    const withdrawals = await Earnings.find({
      artistId: artist._id,
      type: 'withdrawal',
    }).sort({ timestamp: -1 }).limit(20);

    // If specific order ID provided, get status
    if (orderId) {
      const status = await getShiftStatus(orderId);
      return NextResponse.json({ status });
    }

    return NextResponse.json({ withdrawals });
  } catch (error: any) {
    console.error('Error fetching withdrawals:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
