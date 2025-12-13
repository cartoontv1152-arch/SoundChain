"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowLeft } from 'lucide-react';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/lib/types';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/lib/player-context';

export default function LikedSongsPage() {
  const { likedTracks } = usePlayer();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikedTracks = async () => {
      if (likedTracks.length === 0) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/tracks?limit=100');
        const data = await response.json();
        
        const filtered = (data.tracks || []).filter((track: Track) => 
          likedTracks.includes(track.id || track._id || '')
        );
        setTracks(filtered);
      } catch (error) {
        console.error('Error fetching liked tracks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLikedTracks();
  }, [likedTracks]);

  return (
    <div className="min-h-screen pb-24">
      <div className="bg-gradient-to-b from-[#5038a0] via-[#5038a0]/50 to-transparent pt-6 px-8 pb-8">
        <Link href="/library">
          <Button variant="ghost" size="icon" className="mb-4 hover:bg-white/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        
        <div className="flex items-center gap-6 mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-52 h-52 rounded-lg bg-gradient-to-br from-[#450af5] to-[#c4a0ff] flex items-center justify-center shadow-2xl"
          >
            <Heart className="w-24 h-24 text-white fill-white" />
          </motion.div>
          <div>
            <span className="text-sm text-white/80 uppercase font-medium">Playlist</span>
            <h1 className="text-6xl font-bold text-white mt-2 mb-6">Liked Songs</h1>
            <p className="text-white/70">
              {loading ? 'Loading...' : `${tracks.length} songs`}
            </p>
          </div>
        </div>
      </div>

      <div className="px-8">
        {loading ? (
          <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
              <div key={`skeleton-${i}`} className="animate-pulse flex items-center gap-4 p-4">
                <div className="w-12 h-12 bg-[#282828] rounded" />
                <div className="flex-1">
                  <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                  <div className="h-3 bg-[#282828] rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : tracks.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            {tracks.map((track, index) => (
              <TrackCard key={track.id || track._id} track={track} variant="list" index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <Heart className="w-16 h-16 text-[#b3b3b3] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">No liked songs yet</h3>
            <p className="text-[#b3b3b3] mb-6">Start liking songs to build your collection</p>
            <Link href="/discover">
              <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full px-8">
                Discover Music
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}