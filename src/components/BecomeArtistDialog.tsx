"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Music2, Sparkles } from 'lucide-react';
import { genres } from '@/lib/mock-data';

interface BecomeArtistDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  walletAddress: string;
}

export function BecomeArtistDialog({ open, onOpenChange, walletAddress }: BecomeArtistDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    artistName: '',
    bio: '',
    genres: [] as string[],
    twitter: '',
    instagram: '',
    website: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          artistName: formData.artistName,
          bio: formData.bio,
          genres: formData.genres,
          socialLinks: {
            twitter: formData.twitter,
            instagram: formData.instagram,
            website: formData.website,
          },
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create artist profile');
      }

      alert('Artist profile created successfully! You can now upload music.');
      onOpenChange(false);
      window.location.href = '/artist';
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genre: string) => {
    setFormData(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-[#181818] border-white/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#1DB954] flex items-center justify-center">
              <Music2 className="w-5 h-5 text-black" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl">Become an Artist</DialogTitle>
              <DialogDescription className="text-[#b3b3b3]">
                Start uploading your music and earning from streams
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <Label htmlFor="artistName" className="text-white">
              Artist Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="artistName"
              placeholder="Your stage name"
              value={formData.artistName}
              onChange={(e) => setFormData({ ...formData, artistName: e.target.value })}
              required
              className="bg-[#121212] border-white/10 text-white mt-1"
            />
          </div>

          <div>
            <Label htmlFor="bio" className="text-white">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your music..."
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="bg-[#121212] border-white/10 text-white mt-1 min-h-[80px]"
            />
          </div>

          <div>
            <Label className="text-white mb-2 block">Genres (select up to 3)</Label>
            <div className="grid grid-cols-3 gap-2">
              {genres.slice(0, 12).map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  disabled={!formData.genres.includes(genre) && formData.genres.length >= 3}
                  className={`px-3 py-2 rounded-lg text-sm transition-all ${
                    formData.genres.includes(genre)
                      ? 'bg-[#1DB954] text-black'
                      : 'bg-[#121212] text-white hover:bg-white/10'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-white">Social Links (optional)</Label>
            <Input
              placeholder="Twitter username"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="bg-[#121212] border-white/10 text-white"
            />
            <Input
              placeholder="Instagram username"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="bg-[#121212] border-white/10 text-white"
            />
            <Input
              placeholder="Website URL"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-[#121212] border-white/10 text-white"
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !formData.artistName}
              className="bg-[#1DB954] hover:bg-[#1ed760] text-black"
            >
              {loading ? (
                'Creating...'
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Artist Profile
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
