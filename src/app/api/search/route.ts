import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Track from '@/lib/models/Track';
import { Artist } from '@/lib/models/Artist';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q') || '';
    
    if (!q.trim()) {
      return NextResponse.json({ tracks: [], artists: [] });
    }

    const regex = new RegExp(q, 'i');

    const [tracks, artists] = await Promise.all([
      Track.find({
        $or: [
          { title: regex },
          { artist: regex },
          { genre: regex },
        ]
      }).sort({ plays: -1 }).limit(20).lean(),
      Artist.find({
        $or: [
          { artistName: regex },
          { bio: regex },
        ]
      }).sort({ totalStreams: -1 }).limit(10).lean(),
    ]);

    const formattedTracks = tracks.map((t: any) => ({
      id: t._id.toString(),
      title: t.title,
      artist: t.artist,
      artistAddress: t.artistAddress,
      duration: t.duration,
      genre: t.genre,
      coverUrl: t.coverUrl,
      audioUrl: t.audioUrl,
      plays: t.plays || 0,
      likes: t.likes || 0,
    }));

    const formattedArtists = artists.map((a: any) => ({
      id: a._id.toString(),
      displayName: a.artistName,
      walletAddress: a.walletAddress,
      avatarUrl: a.avatar || '',
      isVerified: a.verified || false,
      totalPlays: a.totalStreams || 0,
      genres: a.genres || [],
    }));

    return NextResponse.json({ tracks: formattedTracks, artists: formattedArtists });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
