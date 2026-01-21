"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Clock, ChevronRight, Zap, Shield, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackCard } from '@/components/TrackCard';
import Link from 'next/link';
import { Track } from '@/lib/types';
import { toast } from 'sonner';

const genres = ['Electronic', 'Hip-Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Country', 'Reggae', 'Metal'];

export default function Home() {
  const [trendingTracks, setTrendingTracks] = useState<Track[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch('/api/tracks?limit=10&sort=plays');
        const data = await response.json();
        setTrendingTracks(data.tracks || []);
        
        const recentResponse = await fetch('/api/tracks?limit=5&sort=createdAt');
        const recentData = await recentResponse.json();
        setRecentTracks(recentData.tracks || []);
      } catch (error) {
        console.error('Error fetching tracks:', error);
        toast.error('Failed to load tracks', {
          description: 'Please refresh the page to try again.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="relative h-[500px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#1DB954]/30 via-[#121212] to-[#121212]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1DB954]/20 via-transparent to-transparent" />
        
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
        
        {/* Decorative elements */}
        <div className="absolute top-20 right-20 w-72 h-72 bg-[#1DB954]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-[#1DB954]/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 h-full flex flex-col justify-center px-8 max-w-4xl"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 mb-6 w-fit"
          >
            <Zap className="w-4 h-4 text-[#1DB954]" />
            <span className="text-sm text-white/90">Powered by Blockchain</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Music Streaming,
            <br />
            <span className="text-[#1DB954]">Decentralized</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-[#b3b3b3] mb-8 max-w-xl">
            Stream unlimited music. Support artists directly with crypto payments. 
            Own your favorites as NFTs.
          </p>

          <div className="flex items-center gap-4 flex-wrap">
            <Link href="/discover">
              <Button 
                size="lg" 
                className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold px-8 h-14 text-lg rounded-full shadow-lg hover:shadow-[#1DB954]/50 transition-all"
              >
                <Play className="w-5 h-5 mr-2 fill-current" />
                Explore Music
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button 
                size="lg" 
                variant="outline"
                className="border-white/20 hover:bg-white/10 text-white font-semibold px-8 h-14 text-lg rounded-full backdrop-blur-sm"
              >
                Dashboard
              </Button>
            </Link>
          </div>

          <div className="flex items-center gap-8 mt-8">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#1DB954]" />
              <span className="text-sm text-white/70">Connect wallet to play</span>
            </div>
            <div className="flex items-center gap-2">
              <Coins className="w-5 h-5 text-[#1DB954]" />
              <span className="text-sm text-white/70">90%+ to artists</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="absolute right-8 top-1/2 -translate-y-1/2 hidden lg:block"
        >
          <div className="relative">
            <div className="w-80 h-80 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600" 
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -left-4 w-72 h-72 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:rotate-0 transition-transform duration-500">
              <img 
                src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600" 
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -top-4 -left-8 w-64 h-64 rounded-2xl bg-[#1DB954]/20 blur-3xl" />
          </div>
        </motion.div>
      </section>

      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-[#1DB954]" />
            <h2 className="text-2xl font-bold text-white">Trending Now</h2>
          </div>
          <Link href="/discover" className="flex items-center gap-1 text-sm text-[#b3b3b3] hover:text-white transition-colors">
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-trending-${i}`} className="animate-pulse">
                <div className="aspect-square bg-[#282828] rounded-lg mb-4" />
                <div className="h-4 bg-[#282828] rounded w-3/4 mb-2" />
                <div className="h-3 bg-[#282828] rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : trendingTracks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {trendingTracks.slice(0, 5).map((track, index) => (
              <TrackCard key={track.id || track._id} track={track} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3]">No tracks available yet. Be the first artist to upload!</p>
            <Link href="/artist">
              <Button className="mt-4 bg-[#1DB954] hover:bg-[#1ed760] text-black">
                Become an Artist
              </Button>
            </Link>
          </div>
        )}
      </section>

      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Browse by Genre</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {genres.map((genre, index) => (
            <motion.div
              key={genre}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={`/discover?genre=${genre}`}>
                <div className="relative h-24 rounded-lg overflow-hidden group cursor-pointer">
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, hsl(${index * 36}, 70%, 40%), hsl(${index * 36 + 30}, 70%, 30%))`,
                    }}
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  <span className="absolute bottom-3 left-4 text-white font-bold">{genre}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="px-8 py-12">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Clock className="w-6 h-6 text-[#1DB954]" />
            <h2 className="text-2xl font-bold text-white">Recently Added</h2>
          </div>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={`skeleton-recent-${i}`} className="animate-pulse flex items-center gap-4 p-4">
                <div className="w-10 h-10 bg-[#282828] rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#282828] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : recentTracks.length > 0 ? (
          <div className="space-y-2">
            {recentTracks.map((track, index) => (
              <TrackCard key={track.id || track._id} track={track} variant="list" index={index} />
            ))}
          </div>
        ) : (
          <p className="text-center text-[#b3b3b3] py-12">No tracks available yet</p>
        )}
      </section>

      <section className="px-4 sm:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#1DB954] to-[#169c46]" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
          
          <div className="relative z-10 px-12 py-16 flex items-center justify-between">
            <div>
              <h3 className="text-4xl font-bold text-black mb-4">
                Ready to share your music?
              </h3>
              <p className="text-black/70 text-lg max-w-md">
                Upload your tracks, mint as NFTs, and earn directly from your fans.
                90%+ of all earnings go to you.
              </p>
            </div>
            <Link href="/artist">
              <Button 
                size="lg"
                className="bg-black hover:bg-black/90 text-white font-semibold px-8 h-14 text-lg rounded-full"
              >
                Become an Artist
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}