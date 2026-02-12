import mongoose from 'mongoose';

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  coverUrl: String,
  coverImage: String,
  createdBy: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  tracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
  }],
  isPublic: {
    type: Boolean,
    default: true,
  },
  followers: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export default mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);
