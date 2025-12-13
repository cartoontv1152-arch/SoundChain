"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat,
  Repeat1,
  Heart,
  ListMusic,
  Maximize2,
  Mic2,
} from 'lucide-react';
import { usePlayer } from '@/lib/player-context';
import { formatDuration } from '@/lib/mock-data';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

export function Player() {
  const {
    currentTrack,
    isPlaying,
    volume,
    progress,
    duration,
    shuffled,
    repeat,
    togglePlay,
    setVolume,
    seek,
    nextTrack,
    prevTrack,
    toggleShuffle,
    toggleRepeat,
    isLiked,
    addLikedTrack,
    removeLikedTrack,
  } = usePlayer();

  const [showQueue, setShowQueue] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  const liked = currentTrack ? isLiked(currentTrack.id || currentTrack._id || '') : false;

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleLike = () => {
    if (!currentTrack) return;
    const trackId = currentTrack.id || currentTrack._id || '';
    if (liked) {
      removeLikedTrack(trackId);
    } else {
      addLikedTrack(trackId);
    }
  };

  if (!currentTrack) {
    return (
      <div className="fixed bottom-0 left-0 right-0 h-[90px] bg-gradient-to-t from-black via-[#181818] to-[#181818] border-t border-white/5 flex items-center justify-center">
        <p className="text-[#b3b3b3] text-sm">Select a track to start playing</p>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 h-[90px] bg-gradient-to-t from-black via-[#181818] to-[#181818] border-t border-white/5 px-4 flex items-center z-50"
      >
        <div className="flex items-center gap-4 w-[30%] min-w-[180px]">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-14 h-14 rounded overflow-hidden shadow-lg flex-shrink-0"
          >
            <img
              src={currentTrack.coverUrl}
              alt={currentTrack.title}
              className="w-full h-full object-cover"
            />
            {isPlaying && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <div className="audio-visualizer">
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                  <div className="audio-bar" />
                </div>
              </div>
            )}
          </motion.div>
          <div className="flex-1 min-w-0">
            <motion.p
              key={currentTrack.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-white text-sm font-medium truncate hover:underline cursor-pointer"
            >
              {currentTrack.title}
            </motion.p>
            <p className="text-[#b3b3b3] text-xs truncate hover:underline cursor-pointer">
              {currentTrack.artist}
            </p>
          </div>
          <button
            onClick={handleLike}
            className="p-2 hover:scale-105 transition-transform flex-shrink-0"
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-colors",
                liked ? "fill-[#1DB954] text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center max-w-[722px] gap-2">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={cn(
                "p-2 transition-colors flex-shrink-0",
                shuffled ? "text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            >
              <Shuffle className="w-4 h-4" />
            </button>
            <button
              onClick={prevTrack}
              className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0"
            >
              <SkipBack className="w-5 h-5 fill-current" />
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform flex-shrink-0"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-black fill-black" />
              ) : (
                <Play className="w-5 h-5 text-black fill-black ml-0.5" />
              )}
            </motion.button>
            <button
              onClick={nextTrack}
              className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0"
            >
              <SkipForward className="w-5 h-5 fill-current" />
            </button>
            <button
              onClick={toggleRepeat}
              className={cn(
                "p-2 transition-colors relative flex-shrink-0",
                repeat !== 'none' ? "text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
              )}
            >
              {repeat === 'one' ? (
                <Repeat1 className="w-4 h-4" />
              ) : (
                <Repeat className="w-4 h-4" />
              )}
              {repeat !== 'none' && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#1DB954]" />
              )}
            </button>
          </div>

          <div className="w-full flex items-center gap-2">
            <span className="text-[#b3b3b3] text-xs w-10 text-right">
              {formatDuration(Math.floor(progress))}
            </span>
            <div className="flex-1 group">
              <Slider
                value={[progress]}
                max={duration || 100}
                step={1}
                onValueChange={([value]) => seek(value)}
                className="cursor-pointer"
              />
            </div>
            <span className="text-[#b3b3b3] text-xs w-10">
              {formatDuration(Math.floor(duration))}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 w-[30%] min-w-[180px]">
          <button className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0">
            <Mic2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowQueue(!showQueue)}
            className={cn(
              "p-2 transition-colors flex-shrink-0",
              showQueue ? "text-[#1DB954]" : "text-[#b3b3b3] hover:text-white"
            )}
          >
            <ListMusic className="w-4 h-4" />
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setVolume(volume > 0 ? 0 : 0.7)}
              className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0"
            >
              {volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <div className="w-24">
              <Slider
                value={[volume * 100]}
                max={100}
                step={1}
                onValueChange={([value]) => setVolume(value / 100)}
                className="cursor-pointer"
              />
            </div>
          </div>
          <button 
            onClick={handleMaximize}
            className="p-2 text-[#b3b3b3] hover:text-white transition-colors flex-shrink-0 hover:scale-110"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {isMaximized && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleMaximize}
            className="fixed inset-0 bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-black z-[60] flex items-center justify-center p-8 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-3xl w-full"
            >
              <div className="flex flex-col items-center">
                <motion.div className="relative mb-8">
                  <img
                    src={currentTrack.coverUrl}
                    alt={currentTrack.title}
                    className="w-[450px] h-[450px] rounded-2xl shadow-2xl"
                  />
                  {isPlaying && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                  )}
                </motion.div>
                
                <div className="w-full max-w-xl text-center mb-8">
                  <h2 className="text-5xl font-bold text-white mb-3">{currentTrack.title}</h2>
                  <p className="text-2xl text-[#b3b3b3]">{currentTrack.artist}</p>
                </div>
                
                <div className="w-full max-w-xl mb-10">
                  <Slider
                    value={[progress]}
                    max={duration || 100}
                    step={1}
                    onValueChange={([value]) => seek(value)}
                    className="cursor-pointer"
                  />
                  <div className="flex justify-between mt-3">
                    <span className="text-[#b3b3b3] text-sm">
                      {formatDuration(Math.floor(progress))}
                    </span>
                    <span className="text-[#b3b3b3] text-sm">
                      {formatDuration(Math.floor(duration))}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-8 mb-6">
                  <button
                    onClick={handleLike}
                    className="p-3 transition-all hover:scale-110"
                  >
                    <Heart
                      className={cn(
                        "w-7 h-7",
                        liked ? "fill-[#1DB954] text-[#1DB954]" : "text-white/60 hover:text-white"
                      )}
                    />
                  </button>
                  <button
                    onClick={toggleShuffle}
                    className={cn(
                      "p-2 transition-colors",
                      shuffled ? "text-[#1DB954]" : "text-white/60 hover:text-white"
                    )}
                  >
                    <Shuffle className="w-6 h-6" />
                  </button>
                  <button
                    onClick={prevTrack}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <SkipBack className="w-8 h-8 fill-current" />
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={togglePlay}
                    className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-2xl hover:shadow-white/20 transition-all"
                  >
                    {isPlaying ? (
                      <Pause className="w-9 h-9 text-black fill-black" />
                    ) : (
                      <Play className="w-9 h-9 text-black fill-black ml-1" />
                    )}
                  </motion.button>
                  <button
                    onClick={nextTrack}
                    className="p-2 text-white/60 hover:text-white transition-colors"
                  >
                    <SkipForward className="w-8 h-8 fill-current" />
                  </button>
                  <button
                    onClick={toggleRepeat}
                    className={cn(
                      "p-2 transition-colors",
                      repeat !== 'none' ? "text-[#1DB954]" : "text-white/60 hover:text-white"
                    )}
                  >
                    {repeat === 'one' ? (
                      <Repeat1 className="w-6 h-6" />
                    ) : (
                      <Repeat className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}