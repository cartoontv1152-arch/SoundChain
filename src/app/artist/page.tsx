"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Upload,
  Music,
  DollarSign,
  TrendingUp,
  Users,
  PlayCircle,
  Wallet,
  FileAudio,
  Image as ImageIcon,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { TrackCard } from '@/components/TrackCard';
import { cn } from '@/lib/utils';
import { Track } from '@/lib/types';

const genres = ['Electronic', 'Hip-Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Country', 'Reggae', 'Metal'];

export default function ArtistDashboard() {
  const [uploadState, setUploadState] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [artistTracks, setArtistTracks] = useState<Track[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [artistInfo, setArtistInfo] = useState<any>(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    album: '',
    genre: '',
    description: '',
    price: '0.001',
  });

  useEffect(() => {
    const checkWallet = () => {
      if (typeof window !== 'undefined' && window.ethereum && window.ethereum.selectedAddress) {
        setWalletAddress(window.ethereum.selectedAddress);
      }
    };
    checkWallet();
  }, []);

  useEffect(() => {
    if (walletAddress) {
      fetchArtistData();
    }
  }, [walletAddress]);

  const fetchArtistData = async () => {
    try {
      setLoading(true);
      
      // Fetch artist info
      const artistResponse = await fetch(`/api/artists?wallet=${walletAddress}`);
      const artistData = await artistResponse.json();
      setArtistInfo(artistData.artist);

      // Fetch artist tracks
      const tracksResponse = await fetch(`/api/tracks?artistAddress=${walletAddress}`);
      const tracksData = await tracksResponse.json();
      setArtistTracks(tracksData.tracks || []);

      // Fetch analytics
      const analyticsResponse = await fetch(`/api/analytics?artistAddress=${walletAddress}`);
      const analyticsData = await analyticsResponse.json();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Error fetching artist data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!audioFile || !walletAddress || !formData.title || !formData.genre) {
      alert('Please fill in all required fields and upload an audio file');
      return;
    }

    try {
      setUploadState('uploading');
      setUploadProgress(0);

      const formDataToSend = new FormData();
      formDataToSend.append('audio', audioFile);
      if (coverFile) formDataToSend.append('cover', coverFile);
      formDataToSend.append('title', formData.title);
      formDataToSend.append('album', formData.album || '');
      formDataToSend.append('genre', formData.genre);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('artistAddress', walletAddress);

      setUploadProgress(30);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataToSend,
      });

      setUploadProgress(90);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      console.log('Upload result:', result);

      setUploadProgress(100);
      setUploadState('success');

      setFormData({ title: '', album: '', genre: '', description: '', price: '0.001' });
      setAudioFile(null);
      setCoverFile(null);

      await fetchArtistData();

      setTimeout(() => {
        setUploadState('idle');
        setUploadProgress(0);
      }, 3000);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadState('error');
      setTimeout(() => setUploadState('idle'), 3000);
    }
  };

  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Wallet className="w-16 h-16 text-[#1DB954] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
          <p className="text-[#b3b3b3]">Please connect your wallet to access the artist dashboard</p>
        </div>
      </div>
    );
  }

  const totalStreams = analytics?.totalStreams || 0;
  const totalEarnings = analytics?.totalEarnings || 0;
  const monthlyListeners = analytics?.monthlyListeners || 0;
  const trackCount = artistTracks.length;

  const stats = [
    { 
      label: 'Total Streams', 
      value: totalStreams.toLocaleString(), 
      icon: PlayCircle, 
      change: totalStreams > 0 ? '+12%' : '0%' 
    },
    { 
      label: 'Total Earnings', 
      value: `$${totalEarnings.toFixed(2)}`, 
      icon: DollarSign, 
      change: totalEarnings > 0 ? '+8%' : '0%' 
    },
    { 
      label: 'Monthly Listeners', 
      value: monthlyListeners.toLocaleString(), 
      icon: Users, 
      change: monthlyListeners > 0 ? '+23%' : '0%' 
    },
    { 
      label: 'Track Count', 
      value: trackCount.toString(), 
      icon: Music, 
      change: trackCount > 0 ? `+${trackCount}` : '0' 
    },
  ];

  return (
    <div className="min-h-screen pb-8">
      <div className="relative h-48 bg-gradient-to-r from-[#1DB954] via-[#169c46] to-[#0f6b30]">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 h-full flex items-end px-8 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-[#282828] border-4 border-[#121212] overflow-hidden flex items-center justify-center">
              {artistInfo?.avatar ? (
                <img
                  src={artistInfo.avatar}
                  alt="Artist"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#1DB954] to-[#169c46] flex items-center justify-center text-white text-3xl font-bold">
                  {artistInfo?.artistName?.[0]?.toUpperCase() || walletAddress?.[2]?.toUpperCase() || 'A'}
                </div>
              )}
            </div>
            <div>
              <span className="text-sm text-white/80 uppercase tracking-wider">Artist Dashboard</span>
              <h1 className="text-3xl font-bold text-white">
                {artistInfo?.artistName || `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`}
              </h1>
            </div>
          </div>
        </div>
      </div>

      <div className="px-8 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="bg-[#181818] border-white/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <stat.icon className="w-8 h-8 text-[#1DB954]" />
                    <span className="text-sm text-[#1DB954] font-medium">{stat.change}</span>
                  </div>
                  <p className="text-3xl font-bold text-white mt-4">{stat.value}</p>
                  <p className="text-sm text-[#b3b3b3] mt-1">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="bg-[#282828] border-white/5">
            <TabsTrigger value="upload" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <Upload className="w-4 h-4 mr-2" />
              Upload Music
            </TabsTrigger>
            <TabsTrigger value="tracks" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <Music className="w-4 h-4 mr-2" />
              My Tracks ({trackCount})
            </TabsTrigger>
            <TabsTrigger value="earnings" className="data-[state=active]:bg-[#1DB954] data-[state=active]:text-black">
              <DollarSign className="w-4 h-4 mr-2" />
              Earnings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card className="bg-[#181818] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Upload New Track</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label
                      className={cn(
                        "border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer block",
                        "border-white/10 hover:border-[#1DB954]/50",
                        audioFile && "border-[#1DB954]"
                      )}
                    >
                      <input
                        type="file"
                        accept="audio/*"
                        onChange={(e) => setAudioFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <FileAudio className="w-12 h-12 text-[#b3b3b3] mx-auto mb-4" />
                      <p className="text-white font-medium mb-2">
                        {audioFile ? audioFile.name : 'Drop your audio file here'}
                      </p>
                      <p className="text-sm text-[#b3b3b3]">MP3, WAV, FLAC up to 50MB</p>
                    </label>
                  </div>

                  <div>
                    <label
                      className={cn(
                        "border-2 border-dashed rounded-xl p-6 text-center transition-colors cursor-pointer block",
                        "border-white/10 hover:border-[#1DB954]/50",
                        coverFile && "border-[#1DB954]"
                      )}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setCoverFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                      <ImageIcon className="w-8 h-8 text-[#b3b3b3] mx-auto mb-2" />
                      <p className="text-sm text-white">
                        {coverFile ? coverFile.name : 'Cover Art'}
                      </p>
                      <p className="text-xs text-[#b3b3b3]">PNG, JPG (1:1 ratio)</p>
                    </label>
                  </div>

                  <div className="space-y-4">
                    <Input
                      placeholder="Track Title *"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="bg-[#282828] border-0 text-white"
                    />

                    <Input
                      placeholder="Album Name (optional)"
                      value={formData.album}
                      onChange={(e) => setFormData({ ...formData, album: e.target.value })}
                      className="bg-[#282828] border-0 text-white"
                    />

                    <Select
                      value={formData.genre}
                      onValueChange={(value) => setFormData({ ...formData, genre: value })}
                    >
                      <SelectTrigger className="bg-[#282828] border-0 text-white">
                        <SelectValue placeholder="Select Genre *" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#282828] border-white/10">
                        {genres.map((genre) => (
                          <SelectItem key={genre} value={genre}>
                            {genre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Textarea
                      placeholder="Description (optional)"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="bg-[#282828] border-0 text-white resize-none"
                      rows={3}
                    />

                    <div>
                      <label className="text-sm text-[#b3b3b3] mb-2 block">Price per stream (USDC)</label>
                      <Input
                        type="number"
                        step="0.0001"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="bg-[#282828] border-0 text-white"
                      />
                    </div>
                  </div>

                  {uploadState === 'uploading' && (
                    <div className="space-y-2">
                      <Progress value={uploadProgress} className="h-2" />
                      <p className="text-sm text-[#b3b3b3] text-center">
                        Uploading to IPFS... {uploadProgress}%
                      </p>
                    </div>
                  )}

                  {uploadState === 'success' && (
                    <div className="flex items-center gap-2 text-[#1DB954] justify-center">
                      <CheckCircle className="w-5 h-5" />
                      <span>Upload successful!</span>
                    </div>
                  )}

                  {uploadState === 'error' && (
                    <div className="flex items-center gap-2 text-red-500 justify-center">
                      <span>Upload failed. Please try again.</span>
                    </div>
                  )}

                  <Button
                    onClick={handleUpload}
                    disabled={uploadState === 'uploading'}
                    className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold h-12"
                  >
                    {uploadState === 'uploading' ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload & Mint NFT
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-[#181818] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Blockchain Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 rounded-lg bg-[#282828]">
                    <div className="flex items-center gap-3 mb-4">
                      <Wallet className="w-5 h-5 text-[#1DB954]" />
                      <span className="text-white font-medium">Connected Wallet</span>
                    </div>
                    <p className="text-sm text-[#b3b3b3] font-mono break-all">
                      {walletAddress}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-[#b3b3b3]">Network</span>
                      <span className="text-white">Polygon Amoy</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#b3b3b3]">Storage</span>
                      <span className="text-white">IPFS via Pinata</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#b3b3b3]">NFT Standard</span>
                      <span className="text-white">ERC-721</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-[#b3b3b3]">Royalty</span>
                      <span className="text-[#1DB954]">90% to artist</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-lg bg-[#1DB954]/10 border border-[#1DB954]/20">
                    <h4 className="text-white font-medium mb-2">How it works</h4>
                    <ol className="text-sm text-[#b3b3b3] space-y-2 list-decimal list-inside">
                      <li>Upload your audio to IPFS via Pinata</li>
                      <li>Track metadata stored on MongoDB</li>
                      <li>Mint as NFT on Polygon Amoy</li>
                      <li>Earn ${formData.price} per 30+ second stream</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tracks">
            <Card className="bg-[#181818] border-white/5">
              <CardHeader>
                <CardTitle className="text-white">Your Tracks</CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-[#1DB954]" />
                  </div>
                ) : artistTracks.length > 0 ? (
                  <div className="space-y-2">
                    {artistTracks.map((track, index) => (
                      <TrackCard key={track.id} track={track} variant="list" index={index} />
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-[#b3b3b3] py-12">
                    No tracks yet. Upload your first track!
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2 bg-[#181818] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Earnings Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-[#b3b3b3]">
                    <TrendingUp className="w-12 h-12 mr-4" />
                    <div>
                      <p className="text-2xl font-bold text-white">
                        ${totalEarnings.toFixed(2)}
                      </p>
                      <p>Total earnings (${(totalStreams * 0.001).toFixed(2)} from {totalStreams} streams)</p>
                      <p className="text-xs mt-2">Rate: $0.001 per 30+ second stream</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-[#181818] border-white/5">
                <CardHeader>
                  <CardTitle className="text-white">Withdraw</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-lg bg-[#282828]">
                    <p className="text-sm text-[#b3b3b3]">Available Balance</p>
                    <p className="text-2xl font-bold text-white">
                      ${totalEarnings.toFixed(2)}
                    </p>
                    <p className="text-xs text-[#1DB954]">~{totalEarnings.toFixed(2)} USDC</p>
                  </div>
                  <Button 
                    disabled={totalEarnings === 0}
                    className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Withdraw via SideShift
                  </Button>
                  <p className="text-xs text-[#b3b3b3] text-center">
                    Withdraw to any crypto using SideShift
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}