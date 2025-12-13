import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Artist } from '@/lib/models/Artist';

// Get artist profile
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet');
    const artistId = searchParams.get('id');
    const search = searchParams.get('search');

    if (artistId) {
      const artist = await Artist.findById(artistId);
      return NextResponse.json({ artist });
    }

    if (walletAddress) {
      const artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
      return NextResponse.json({ artist });
    }

    // Build query with search filter if provided
    const query: any = {};
    if (search) {
      query.artistName = { $regex: search, $options: 'i' };
    }

    // Get all artists with optional search filter
    const artists = await Artist.find(query).sort({ totalStreams: -1 }).limit(50);
    return NextResponse.json({ artists });
  } catch (error: any) {
    console.error('Error fetching artists:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Create artist profile (onboarding)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, artistName, bio, genres, avatar, socialLinks } = body;

    if (!walletAddress || !artistName) {
      return NextResponse.json(
        { error: 'Wallet address and artist name required' },
        { status: 400 }
      );
    }

    // Find or create user
    let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!user) {
      user = await User.create({
        walletAddress: walletAddress.toLowerCase(),
        isArtist: true,
      });
    } else {
      user.isArtist = true;
      await user.save();
    }

    // Check if artist profile already exists
    let artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (artist) {
      return NextResponse.json(
        { error: 'Artist profile already exists' },
        { status: 400 }
      );
    }

    // Create artist profile
    artist = await Artist.create({
      userId: user._id,
      walletAddress: walletAddress.toLowerCase(),
      artistName,
      bio,
      genres: genres || [],
      avatar,
      socialLinks: socialLinks || {},
    });

    return NextResponse.json({ artist }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating artist:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Update artist profile
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { walletAddress, ...updates } = body;

    if (!walletAddress) {
      return NextResponse.json({ error: 'Wallet address required' }, { status: 400 });
    }

    const artist = await Artist.findOneAndUpdate(
      { walletAddress: walletAddress.toLowerCase() },
      updates,
      { new: true }
    );

    if (!artist) {
      return NextResponse.json({ error: 'Artist not found' }, { status: 404 });
    }

    return NextResponse.json({ artist });
  } catch (error: any) {
    console.error('Error updating artist:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}