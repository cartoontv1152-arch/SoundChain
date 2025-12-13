import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Track } from '@/lib/models/Track';
import { User } from '@/lib/models/User';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const track = await Track.findById(id).populate('artistId');
    
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    return NextResponse.json({ track });
  } catch (error: any) {
    console.error('Error fetching track:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const track = await Track.findById(id).populate('artistId');
    
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Verify ownership
    if (track.artistId.walletAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await Track.findByIdAndDelete(id);

    return NextResponse.json({ message: 'Track deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting track:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Like/Unlike track
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { walletAddress, action } = body; // action: 'like' or 'unlike'

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const track = await Track.findById(id);
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    const user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (action === 'like') {
      if (!user.likedTracks.includes(track._id)) {
        user.likedTracks.push(track._id);
        track.likeCount += 1;
      }
    } else if (action === 'unlike') {
      user.likedTracks = user.likedTracks.filter((t: any) => !t.equals(track._id));
      track.likeCount = Math.max(0, track.likeCount - 1);
    }

    await user.save();
    await track.save();

    return NextResponse.json({ track, liked: action === 'like' });
  } catch (error: any) {
    console.error('Error updating track:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
