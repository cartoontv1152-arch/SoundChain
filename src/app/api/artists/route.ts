import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Artist } from '@/lib/models/Artist';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const wallet = request.nextUrl.searchParams.get('wallet');

    // If wallet query param, return single artist
    if (wallet) {
      const artist = await Artist.findOne({ walletAddress: wallet.toLowerCase() }).lean();
      if (!artist) {
        return NextResponse.json({ artist: null });
      }
      return NextResponse.json({
        artist: {
          id: (artist as any)._id.toString(),
          artistName: (artist as any).artistName,
          walletAddress: (artist as any).walletAddress,
          bio: (artist as any).bio,
          avatar: (artist as any).avatar || '',
          genres: (artist as any).genres || [],
          trackCount: (artist as any).trackCount || 0,
          totalStreams: (artist as any).totalStreams || 0,
          totalEarnings: (artist as any).totalEarnings || 0,
          availableBalance: (artist as any).availableBalance || 0,
          verified: (artist as any).verified || false,
          socialLinks: (artist as any).socialLinks || {},
          createdAt: (artist as any).createdAt,
        },
      });
    }

    // Otherwise return all artists
    const artists = await Artist.find({}).sort({ totalStreams: -1 }).lean();
    const formatted = artists.map((a: any) => ({
      id: a._id.toString(),
      displayName: a.artistName,
      walletAddress: a.walletAddress,
      bio: a.bio,
      avatarUrl: a.avatar || '',
      isVerified: a.verified || false,
      totalPlays: a.totalStreams || 0,
      genres: a.genres || [],
    }));
    return NextResponse.json(formatted);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { walletAddress, artistName, bio, genres, socialLinks } = body;

    if (!walletAddress || !artistName) {
      return NextResponse.json(
        { error: 'walletAddress and artistName are required' },
        { status: 400 }
      );
    }

    // Check if artist already exists
    const existing = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { error: 'Artist profile already exists for this wallet' },
        { status: 409 }
      );
    }

    const artist = await Artist.create({
      walletAddress: walletAddress.toLowerCase(),
      artistName,
      bio: bio || '',
      genres: genres || [],
      socialLinks: socialLinks || {},
    });

    return NextResponse.json(
      {
        id: artist._id.toString(),
        artistName: artist.artistName,
        walletAddress: artist.walletAddress,
        message: 'Artist profile created successfully',
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating artist:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
