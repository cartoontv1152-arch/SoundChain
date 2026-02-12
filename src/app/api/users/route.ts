import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Artist } from '@/lib/models/Artist';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    
    if (!user) {
      // Create new user on first connection
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        subscriptionStatus: 'free',
      });
    }

    // Check if user is an artist
    let artistProfile = null;
    if (user.isArtist) {
      artistProfile = await Artist.findOne({ userId: user._id });
    }

    return NextResponse.json({ user, artistProfile });
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, email, username } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const user = await User.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      { email, username },
      { new: true, upsert: true }
    );

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
