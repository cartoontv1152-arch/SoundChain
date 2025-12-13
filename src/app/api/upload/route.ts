import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Artist } from '@/lib/models/Artist';
import { Track } from '@/lib/models/Track';
import { uploadToPinata, uploadJSONToPinata } from '@/lib/pinata';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    
    const formData = await req.formData();
    const audioFile = formData.get('audio') as File;
    const coverImage = formData.get('cover') as File | null;
    const title = formData.get('title') as string;
    const album = formData.get('album') as string;
    const genre = formData.get('genre') as string;
    const description = formData.get('description') as string;
    const artistAddress = formData.get('artistAddress') as string;

    if (!audioFile || !title || !genre || !artistAddress) {
      return NextResponse.json(
        { error: 'Missing required fields: audio, title, genre, artistAddress' },
        { status: 400 }
      );
    }

    // Verify artist exists
    const artist = await Artist.findOne({ walletAddress: artistAddress.toLowerCase() });
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist profile not found. Please create artist profile first.' },
        { status: 404 }
      );
    }

    // Calculate duration from audio metadata (approximate from file size)
    const duration = Math.floor((audioFile.size / 128000) * 8); // Rough estimate for 128kbps MP3

    // Upload audio to Pinata
    const audioBuffer = Buffer.from(await audioFile.arrayBuffer());
    const audioUpload = await uploadToPinata(audioBuffer, audioFile.name, {
      type: 'audio',
      title,
      artist: artist.artistName,
    });

    // Upload or create cover image
    let coverHash: string;
    if (coverImage) {
      const coverBuffer = Buffer.from(await coverImage.arrayBuffer());
      const coverUpload = await uploadToPinata(coverBuffer, coverImage.name, {
        type: 'cover',
        title,
      });
      coverHash = coverUpload.IpfsHash;
    } else {
      // Use a placeholder image from Unsplash
      coverHash = 'QmPlaceholder';
    }

    // Create metadata JSON for NFT
    const metadata = {
      name: title,
      description: description || `${title} by ${artist.artistName}`,
      image: coverImage ? `ipfs://${coverHash}` : 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600',
      audio: `ipfs://${audioUpload.IpfsHash}`,
      attributes: [
        { trait_type: 'Artist', value: artist.artistName },
        { trait_type: 'Genre', value: genre },
        { trait_type: 'Duration', value: duration },
        { trait_type: 'Album', value: album || 'Single' },
      ],
    };

    const metadataUpload = await uploadJSONToPinata(metadata, `${title}-metadata.json`);

    // Create track in database
    const track = await Track.create({
      title,
      artistId: artist._id,
      artistName: artist.artistName,
      album: album || 'Single',
      genre,
      duration,
      coverImage: coverImage ? coverHash : 'unsplash',
      audioFile: audioUpload.IpfsHash,
      ipfsGatewayUrl: `https://gateway.pinata.cloud/ipfs/${audioUpload.IpfsHash}`,
      description: description || '',
      isPublic: true,
      playCount: 0,
      likeCount: 0,
    });

    // Update artist track count
    await Artist.findByIdAndUpdate(artist._id, {
      $inc: { trackCount: 1 }
    });

    return NextResponse.json({
      track,
      ipfs: {
        audio: audioUpload.IpfsHash,
        cover: coverHash,
        metadata: metadataUpload.IpfsHash,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error uploading track:', error);
    return NextResponse.json({ error: error.message || 'Upload failed' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};