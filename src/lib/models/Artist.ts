import mongoose from 'mongoose';

const ArtistSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  artistName: {
    type: String,
    required: true,
  },
  bio: String,
  avatar: String,
  banner: String,
  genres: [String],
  socialLinks: {
    twitter: String,
    instagram: String,
    website: String,
  },
  trackCount: {
    type: Number,
    default: 0,
  },
  totalStreams: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  availableBalance: {
    type: Number,
    default: 0,
  },
  withdrawnAmount: {
    type: Number,
    default: 0,
  },
  pricePerStream: {
    type: Number,
    default: 0.001, // $0.001 per stream
  },
  verified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);