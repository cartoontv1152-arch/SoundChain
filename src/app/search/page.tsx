"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Music, User, TrendingUp, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/lib/types';
import { toast } from 'sonner';

interface SearchArtist {
  id: string;
  displayName: string;
  username: string;
  walletAddress: string;
  avatarUrl: string;
  isVerified: boolean;
  followers: number;
  totalPlays: number;
}

const recentSearches = ['Lo-Fi beats', 'Neon Pulse', 'Electronic', 'Chill vibes'];
const trendingSearches = ['Morning Coffee', 'Trap Kingdom', 'Summer Breeze', 'Midnight Drive', 'Bass Drop'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [artists, setArtists] = useState<SearchArtist[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setTracks([]);
      setArtists([]);
      setHasSearched(false);
      return;
    }

    const debounce = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json();
        setTracks(data.tracks || []);
        setArtists(data.artists || []);
        setHasSearched(true);
      } catch {
        toast.error('Search failed');
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(debounce);
  }, [query]);

  const handleQuickSearch = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="min-h-screen px-4 sm:px-8 py-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-6">Search</h1>
        <div className="relative max-w-2xl">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
          <Input
            placeholder="What do you want to listen to?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-12 h-14 bg-[#282828] border-0 text-white text-lg placeholder:text-[#b3b3b3] rounded-full focus-visible:ring-[#1DB954]"
            autoFocus
          />
        </div>
      </motion.div>

      {!hasSearched && !loading && (
        <div className="space-y-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Clock className="w-5 h-5 text-[#b3b3b3]" />
              <h2 className="text-lg font-semibold text-white">Recent Searches</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 rounded-full bg-[#282828] text-white text-sm hover:bg-[#383838] transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-[#1DB954]" />
              <h2 className="text-lg font-semibold text-white">Trending</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {trendingSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handleQuickSearch(term)}
                  className="px-4 py-2 rounded-full bg-[#1DB954]/10 text-[#1DB954] text-sm hover:bg-[#1DB954]/20 transition-colors border border-[#1DB954]/20"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-white mb-4">Browse by Genre</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[
                { name: 'Electronic', color: 'from-purple-600 to-blue-600' },
                { name: 'Lo-Fi', color: 'from-orange-500 to-pink-500' },
                { name: 'Hip Hop', color: 'from-yellow-500 to-red-500' },
                { name: 'Ambient', color: 'from-teal-500 to-cyan-500' },
                { name: 'Synthwave', color: 'from-pink-500 to-purple-600' },
                { name: 'Rock', color: 'from-red-600 to-orange-500' },
                { name: 'Jazz', color: 'from-blue-600 to-indigo-600' },
                { name: 'Indie', color: 'from-green-500 to-teal-500' },
              ].map((genre) => (
                <button
                  key={genre.name}
                  onClick={() => handleQuickSearch(genre.name)}
                  className={`relative h-24 rounded-lg bg-gradient-to-br ${genre.color} p-4 overflow-hidden group`}
                >
                  <span className="text-lg font-bold text-white relative z-10">{genre.name}</span>
                  <Music className="absolute bottom-2 right-2 w-10 h-10 text-white/20 rotate-12 group-hover:scale-110 transition-transform" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center gap-4 p-4">
              <div className="w-12 h-12 bg-[#282828] rounded" />
              <div className="flex-1">
                <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                <div className="h-3 bg-[#282828] rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      )}

      {hasSearched && !loading && (
        <div className="space-y-8">
          {artists.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-[#1DB954]" />
                <h2 className="text-xl font-bold text-white">Artists</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {artists.map((artist) => (
                  <motion.div
                    key={artist.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-[#181818] rounded-lg p-4 hover:bg-[#282828] transition-colors group cursor-pointer"
                  >
                    <div className="relative mb-4">
                      <img
                        src={artist.avatarUrl}
                        alt={artist.displayName}
                        className="w-full aspect-square object-cover rounded-full shadow-lg"
                      />
                      {artist.isVerified && (
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-[#1DB954] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold text-white text-sm truncate">{artist.displayName}</h3>
                    <p className="text-xs text-[#b3b3b3] mt-1">{artist.followers?.toLocaleString()} followers</p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {tracks.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Music className="w-5 h-5 text-[#1DB954]" />
                <h2 className="text-xl font-bold text-white">Tracks</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {tracks.map((track, index) => (
                  <TrackCard key={track.id} track={track} index={index} />
                ))}
              </div>
            </div>
          )}

          {tracks.length === 0 && artists.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-4">
                <SearchIcon className="w-8 h-8 text-[#b3b3b3]" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
              <p className="text-[#b3b3b3]">Try different keywords or browse by genre</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
