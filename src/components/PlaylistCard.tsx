"use client";

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play, Pause } from 'lucide-react';
import { Playlist } from '@/lib/types';
import { usePlayer } from '@/lib/player-context';

interface PlaylistCardProps {
  playlist: Playlist;
  index?: number;
}

export function PlaylistCard({ playlist, index }: PlaylistCardProps) {
  const { playPlaylist, isPlaying, queue, togglePlay } = usePlayer();
  const [hovered, setHovered] = useState(false);

  const isPlayingThisPlaylist = queue.length > 0 && 
    playlist.tracks.some(t => queue.find(q => q.id === t.id));

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPlayingThisPlaylist) {
      togglePlay();
    } else {
      playPlaylist(playlist.tracks);
    }
  };

  return (
    <Link href={`/playlist/${playlist.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index ? index * 0.1 : 0 }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer"
      >
        <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
          {playlist.coverUrl ? (
            <img
              src={playlist.coverUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-[#282828] to-[#121212] flex items-center justify-center">
              <div className="grid grid-cols-2 gap-1 w-full h-full p-1">
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

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            className="absolute bottom-2 right-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handlePlay}
              className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-xl"
            >
              {isPlayingThisPlaylist && isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              )}
            </motion.button>
          </motion.div>
        </div>

        <div className="space-y-1">
          <p className="text-white font-semibold truncate">{playlist.name}</p>
          <p className="text-sm text-[#b3b3b3] line-clamp-2">
            {playlist.description || `${playlist.tracks.length} tracks`}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
