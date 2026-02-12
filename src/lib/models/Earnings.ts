import mongoose from 'mongoose';

const EarningsSchema = new mongoose.Schema({
  artistId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Artist',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ['stream', 'tip', 'nft_sale', 'withdrawal'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  trackId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Track',
  },
  transactionHash: String,
  withdrawalAddress: String,
  withdrawalToken: String, // Token user chose for withdrawal
  sideshiftOrderId: String,
  notes: String,
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

EarningsSchema.index({ artistId: 1, timestamp: -1 });

export const Earnings = mongoose.models.Earnings || mongoose.model('Earnings', EarningsSchema);
