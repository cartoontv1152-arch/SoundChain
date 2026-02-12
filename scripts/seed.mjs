import mongoose from 'mongoose';
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;

const TrackSchema = new mongoose.Schema({
  title: String,
  artist: String,
  artistAddress: String,
  duration: Number,
  genre: String,
  coverUrl: String,
  audioUrl: String,
  plays: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  ipfsHash: String,
  isNFT: { type: Boolean, default: false },
  nftTokenId: String,
  price: { type: Number, default: 0 },
});

const ArtistSchema = new mongoose.Schema({
  username: String,
  displayName: String,
  walletAddress: String,
  bio: String,
  avatarUrl: String,
  coverUrl: String,
  isVerified: { type: Boolean, default: false },
  followers: { type: Number, default: 0 },
  totalPlays: { type: Number, default: 0 },
  joinedAt: { type: Date, default: Date.now },
});

const PlaylistSchema = new mongoose.Schema({
  name: String,
  description: String,
  coverUrl: String,
  tracks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Track' }],
  createdBy: String,
  isPublic: { type: Boolean, default: true },
  followers: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const Track = mongoose.models.Track || mongoose.model('Track', TrackSchema);
const Artist = mongoose.models.Artist || mongoose.model('Artist', ArtistSchema);
const Playlist = mongoose.models.Playlist || mongoose.model('Playlist', PlaylistSchema);

// Free audio samples from various CC0/public domain sources
const tracks = [
  {
    title: "Midnight Drive",
    artist: "Neon Pulse",
    artistAddress: "0x10ac9924a78051BdD770978740C5084205cdB628",
    duration: 234,
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 15420,
    likes: 892,
  },
  {
    title: "Ocean Waves",
    artist: "Azure Dreams",
    artistAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    duration: 198,
    genre: "Ambient",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 23150,
    likes: 1456,
  },
  {
    title: "Urban Jungle",
    artist: "BeatSmith",
    artistAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    duration: 267,
    genre: "Hip Hop",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 31200,
    likes: 2341,
  },
  {
    title: "Starlight Sonata",
    artist: "Luna Keys",
    artistAddress: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    duration: 312,
    genre: "Classical",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    plays: 8760,
    likes: 654,
  },
  {
    title: "Neon Lights",
    artist: "Neon Pulse",
    artistAddress: "0x10ac9924a78051BdD770978740C5084205cdB628",
    duration: 245,
    genre: "Synthwave",
    coverUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    plays: 19340,
    likes: 1102,
  },
  {
    title: "Summer Breeze",
    artist: "Chill Factor",
    artistAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    duration: 189,
    genre: "Lo-Fi",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    plays: 42100,
    likes: 3210,
  },
  {
    title: "Thunder Road",
    artist: "Electric Storm",
    artistAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    duration: 278,
    genre: "Rock",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    plays: 27650,
    likes: 1987,
  },
  {
    title: "Rainy Afternoon",
    artist: "Chill Factor",
    artistAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    duration: 215,
    genre: "Lo-Fi",
    coverUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    plays: 35890,
    likes: 2567,
  },
  {
    title: "Digital Dreams",
    artist: "Cyber Wave",
    artistAddress: "0x14dC79964da2C08daa4968307923A4cD5B47Bbf6",
    duration: 256,
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    plays: 18920,
    likes: 1345,
  },
  {
    title: "Golden Hour",
    artist: "Sunset Collective",
    artistAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    duration: 201,
    genre: "Indie",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3",
    plays: 14560,
    likes: 976,
  },
  {
    title: "Bass Drop",
    artist: "BeatSmith",
    artistAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    duration: 223,
    genre: "Dubstep",
    coverUrl: "https://images.unsplash.com/photo-1504898770365-14faca6a7320?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3",
    plays: 28340,
    likes: 2100,
  },
  {
    title: "Peaceful Mind",
    artist: "Azure Dreams",
    artistAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    duration: 342,
    genre: "Ambient",
    coverUrl: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3",
    plays: 19870,
    likes: 1432,
  },
  {
    title: "City Lights",
    artist: "Neon Pulse",
    artistAddress: "0x10ac9924a78051BdD770978740C5084205cdB628",
    duration: 231,
    genre: "Synthwave",
    coverUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    plays: 22100,
    likes: 1678,
  },
  {
    title: "Funk Machine",
    artist: "Groove Theory",
    artistAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    duration: 287,
    genre: "Funk",
    coverUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3",
    plays: 16780,
    likes: 1234,
  },
  {
    title: "Morning Coffee",
    artist: "Chill Factor",
    artistAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    duration: 176,
    genre: "Lo-Fi",
    coverUrl: "https://images.unsplash.com/photo-1485579149621-3123dd979885?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3",
    plays: 51200,
    likes: 4321,
  },
  {
    title: "Electric Feel",
    artist: "Cyber Wave",
    artistAddress: "0x14dC79964da2C08daa4968307923A4cD5B47Bbf6",
    duration: 249,
    genre: "Electronic",
    coverUrl: "https://images.unsplash.com/photo-1550291652-6ea9114a47b1?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3",
    plays: 13450,
    likes: 987,
  },
  {
    title: "Velvet Night",
    artist: "Luna Keys",
    artistAddress: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    duration: 298,
    genre: "Jazz",
    coverUrl: "https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    plays: 9870,
    likes: 756,
  },
  {
    title: "Pixel Paradise",
    artist: "Neon Pulse",
    artistAddress: "0x10ac9924a78051BdD770978740C5084205cdB628",
    duration: 210,
    genre: "Chiptune",
    coverUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    plays: 11230,
    likes: 845,
  },
  {
    title: "Desert Wind",
    artist: "Sunset Collective",
    artistAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    duration: 265,
    genre: "World",
    coverUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    plays: 7650,
    likes: 543,
  },
  {
    title: "Gravity",
    artist: "Electric Storm",
    artistAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    duration: 302,
    genre: "Alt Rock",
    coverUrl: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    plays: 21340,
    likes: 1678,
  },
  {
    title: "Floating",
    artist: "Azure Dreams",
    artistAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    duration: 283,
    genre: "Dream Pop",
    coverUrl: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    plays: 16540,
    likes: 1123,
  },
  {
    title: "Trap Kingdom",
    artist: "BeatSmith",
    artistAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    duration: 195,
    genre: "Trap",
    coverUrl: "https://images.unsplash.com/photo-1571974599782-87624638275e?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    plays: 38900,
    likes: 2890,
  },
  {
    title: "Crystal Clear",
    artist: "Groove Theory",
    artistAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    duration: 241,
    genre: "House",
    coverUrl: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
    plays: 25670,
    likes: 1876,
  },
  {
    title: "Sunset Boulevard",
    artist: "Sunset Collective",
    artistAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    duration: 218,
    genre: "Indie Pop",
    coverUrl: "https://images.unsplash.com/photo-1429514513361-8fa32282fd5f?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    plays: 12340,
    likes: 934,
  },
  {
    title: "Deep Space",
    artist: "Cyber Wave",
    artistAddress: "0x14dC79964da2C08daa4968307923A4cD5B47Bbf6",
    duration: 334,
    genre: "Space Ambient",
    coverUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400&h=400&fit=crop",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
    plays: 8920,
    likes: 678,
  },
];

const artistsData = [
  {
    username: "neonpulse",
    displayName: "Neon Pulse",
    walletAddress: "0x10ac9924a78051BdD770978740C5084205cdB628",
    bio: "Synthwave producer crafting retro-futuristic soundscapes",
    avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 12500,
    totalPlays: 68090,
  },
  {
    username: "azuredreams",
    displayName: "Azure Dreams",
    walletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f2bD18",
    bio: "Ambient artist exploring the boundaries of sound and space",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 8900,
    totalPlays: 59560,
  },
  {
    username: "beatsmith",
    displayName: "BeatSmith",
    walletAddress: "0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
    bio: "Hip-hop & trap producer. Beats that hit different.",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 15600,
    totalPlays: 98440,
  },
  {
    username: "lunakeys",
    displayName: "Luna Keys",
    walletAddress: "0xdD2FD4581271e230360230F9337D5c0430Bf44C0",
    bio: "Classical meets modern. Piano-driven compositions.",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=800&h=400&fit=crop",
    isVerified: false,
    followers: 4500,
    totalPlays: 18630,
  },
  {
    username: "chillfactor",
    displayName: "Chill Factor",
    walletAddress: "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
    bio: "Lo-fi beats to relax/study to. Cozy vibes only.",
    avatarUrl: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 28900,
    totalPlays: 129190,
  },
  {
    username: "electricstorm",
    displayName: "Electric Storm",
    walletAddress: "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
    bio: "Rock & alternative. Loud and proud.",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?w=800&h=400&fit=crop",
    isVerified: false,
    followers: 9800,
    totalPlays: 48990,
  },
  {
    username: "cyberwave",
    displayName: "Cyber Wave",
    walletAddress: "0x14dC79964da2C08daa4968307923A4cD5B47Bbf6",
    bio: "Electronic music from the future. Immersive audio experiences.",
    avatarUrl: "https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 7200,
    totalPlays: 41290,
  },
  {
    username: "sunsetcollective",
    displayName: "Sunset Collective",
    walletAddress: "0x23618e81E3f5cdF7f54C3d65f7FBc0aBf5B21E8f",
    bio: "Indie vibes and sunset soundtracks. Music for golden hours.",
    avatarUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800&h=400&fit=crop",
    isVerified: false,
    followers: 5600,
    totalPlays: 34550,
  },
  {
    username: "groovetheory",
    displayName: "Groove Theory",
    walletAddress: "0xa0Ee7A142d267C1f36714E4a8F75612F20a79720",
    bio: "Funk, house, and everything groovy. Make you move.",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
    coverUrl: "https://images.unsplash.com/photo-1511735111819-9a3f7709049c?w=800&h=400&fit=crop",
    isVerified: true,
    followers: 11200,
    totalPlays: 42450,
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Clear existing data
  await Track.deleteMany({});
  await Artist.deleteMany({});
  await Playlist.deleteMany({});
  console.log("Cleared existing data.");

  // Insert artists
  const insertedArtists = await Artist.insertMany(artistsData);
  console.log(`Inserted ${insertedArtists.length} artists.`);

  // Insert tracks
  const insertedTracks = await Track.insertMany(tracks);
  console.log(`Inserted ${insertedTracks.length} tracks.`);

  // Create playlists
  const lofiTracks = insertedTracks.filter(t => t.genre === 'Lo-Fi');
  const electronicTracks = insertedTracks.filter(t => ['Electronic', 'Synthwave', 'Chiptune'].includes(t.genre));
  const chillTracks = insertedTracks.filter(t => ['Ambient', 'Lo-Fi', 'Dream Pop', 'Space Ambient'].includes(t.genre));

  const playlists = [
    {
      name: "Lo-Fi Chill Beats",
      description: "Perfect beats for studying and relaxing",
      coverUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&h=400&fit=crop",
      tracks: lofiTracks.map(t => t._id),
      createdBy: "system",
      followers: 5420,
    },
    {
      name: "Electronic Essentials",
      description: "The best electronic tracks on SoundChain",
      coverUrl: "https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=400&h=400&fit=crop",
      tracks: electronicTracks.map(t => t._id),
      createdBy: "system",
      followers: 3210,
    },
    {
      name: "Chill Vibes",
      description: "Ambient and dreamy soundscapes",
      coverUrl: "https://images.unsplash.com/photo-1446057032654-9d8885db76c6?w=400&h=400&fit=crop",
      tracks: chillTracks.map(t => t._id),
      createdBy: "system",
      followers: 8760,
    },
    {
      name: "Top Hits 2026",
      description: "Most played tracks this month",
      coverUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop",
      tracks: insertedTracks.sort((a, b) => b.plays - a.plays).slice(0, 10).map(t => t._id),
      createdBy: "system",
      followers: 12340,
    },
    {
      name: "New Discoveries",
      description: "Fresh tracks from emerging artists",
      coverUrl: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=400&h=400&fit=crop",
      tracks: insertedTracks.sort((a, b) => a.plays - b.plays).slice(0, 8).map(t => t._id),
      createdBy: "system",
      followers: 2340,
    },
  ];

  const insertedPlaylists = await Playlist.insertMany(playlists);
  console.log(`Inserted ${insertedPlaylists.length} playlists.`);

  console.log("\nSeed complete!");
  console.log(`  Tracks: ${insertedTracks.length}`);
  console.log(`  Artists: ${insertedArtists.length}`);
  console.log(`  Playlists: ${insertedPlaylists.length}`);

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
