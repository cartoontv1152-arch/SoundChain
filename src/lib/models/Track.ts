import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  album: String,
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: Number, // in seconds
    required: true,
  },
  coverImage: {
    type: String, // IPFS hash or URL
    required: true,
  },
  audioFile: {
    type: String, // IPFS hash from Pinata
    required: true,
  },
  ipfsGatewayUrl: String, // Full Pinata gateway URL
  description: String,
  lyrics: String,
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  nftTokenId: String, // Blockchain NFT token ID (optional)
  isPublic: {
    type: Boolean,
    default: true,
  },
  tags: [String],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

TrackSchema.index({ artistId: 1, createdAt: -1 });
TrackSchema.index({ genre: 1, playCount: -1 });
TrackSchema.index({ audioFile: 1 }); // Index audioFile (IPFS hash) without unique constraint

export const Track = mongoose.models.Track || mongoose.model('Track', TrackSchema);