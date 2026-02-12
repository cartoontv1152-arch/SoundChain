"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Music, Heart, Clock, Grid, List, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TrackCard } from '@/components/TrackCard';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';
import { Track } from '@/lib/types';

const tabs = [
  { id: 'playlists', label: 'Playlists', icon: Music },
  { id: 'liked', label: 'Liked Songs', icon: Heart },
  { id: 'recent', label: 'Recently Played', icon: Clock },
];

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState('playlists');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', description: '' });
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [recentTracks, setRecentTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tracksRes] = await Promise.all([
          fetch('/api/tracks?limit=10&sort=createdAt')
        ]);
        const tracksData = await tracksRes.json();
        setLikedTracks(tracksData.tracks || []);
        setRecentTracks(tracksData.tracks || []);
      } catch (error) {
        console.error('Error fetching library data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreatePlaylist = () => {
    console.log('Creating playlist:', newPlaylist);
    setIsCreateOpen(false);
    setNewPlaylist({ name: '', description: '' });
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === 'liked') {
      window.location.href = '/library/liked';
    } else {
      setActiveTab(tabId);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-20 bg-gradient-to-b from-[#121212] via-[#121212]/95 to-transparent pt-6 px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-white">Your Library</h1>
          <div className="flex items-center gap-3">
            <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold rounded-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Playlist
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-[#282828] border-white/10">
                <DialogHeader>
                  <DialogTitle className="text-white">Create Playlist</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Input
                      placeholder="Playlist name"
                      value={newPlaylist.name}
                      onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })}
                      className="bg-[#3e3e3e] border-0 text-white"
                    />
                  </div>
                  <div>
                    <Textarea
                      placeholder="Description (optional)"
                      value={newPlaylist.description}
                      onChange={(e) => setNewPlaylist({ ...newPlaylist, description: e.target.value })}
                      className="bg-[#3e3e3e] border-0 text-white resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleCreatePlaylist}
                      className="bg-[#1DB954] hover:bg-[#1ed760] text-black"
                      disabled={!newPlaylist.name}
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <div className="flex items-center gap-1">
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
        </div>

        <div className="flex items-center gap-2 pb-6">
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              variant="ghost"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "rounded-full",
                activeTab === tab.id 
                  ? "bg-white text-black hover:bg-white/90" 
                  : "bg-[#282828] hover:bg-[#383838]"
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="px-8 pb-8">
        {activeTab === 'playlists' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Music className="w-16 h-16 text-[#b3b3b3] mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Create your first playlist</h3>
            <p className="text-[#b3b3b3] mb-6">It's easy, we'll help you</p>
            <Button 
              onClick={() => setIsCreateOpen(true)}
              className="bg-white text-black hover:bg-white/90 font-semibold rounded-full px-8"
            >
              Create Playlist
            </Button>
          </motion.div>
        )}

        {activeTab === 'recent' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {loading ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={`skeleton-${i}`} className="animate-pulse flex items-center gap-4 p-4">
                    <div className="w-12 h-12 bg-[#282828] rounded" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#282828] rounded w-1/3 mb-2" />
                      <div className="h-3 bg-[#282828] rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentTracks.length > 0 ? (
              viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {recentTracks.map((track, index) => (
                    <TrackCard key={track.id || track._id} track={track} index={index} />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {recentTracks.map((track, index) => (
                    <TrackCard key={track.id || track._id} track={track} variant="list" index={index} />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <Clock className="w-16 h-16 text-[#b3b3b3] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No listening history yet</h3>
                <p className="text-[#b3b3b3] mb-6">Start listening to build your history</p>
                <Link href="/discover">
                  <Button className="bg-white text-black hover:bg-white/90 font-semibold rounded-full px-8">
                    Browse Music
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}