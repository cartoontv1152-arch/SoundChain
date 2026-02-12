import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Track } from '@/lib/models/Track';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'recent';

    const query: any = {};
    const artistAddress = searchParams.get('artistAddress');

    if (artistAddress) {
      query.artistAddress = artistAddress.toLowerCase();
    }

    if (genre && genre !== 'all') {
      query.genre = { $regex: new RegExp(genre, 'i') };
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
        { artist: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ];
    }

    let sortQuery: any = { createdAt: -1 };
    if (sort === 'popular') {
      sortQuery = { plays: -1 };
    } else if (sort === 'trending') {
      sortQuery = { plays: -1, createdAt: -1 };
    }

    const total = await Track.countDocuments(query);
    const tracks = await Track.find(query)
      .sort(sortQuery)
      .limit(limit)
      .skip(offset)
      .lean();

    const transformedTracks = tracks.map((track: any) => ({
      id: track._id.toString(),
      title: track.title,
      artist: track.artist || track.artistName || 'Unknown',
      artistAddress: track.artistAddress || '',
      album: track.album || 'Single',
      duration: track.duration,
      genre: track.genre,
      coverUrl: track.coverUrl || track.coverImage || '',
      audioUrl: track.audioUrl || track.ipfsGatewayUrl || '',
      ipfsHash: track.ipfsHash || track.audioFile || '',
      plays: track.plays || track.playCount || 0,
      likes: track.likes || track.likeCount || 0,
      isNFT: track.isNFT || false,
      nftTokenId: track.nftTokenId || null,
      createdAt: track.createdAt,
    }));

    return NextResponse.json({
      tracks: transformedTracks,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error fetching tracks:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
