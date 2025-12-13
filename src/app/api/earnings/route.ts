import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Artist } from '@/lib/models/Artist';
import { Earnings } from '@/lib/models/Earnings';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet') || searchParams.get('artistAddress');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!artist) {
      return NextResponse.json({ 
        totalEarnings: 0,
        availableBalance: 0,
        withdrawnAmount: 0,
        earnings: [],
      });
    }

    // Get all earnings
    const earnings = await Earnings.find({ artistId: artist._id })
      .sort({ timestamp: -1 })
      .limit(100);

    const totalEarnings = earnings.reduce((sum, e) => sum + e.amount, 0);
    const withdrawnAmount = artist.withdrawnAmount || 0;
    const availableBalance = totalEarnings - withdrawnAmount;

    return NextResponse.json({
      totalEarnings,
      availableBalance,
      withdrawnAmount,
      earnings: earnings.map(e => ({
        id: e._id,
        amount: e.amount,
        type: e.type,
        timestamp: e.timestamp,
        trackId: e.trackId,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching earnings:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
