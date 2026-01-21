"use client";

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { Track, PlayerState } from './types';

interface PlayerContextType extends PlayerState {
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seek: (time: number) => void;
  nextTrack: () => void;
  prevTrack: () => void;
  addToQueue: (track: Track) => void;
  removeFromQueue: (trackId: string) => void;
  clearQueue: () => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playPlaylist: (tracks: Track[], startIndex?: number) => void;
  likedTracks: string[];
  addLikedTrack: (trackId: string) => void;
  removeLikedTrack: (trackId: string) => void;
  isLiked: (trackId: string) => boolean;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<PlayerState>({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    progress: 0,
    duration: 0,
    queue: [],
    shuffled: false,
    repeat: 'none',
  });
  const [likedTracks, setLikedTracks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('likedTracks');
    if (stored) {
      setLikedTracks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('likedTracks', JSON.stringify(likedTracks));
  }, [likedTracks]);

  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = state.volume;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setState(prev => ({
        ...prev,
        progress: audio.currentTime,
        duration: audio.duration || 0,
      }));
    };

    const handleEnded = () => {
      if (state.repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  const addLikedTrack = (trackId: string) => {
    setLikedTracks(prev => {
      if (prev.includes(trackId)) return prev;
      return [...prev, trackId];
    });
  };

  const removeLikedTrack = (trackId: string) => {
    setLikedTracks(prev => prev.filter(id => id !== trackId));
  };

  const isLiked = (trackId: string) => {
    return likedTracks.includes(trackId);
  };

  const playTrack = (track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.audioUrl;
      audioRef.current.play().catch((error) => {
        console.error('Error playing track:', error);
        setState(prev => ({ ...prev, isPlaying: false }));
      });
      setState(prev => ({
        ...prev,
        currentTrack: track,
        isPlaying: true,
        progress: 0,
      }));
    }
  };

  const togglePlay = () => {
    if (audioRef.current && state.currentTrack) {
      if (state.isPlaying) {
        audioRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Error playing track:', error);
          setState(prev => ({ ...prev, isPlaying: false }));
        });
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    }
  };

  const setVolume = (volume: number) => {
    setState(prev => ({ ...prev, volume }));
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setState(prev => ({ ...prev, progress: time }));
    }
  };

  const nextTrack = () => {
    if (state.queue.length > 0) {
      const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
      let nextIndex = currentIndex + 1;
      
      if (state.shuffled) {
        nextIndex = Math.floor(Math.random() * state.queue.length);
      } else if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          setState(prev => ({ ...prev, isPlaying: false }));
          return;
        }
      }
      
      playTrack(state.queue[nextIndex]);
    }
  };

  const prevTrack = () => {
    if (audioRef.current && state.progress > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    if (state.queue.length > 0) {
      const currentIndex = state.queue.findIndex(t => t.id === state.currentTrack?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : state.queue.length - 1;
      playTrack(state.queue[prevIndex]);
    }
  };

  const addToQueue = (track: Track) => {
    setState(prev => ({
      ...prev,
      queue: [...prev.queue, track],
    }));
  };

  const removeFromQueue = (trackId: string) => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(t => t.id !== trackId),
    }));
  };

  const clearQueue = () => {
    setState(prev => ({ ...prev, queue: [] }));
  };

  const toggleShuffle = () => {
    setState(prev => ({ ...prev, shuffled: !prev.shuffled }));
  };

  const toggleRepeat = () => {
    setState(prev => ({
      ...prev,
      repeat: prev.repeat === 'none' ? 'all' : prev.repeat === 'all' ? 'one' : 'none',
    }));
  };

  const playPlaylist = (tracks: Track[], startIndex = 0) => {
    setState(prev => ({ ...prev, queue: tracks }));
    if (tracks[startIndex]) {
      playTrack(tracks[startIndex]);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        ...state,
        playTrack,
        togglePlay,
        setVolume,
        seek,
        nextTrack,
        prevTrack,
        addToQueue,
        removeFromQueue,
        clearQueue,
        toggleShuffle,
        toggleRepeat,
        playPlaylist,
        likedTracks,
        addLikedTrack,
        removeLikedTrack,
        isLiked,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}