import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Track } from '@/lib/models/Track';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { trackId, duration, completed } = body;

    if (!trackId) {
      return NextResponse.json(
        { error: 'Track ID required' },
        { status: 400 }
      );
    }

    const track = await Track.findById(trackId);
    if (!track) {
      return NextResponse.json({ error: 'Track not found' }, { status: 404 });
    }

    // Record play if listened for at least 10 seconds or completed
    if (completed || (duration && duration >= 10)) {
      track.plays = (track.plays || 0) + 1;
      track.playCount = (track.playCount || 0) + 1;
      await track.save();
    }

    return NextResponse.json({
      success: true,
      plays: track.plays,
    });
  } catch (error: any) {
    console.error('Error recording stream:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
