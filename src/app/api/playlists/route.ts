import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import Playlist from '@/lib/models/Playlist';

export async function GET() {
  try {
    await connectDB();
    const playlists = await Playlist.find({ isPublic: true })
      .populate('tracks')
      .sort({ followers: -1 })
      .lean();

    const formatted = playlists.map((p: any) => ({
      id: p._id.toString(),
      name: p.name,
      description: p.description,
      coverUrl: p.coverUrl,
      trackCount: p.tracks?.length || 0,
      tracks: (p.tracks || []).map((t: any) => ({
        id: t._id.toString(),
        title: t.title,
        artist: t.artist,
        artistAddress: t.artistAddress,
        duration: t.duration,
        genre: t.genre,
        coverUrl: t.coverUrl,
        audioUrl: t.audioUrl,
        plays: t.plays,
        likes: t.likes,
      })),
      followers: p.followers,
      createdBy: p.createdBy,
    }));

    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
