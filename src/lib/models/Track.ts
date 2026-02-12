import mongoose from 'mongoose';

const TrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  artist: String,
  artistName: String,
  artistAddress: String,
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
  },
  album: String,
  genre: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  coverUrl: String,
  coverImage: String,
  audioUrl: String,
  audioFile: String,
  ipfsHash: String,
  ipfsGatewayUrl: String,
  description: String,
  lyrics: String,
  releaseDate: {
    type: Date,
    default: Date.now,
  },
  plays: {
    type: Number,
    default: 0,
  },
  playCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  likeCount: {
    type: Number,
    default: 0,
  },
  isNFT: {
    type: Boolean,
    default: false,
  },
  nftTokenId: String,
  price: {
    type: Number,
    default: 0,
  },
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

TrackSchema.index({ genre: 1, plays: -1 });
TrackSchema.index({ title: 'text', artist: 'text', genre: 'text' });

const Track = mongoose.models.Track || mongoose.model('Track', TrackSchema);
export { Track };
export default Track;
