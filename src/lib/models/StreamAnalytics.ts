import mongoose from 'mongoose';

const StreamAnalyticsSchema = new mongoose.Schema({
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
    required: true,
  },
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  walletAddress: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
  duration: Number, // Duration played in seconds
  completed: Boolean, // Did user listen to at least 30 seconds?
  country: String,
  device: String,
  earnedAmount: Number, // Amount earned by artist from this stream
}, { timestamps: true });

StreamAnalyticsSchema.index({ artistId: 1, timestamp: -1 });
StreamAnalyticsSchema.index({ trackId: 1, timestamp: -1 });

export const StreamAnalytics = mongoose.models.StreamAnalytics || mongoose.model('StreamAnalytics', StreamAnalyticsSchema);
