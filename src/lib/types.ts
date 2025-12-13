export interface Track {
  id: string;
  title: string;
  artist: string;
  artistAddress: string;
  album?: string;
  duration: number;
  coverUrl: string;
  audioUrl: string;
  ipfsHash?: string;
  nftTokenId?: string;
  price: number;
  plays: number;
  genre: string;
  createdAt: Date;
}

export interface User {
  id: string;
  address?: string;
  name: string;
  email?: string;
  avatar?: string;
  isArtist: boolean;
  subscriptionStatus: 'free' | 'trial' | 'active' | 'expired';
  trialEndsAt?: Date;
  subscriptionEndsAt?: Date;
  streamsRemaining?: number;
  totalEarnings?: number;
  createdAt: Date;
}

export interface Playlist {
  id: string;
  name: string;
  description?: string;
  coverUrl?: string;
  userId: string;
  tracks: Track[];
  isPublic: boolean;
  createdAt: Date;
}

export interface ListeningHistory {
  id: string;
  userId: string;
  trackId: string;
  track?: Track;
  playedAt: Date;
  duration: number;
}

export interface PaymentInfo {
  id: string;
  userId: string;
  artistId: string;
  trackId: string;
  amount: number;
  currency: string;
  txHash?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface PlayerState {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  progress: number;
  duration: number;
  queue: Track[];
  shuffled: boolean;
  repeat: 'none' | 'one' | 'all';
}
