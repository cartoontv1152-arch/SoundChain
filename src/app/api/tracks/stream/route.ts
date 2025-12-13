import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Track } from '@/lib/models/Track';
import { Artist } from '@/lib/models/Artist';
import { User } from '@/lib/models/User';
import { StreamAnalytics } from '@/lib/models/StreamAnalytics';
import { Earnings } from '@/lib/models/Earnings';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { trackId, walletAddress, duration, completed } = body;

    if (!trackId || !walletAddress) {
      return NextResponse.json(
        { error: 'Track ID and wallet address required' },
        { status: 400 }
      );
    }

    const track = await Track.findById(trackId);
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    const artist = await Artist.findById(track.artistId);
    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });

    // Calculate earnings if stream is completed (listened to at least 30 seconds)
    let earnedAmount = 0;
    if (completed && duration >= 30) {
      earnedAmount = artist.pricePerStream;
      
      // Update play count
      track.playCount += 1;
      await track.save();

      // Update artist earnings
      artist.totalStreams += 1;
      artist.totalEarnings += earnedAmount;
      artist.availableBalance += earnedAmount;
      await artist.save();

      // Record earnings
      await Earnings.create({
        artistId: artist._id,
        amount: earnedAmount,
        type: 'stream',
        status: 'completed',
        trackId: track._id,
      });
    }

    // Record analytics
    await StreamAnalytics.create({
      trackId: track._id,
      artistId: artist._id,
      userId: user?._id,
      walletAddress: walletAddress.toLowerCase(),
      duration,
      completed,
      earnedAmount,
    });

    return NextResponse.json({
      success: true,
      playCount: track.playCount,
      earnedAmount,
    });
  } catch (error: any) {
    console.error('Error recording stream:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
