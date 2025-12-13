"use client";

import { use } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, Clock, Heart, MoreHorizontal, Shuffle, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackCard } from '@/components/TrackCard';
import { mockPlaylists, formatDuration } from '@/lib/mock-data';
import { usePlayer } from '@/lib/player-context';
import { cn } from '@/lib/utils';

export default function PlaylistPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { playPlaylist, isPlaying, queue, togglePlay } = usePlayer();
  
  const playlist = mockPlaylists.find(p => p.id === id) || mockPlaylists[0];

  const isPlayingThisPlaylist = queue.length > 0 && 
    playlist.tracks.some(t => queue.find(q => q.id === t.id));

  const totalDuration = playlist.tracks.reduce((acc, track) => acc + track.duration, 0);

  const handlePlayAll = () => {
    if (isPlayingThisPlaylist) {
      togglePlay();
    } else {
      playPlaylist(playlist.tracks);
    }
  };

  return (
    <div className="min-h-screen">
      <div 
        className="relative h-80 bg-gradient-to-b from-[#535353] to-[#121212]"
        style={{
          backgroundImage: playlist.coverUrl 
            ? `linear-gradient(to bottom, rgba(0,0,0,0.3), #121212), url(${playlist.coverUrl})`
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent" />
        <div className="relative z-10 h-full flex items-end px-8 pb-8">
          <div className="flex items-end gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-56 h-56 rounded-lg overflow-hidden shadow-2xl"
            >
              {playlist.coverUrl ? (
                <img
                  src={playlist.coverUrl}
                  alt={playlist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center">
                  <div className="grid grid-cols-2 gap-1 w-full h-full p-2">
                    {playlist.tracks.slice(0, 4).map((track, i) => (
                      <img
                        key={i}
                        src={track.coverUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-sm text-white font-medium uppercase">Playlist</span>
              <h1 className="text-6xl font-bold text-white mt-2 mb-6">{playlist.name}</h1>
              {playlist.description && (
                <p className="text-white/70 mb-4">{playlist.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-white/70">
                <span className="text-white font-semibold">SoundChain</span>
                <span>•</span>
                <span>{playlist.tracks.length} songs</span>
                <span>•</span>
                <span>about {Math.floor(totalDuration / 60)} min</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        <div className="flex items-center gap-6 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handlePlayAll}
            className="w-14 h-14 rounded-full bg-[#1DB954] flex items-center justify-center shadow-lg hover:bg-[#1ed760] transition-colors"
          >
            {isPlayingThisPlaylist && isPlaying ? (
              <Pause className="w-6 h-6 text-black fill-black" />
            ) : (
              <Play className="w-6 h-6 text-black fill-black ml-1" />
            )}
          </motion.button>

          <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors">
            <Shuffle className="w-6 h-6" />
          </button>

          <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors">
            <Heart className="w-6 h-6" />
          </button>

          <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors">
            <Download className="w-6 h-6" />
          </button>

          <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors">
            <MoreHorizontal className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4 px-4 py-2 text-sm text-[#b3b3b3] border-b border-white/10">
            <span className="w-8">#</span>
            <span className="w-12" />
            <span className="flex-1">Title</span>
            <span className="hidden md:block w-40">Album</span>
            <span className="w-16 text-right">
              <Clock className="w-4 h-4 inline-block" />
            </span>
            <span className="w-12" />
          </div>
        </div>

        <div className="space-y-1">
          {playlist.tracks.map((track, index) => (
            <TrackCard 
              key={track.id} 
              track={track} 
              variant="list" 
              index={index} 
            />
          ))}
        </div>
      </div>
    </div>
  );
}
