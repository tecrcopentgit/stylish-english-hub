// app/api/youtube/route.ts
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;
  const MAX_RESULTS = 4;

  if (!API_KEY || !CHANNEL_ID) {
    return NextResponse.json({ items: [] });
  }

  try {
    // Step A: Convert your Channel ID (UC...) to its automatic upload playlist ID (UU...)
    // All YouTube upload playlists swap the second letter 'C' to a 'U'.
    const uploadPlaylistId = CHANNEL_ID.replace(/^UC/, 'UU');

    // Step B: Use the playlistItems endpoint (Costs only 1 quota unit!)
    const targetUrl = `https://googleapis.com{API_KEY}&playlistId=${uploadPlaylistId}&part=snippet&maxResults=${MAX_RESULTS}`;
    
    const res = await fetch(targetUrl, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json({ items: [] });
    }

    const data = await res.json();

    // Step C: Format the data so it matches your existing <SocialHub /> video card layout properties
    const formattedVideos = (data.items || []).map((item: any) => ({
      id: { videoId: item.snippet.resourceId?.videoId || item.id },
      snippet: {
        title: item.snippet.title,
        thumbnails: item.snippet.thumbnails,
        publishedAt: item.snippet.publishedAt,
      }
    }));

    return NextResponse.json({ items: formattedVideos });
    
  } catch (error) {
    return NextResponse.json({ items: [] });
  }
}
