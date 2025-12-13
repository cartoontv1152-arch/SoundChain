import { NextRequest, NextResponse } from 'next/server';
import { mockTracks } from '@/lib/mock-data';
import { getRecommendations, analyzeUserTaste } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { listeningHistory } = body;

    if (!listeningHistory || !Array.isArray(listeningHistory)) {
      const defaultRecommendations = mockTracks.slice(0, 5).map(t => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        genre: t.genre,
      }));

      return NextResponse.json({
        recommendations: defaultRecommendations,
        playlistName: 'Discover Weekly',
        playlistDescription: 'Fresh tracks picked just for you',
        reasoning: 'Popular tracks to get you started',
      });
    }

    const availableTracks = mockTracks.map(t => ({
      id: t.id,
      title: t.title,
      artist: t.artist,
      genre: t.genre,
    }));

    const result = await getRecommendations(listeningHistory, availableTracks);

    const recommendedTracks = result.trackIds
      .map(id => mockTracks.find(t => t.id === id))
      .filter(Boolean);

    return NextResponse.json({
      recommendations: recommendedTracks,
      playlistName: result.playlistName,
      playlistDescription: result.playlistDescription,
      reasoning: result.reasoning,
    });
  } catch (error) {
    console.error('Error getting recommendations:', error);
    
    const fallbackTracks = mockTracks.slice(0, 5);
    return NextResponse.json({
      recommendations: fallbackTracks,
      playlistName: 'Recommended for You',
      playlistDescription: 'Tracks we think you\'ll enjoy',
      reasoning: 'Based on popular tracks',
    });
  }
}

export async function GET() {
  const trendingTracks = [...mockTracks]
    .sort((a, b) => b.plays - a.plays)
    .slice(0, 10);

  return NextResponse.json({
    trending: trendingTracks,
    newReleases: mockTracks.slice(-4),
    forYou: mockTracks.slice(2, 7),
  });
}
