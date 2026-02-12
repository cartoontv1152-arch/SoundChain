import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { StreamAnalytics } from '@/lib/models/StreamAnalytics';
import { Artist } from '@/lib/models/Artist';
import { Track } from '@/lib/models/Track';
import { Earnings } from '@/lib/models/Earnings';

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const walletAddress = searchParams.get('wallet') || searchParams.get('artistAddress');
    const period = searchParams.get('period') || '30'; // days

    if (!walletAddress) {
      // Return general platform analytics if no wallet specified
      const totalTracks = await Track.countDocuments();
      const totalArtists = await Artist.countDocuments();
      const totalStreams = await StreamAnalytics.countDocuments({ completed: true });
      
      return NextResponse.json({
        totalStreams,
        totalTracks,
        totalArtists,
        totalEarnings: 0,
        availableBalance: 0,
        periodStreams: 0,
        periodEarnings: 0,
        dailyStats: [],
        topTracks: [],
        recentStreams: [],
      });
    }

    const artist = await Artist.findOne({ walletAddress: walletAddress.toLowerCase() });
    if (!artist) {
      return NextResponse.json({ 
        totalStreams: 0,
        totalEarnings: 0,
        availableBalance: 0,
        periodStreams: 0,
        periodEarnings: 0,
        dailyStats: [],
        topTracks: [],
        recentStreams: [],
        monthlyListeners: 0,
      });
    }

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    // Get stream analytics for the period
    const streams = await StreamAnalytics.find({
      artistId: artist._id,
      timestamp: { $gte: startDate },
      completed: true,
    }).sort({ timestamp: -1 });

    // Get earnings for the period
    const earnings = await Earnings.find({
      artistId: artist._id,
      timestamp: { $gte: startDate },
      type: { $in: ['stream', 'tip', 'nft_sale'] },
    }).sort({ timestamp: -1 });

    // Get top tracks
    const topTracks = await Track.find({ artistId: artist._id })
      .sort({ playCount: -1 })
      .limit(10);

    // Calculate daily stats
    const dailyStats = [];
    for (let i = 0; i < periodDays; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const dayStreams = streams.filter(
        (s) => s.timestamp >= date && s.timestamp < nextDate
      );

      const dayEarnings = earnings.filter(
        (e) => e.timestamp >= date && e.timestamp < nextDate
      );

      dailyStats.push({
        date: date.toISOString().split('T')[0],
        streams: dayStreams.length,
        earnings: dayEarnings.reduce((sum, e) => sum + e.amount, 0),
      });
    }

    return NextResponse.json({
      totalStreams: artist.totalStreams || 0,
      totalEarnings: artist.totalEarnings || 0,
      availableBalance: artist.availableBalance || 0,
      periodStreams: streams.length,
      periodEarnings: earnings.reduce((sum, e) => sum + e.amount, 0),
      dailyStats: dailyStats.reverse(),
      topTracks,
      recentStreams: streams.slice(0, 20),
      monthlyListeners: streams.length,
    });
  } catch (error: any) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}