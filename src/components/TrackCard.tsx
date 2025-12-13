"use client";

import { motion } from 'framer-motion';
import { Play, Pause, Heart, MoreHorizontal, Plus } from 'lucide-react';
import { Track } from '@/lib/types';
import { usePlayer } from '@/lib/player-context';
import { formatDuration, formatPlays } from '@/lib/mock-data';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface TrackCardProps {
  track: Track;
  variant?: 'grid' | 'list';
  index?: number;
}

export function TrackCard({ track, variant = 'grid', index }: TrackCardProps) {
  const { currentTrack, isPlaying, playTrack, togglePlay, addToQueue, isLiked, addLikedTrack, removeLikedTrack } = usePlayer();
  const [hovered, setHovered] = useState(false);

  const isCurrentTrack = currentTrack?.id === track.id;
  const isPlayingThis = isCurrentTrack && isPlaying;
  const liked = isLiked(track.id || track._id || '');

  const handlePlay = () => {
    if (isCurrentTrack) {
      togglePlay();
    } else {
      playTrack(track);
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    const trackId = track.id || track._id || '';
    if (liked) {
      removeLikedTrack(trackId);
    } else {
      addLikedTrack(trackId);
    }
  };

  if (variant === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index ? index * 0.05 : 0 }}
        className={cn(
          "group flex items-center gap-4 px-4 py-2 rounded-lg transition-colors cursor-pointer",
          isCurrentTrack ? "bg-white/10" : "hover:bg-white/5"
        )}
      >
        <div className="w-8 flex items-center justify-center">
          {isPlayingThis ? (
            <button onClick={handlePlay} className="text-white">
              <Pause className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <span className={cn(
              "text-sm",
              isCurrentTrack ? "text-[#1DB954]" : "text-[#b3b3b3]"
            )}>
              {index !== undefined ? index + 1 : ''}
            </span>
          )}
        </div>

        <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0">
          <img
            src={track.coverUrl}
            alt={track.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "text-sm font-medium truncate",
            isCurrentTrack ? "text-[#1DB954]" : "text-white"
          )}>
            {track.title}
          </p>
          <p className="text-xs text-[#b3b3b3] truncate">{track.artist}</p>
        </div>

        <div className="hidden md:block w-40 text-sm text-[#b3b3b3] truncate">
          {track.album}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={handleLike}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              liked && "opacity-100"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4",
                liked ? "fill-[#1DB954] text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            />
          </button>

          <span className="text-sm text-[#b3b3b3] w-12 text-right">
            {formatDuration(track.duration)}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              addToQueue(track);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity text-[#b3b3b3] hover:text-white"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index ? index * 0.1 : 0 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative p-4 rounded-lg bg-[#181818] hover:bg-[#282828] transition-all duration-300 cursor-pointer"
    >
      <div className="relative aspect-square rounded-md overflow-hidden mb-4 shadow-lg">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="w-full h-full object-cover"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          className="absolute inset-0 bg-black/40 flex items-center justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePlay}
            className="w-12 h-12 rounded-full bg-[#1DB954] flex items-center justify-center shadow-xl"
          >
            {isPlayingThis ? (
              <Pause className="w-5 h-5 text-black fill-black" />
            ) : (
              <Play className="w-5 h-5 text-black fill-black ml-0.5" />
            )}
          </motion.button>
        </motion.div>
        
        {isPlayingThis && (
          <div className="absolute bottom-2 right-2">
            <div className="audio-visualizer">
              <div className="audio-bar" />
              <div className="audio-bar" />
              <div className="audio-bar" />
            </div>
          </div>
        )}
      </div>

      <div className="space-y-1">
        <p className={cn(
          "text-sm font-semibold truncate",
          isCurrentTrack ? "text-[#1DB954]" : "text-white"
        )}>
          {track.title}
        </p>
        <p className="text-sm text-[#b3b3b3] truncate">{track.artist}</p>
      </div>

      <div className="mt-2 flex items-center justify-between text-xs text-[#b3b3b3]">
        <span>{formatPlays(track.plays || 0)} plays</span>
        <span className="px-2 py-0.5 rounded-full bg-white/10">{track.genre}</span>
      </div>

      <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleLike}
          className="p-2 rounded-full bg-black/60 backdrop-blur-sm"
        >
          <Heart
            className={cn(
              "w-4 h-4",
              liked ? "fill-[#1DB954] text-[#1DB954]" : "text-white"
            )}
          />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            addToQueue(track);
          }}
          className="p-2 rounded-full bg-black/60 backdrop-blur-sm text-white"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}