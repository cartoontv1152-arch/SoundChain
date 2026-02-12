"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Play, Heart, Crown, Medal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/lib/types';
import { cn } from '@/lib/utils';
import { usePlayer } from '@/lib/player-context';
import { toast } from 'sonner';

interface ChartArtist {
  id: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  isVerified: boolean;
  followers: number;
  totalPlays: number;
}

type TimeFilter = 'today' | 'week' | 'month' | 'all';

export default function ChartsPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<ChartArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'tracks' | 'artists'>('tracks');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const { playTrack, currentTrack, isPlaying } = usePlayer();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tracksRes, artistsRes] = await Promise.all([
          fetch('/api/tracks?sort=popular&limit=50'),
          fetch('/api/artists'),
        ]);
        const tracksData = await tracksRes.json();
        const artistsData = await artistsRes.json();
        setTracks(tracksData.tracks || []);
        setArtists(artistsData || []);
      } catch {
        toast.error('Failed to load charts');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (index === 1) return <Medal className="w-5 h-5 text-gray-300" />;
    if (index === 2) return <Medal className="w-5 h-5 text-amber-600" />;
    return <span className="text-[#b3b3b3] font-mono text-sm w-5 text-center">{index + 1}</span>;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#1DB954] to-[#1ed760] flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Charts</h1>
        </div>
        <p className="text-[#b3b3b3]">Top tracks and artists on SoundChain</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-[#282828] rounded-full p-1">
          <button
            onClick={() => setTab('tracks')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              tab === 'tracks' ? "bg-[#1DB954] text-white" : "text-[#b3b3b3] hover:text-white"
            )}
          >
            Top Tracks
          </button>
          <button
            onClick={() => setTab('artists')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              tab === 'artists' ? "bg-[#1DB954] text-white" : "text-[#b3b3b3] hover:text-white"
            )}
          >
            Top Artists
          </button>
        </div>

        <div className="flex gap-2 ml-auto">
          {(['all', 'month', 'week'] as TimeFilter[]).map((t) => (
            <Button
              key={t}
              variant="ghost"
              size="sm"
              onClick={() => setTimeFilter(t)}
              className={cn(
                "rounded-full text-xs capitalize",
                timeFilter === t ? "bg-white/10 text-white" : "text-[#b3b3b3]"
              )}
            >
              {t === 'all' ? 'All Time' : `This ${t}`}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-[#181818] rounded-lg">
              <div className="w-8 h-8 bg-[#282828] rounded" />
              <div className="w-12 h-12 bg-[#282828] rounded" />
              <div className="flex-1">
                <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#282828] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : tab === 'tracks' ? (
        <div className="space-y-1">
          {tracks.map((track, index) => {
            const isCurrentTrack = currentTrack?.id === track.id;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => playTrack(track)}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg hover:bg-[#282828] transition-all cursor-pointer group",
                  isCurrentTrack && "bg-[#282828]",
                  index < 3 && "bg-gradient-to-r from-[#1DB954]/5 to-transparent"
                )}
              >
                <div className="w-8 flex justify-center">
                  {getRankIcon(index)}
                </div>

                <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                  <img
                    src={track.coverUrl}
                    alt={track.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play className="w-5 h-5 text-white fill-white" />
                  </div>
                  {isCurrentTrack && isPlaying && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="flex items-end gap-0.5 h-4">
                        {[1, 2, 3].map((bar) => (
                          <motion.div
                            key={bar}
                            className="w-1 bg-[#1DB954] rounded-full"
                            animate={{ height: ['40%', '100%', '60%', '100%', '40%'] }}
                            transition={{ duration: 1.2, repeat: Infinity, delay: bar * 0.15 }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={cn("font-medium truncate", isCurrentTrack ? "text-[#1DB954]" : "text-white")}>
                    {track.title}
                  </p>
                  <p className="text-sm text-[#b3b3b3] truncate">{track.artist}</p>
                </div>

                <span className="text-xs text-[#b3b3b3] px-2 py-1 bg-[#282828] rounded-full hidden sm:block">
                  {track.genre}
                </span>

                <div className="flex items-center gap-1 text-[#b3b3b3] text-sm min-w-[60px] justify-end">
                  <Play className="w-3 h-3" />
                  <span>{formatNumber(track.plays || 0)}</span>
                </div>

                <span className="text-sm text-[#b3b3b3] w-12 text-right hidden sm:block">
                  {formatDuration(track.duration)}
                </span>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {artists.map((artist, index) => (
            <motion.div
              key={artist.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl bg-[#181818] hover:bg-[#282828] transition-all cursor-pointer group",
                index < 3 && "ring-1 ring-[#1DB954]/20"
              )}
            >
              <div className="w-8 flex justify-center">
                {getRankIcon(index)}
              </div>

              <div className="relative">
                <img
                  src={artist.avatarUrl}
                  alt={artist.displayName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                {artist.isVerified && (
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#1DB954] rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{artist.displayName}</h3>
                <p className="text-sm text-[#b3b3b3]">
                  {formatNumber(artist.followers)} followers
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-[#1DB954]">{formatNumber(artist.totalPlays)}</p>
                <p className="text-xs text-[#b3b3b3]">plays</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
