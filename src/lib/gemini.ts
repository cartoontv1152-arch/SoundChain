import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface MusicRecommendation {
  trackIds: string[];
  reasoning: string;
  playlistName: string;
  playlistDescription: string;
}

export async function getRecommendations(
  listeningHistory: { title: string; artist: string; genre: string }[],
  availableTracks: { id: string; title: string; artist: string; genre: string }[]
): Promise<MusicRecommendation> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `You are a music recommendation AI for a decentralized music streaming platform.

Based on the user's listening history, recommend tracks from the available catalog.

User's recent listening history:
${listeningHistory.map(t => `- "${t.title}" by ${t.artist} (${t.genre})`).join('\n')}

Available tracks in catalog:
${availableTracks.map(t => `- ID: ${t.id}, "${t.title}" by ${t.artist} (${t.genre})`).join('\n')}

Please respond with a JSON object containing:
1. "trackIds": array of recommended track IDs (3-5 tracks)
2. "reasoning": brief explanation of why these tracks were chosen
3. "playlistName": a creative name for this recommendation playlist
4. "playlistDescription": a short description for the playlist

Respond ONLY with the JSON object, no additional text.`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as MusicRecommendation;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      trackIds: availableTracks.slice(0, 3).map(t => t.id),
      reasoning: 'Based on popular tracks in similar genres',
      playlistName: 'Recommended for You',
      playlistDescription: 'Tracks we think you\'ll love',
    };
  }
}

export async function generatePlaylistDescription(
  tracks: { title: string; artist: string; genre: string }[]
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Generate a short, engaging description (1-2 sentences) for a music playlist containing these tracks:
${tracks.map(t => `- "${t.title}" by ${t.artist} (${t.genre})`).join('\n')}

Be creative and capture the vibe of the playlist. Response should be just the description text.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return `A curated selection of ${tracks.length} tracks`;
  }
}

export async function analyzeUserTaste(
  listeningHistory: { title: string; artist: string; genre: string; playCount: number }[]
): Promise<{
  topGenres: string[];
  mood: string;
  recommendation: string;
}> {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `Analyze this user's music taste based on their listening history:
${listeningHistory.map(t => `- "${t.title}" by ${t.artist} (${t.genre}) - played ${t.playCount} times`).join('\n')}

Respond with a JSON object containing:
1. "topGenres": array of their top 3 preferred genres
2. "mood": overall mood preference (e.g., "energetic", "chill", "melancholic")
3. "recommendation": a brief personalized music discovery tip

Respond ONLY with the JSON object.`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Gemini API error:', error);
    return {
      topGenres: ['Electronic', 'Pop', 'Hip Hop'],
      mood: 'varied',
      recommendation: 'Explore new artists in your favorite genres!',
    };
  }
}

export default {
  getRecommendations,
  generatePlaylistDescription,
  analyzeUserTaste,
};
