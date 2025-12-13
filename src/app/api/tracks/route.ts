import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Track } from '@/lib/models/Track';
import { Artist } from '@/lib/models/Artist';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const searchParams = request.nextUrl.searchParams;
    const genre = searchParams.get('genre');
    const search = searchParams.get('search');
    const artistWallet = searchParams.get('artist');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const sort = searchParams.get('sort') || 'recent'; // recent, popular, trending

    let query: any = { isPublic: true };

    // Filter by genre
    if (genre && genre !== 'all') {
      query.genre = genre;
    }

    // Filter by artist
    if (artistWallet) {
      const artist = await Artist.findOne({ walletAddress: artistWallet.toLowerCase() });
      if (artist) {
        query.artistId = artist._id;
      }
    }

    // Search by title or artist name
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { artistName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Determine sort order
    let sortQuery: any = { createdAt: -1 }; // default: recent
    if (sort === 'popular') {
      sortQuery = { playCount: -1 };
    } else if (sort === 'trending') {
      // Trending: high play count in last 7 days (simplified)
      sortQuery = { playCount: -1, createdAt: -1 };
    }

    const total = await Track.countDocuments(query);
    const tracks = await Track.find(query)
      .sort(sortQuery)
      .limit(limit)
      .skip(offset)
      .populate('artistId', 'artistName avatar walletAddress');

    // Transform tracks to match frontend interface
    const transformedTracks = tracks.map((track: any) => ({
      id: track._id.toString(),
      _id: track._id.toString(),
      title: track.title,
      artist: track.artistName,
      artistAddress: track.artistId?.walletAddress || '',
      album: track.album || 'Single',
      duration: track.duration,
      coverUrl: track.coverImage === 'unsplash' 
        ? 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400'
        : `https://gateway.pinata.cloud/ipfs/${track.coverImage}`,
      audioUrl: track.ipfsGatewayUrl,
      ipfsHash: track.audioFile,
      nftTokenId: track.nftTokenId,
      price: 0.001,
      plays: track.playCount || 0,
      genre: track.genre,
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