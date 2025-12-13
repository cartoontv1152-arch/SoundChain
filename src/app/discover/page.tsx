"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid, List, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrackCard } from '@/components/TrackCard';
import { Track } from '@/lib/types';
import { cn } from '@/lib/utils';

const genres = ['Electronic', 'Hip-Hop', 'Pop', 'Rock', 'Jazz', 'Classical', 'R&B', 'Country', 'Reggae', 'Metal'];

export default function DiscoverPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const params = new URLSearchParams();
        if (selectedGenre) params.append('genre', selectedGenre);
        if (searchQuery) params.append('search', searchQuery);
        
        const response = await fetch(`/api/tracks?${params.toString()}`);
        const data = await response.json();
        setTracks(data.tracks || []);
      } catch (error) {
        console.error('Error fetching tracks:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchTracks, 300);
    return () => clearTimeout(debounce);
  }, [searchQuery, selectedGenre]);

  const filteredTracks = useMemo(() => {
    return tracks.filter(track => {
      const matchesSearch = !searchQuery || 
        track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });
  }, [tracks, searchQuery]);

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#121212] via-[#121212] to-transparent pb-6 pt-6 px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Discover</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('grid')}
              className={cn(viewMode === 'grid' && 'bg-white/10')}
            >
              <Grid className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode('list')}
              className={cn(viewMode === 'list' && 'bg-white/10')}
            >
              <List className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#b3b3b3]" />
            <Input
              placeholder="Search tracks, artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-[#282828] border-0 text-white placeholder:text-[#b3b3b3] rounded-full focus-visible:ring-[#1DB954]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#b3b3b3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedGenre(null)}
            className={cn(
              "rounded-full shrink-0",
              !selectedGenre ? "bg-white text-black hover:bg-white/90" : "bg-[#282828] hover:bg-[#383838]"
            )}
          >
            All
          </Button>
          {genres.map((genre) => (
            <Button
              key={genre}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedGenre(selectedGenre === genre ? null : genre)}
              className={cn(
                "rounded-full shrink-0",
                selectedGenre === genre 
                  ? "bg-white text-black hover:bg-white/90" 
                  : "bg-[#282828] hover:bg-[#383838]"
              )}
            >
              {genre}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        {loading ? (
          <div className={cn(
            viewMode === 'grid' 
              ? "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
              : "space-y-2"
          )}>
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse">
                {viewMode === 'grid' ? (
                  <>
                    <div className="aspect-square bg-[#282828] rounded-lg mb-4" />
                    <div className="h-4 bg-[#282828] rounded w-3/4 mb-2" />
                    <div className="h-3 bg-[#282828] rounded w-1/2" />
                  </>
                ) : (
                  <div className="flex items-center gap-4 p-4">
                    <div className="w-10 h-10 bg-[#282828] rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                      <div className="h-3 bg-[#282828] rounded w-1/4" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : filteredTracks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="w-20 h-20 rounded-full bg-[#282828] flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-[#b3b3b3]" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No tracks found</h3>
            <p className="text-[#b3b3b3]">Try adjusting your search or filters</p>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} index={index} />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-4 px-4 py-2 text-sm text-[#b3b3b3] border-b border-white/10">
              <span className="w-8">#</span>
              <span className="w-10" />
              <span className="flex-1">Title</span>
              <span className="hidden md:block w-40">Artist</span>
              <span className="w-24 text-right">Duration</span>
              <span className="w-8" />
            </div>
            {filteredTracks.map((track, index) => (
              <TrackCard key={track.id} track={track} variant="list" index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
