import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  email: String,
  username: String,
  avatar: String,
  isArtist: {
    type: Boolean,
    default: false,
  },
  likedTracks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
  }],
  playlists: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Playlist',
  }],
  subscriptionStatus: {
    type: String,
    enum: ['free', 'trial', 'premium'],
    default: 'free',
  },
  trialEndsAt: Date,
  premiumEndsAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

export const User = mongoose.models.User || mongoose.model('User', UserSchema);
