// components/SocialHub.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Script from 'next/script';

interface YouTubeVideo {
  id: { videoId: string };
  snippet: {
    title: string;
    thumbnails: { medium: { url: string } };
    publishedAt: string;
  };
}

export default function SocialHub() {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadVideos() {
      try {
        const res = await fetch('/api/youtube');
        if (res.ok) {
          const data = await res.json();
          setVideos(data.items || []);
        }
      } catch (err) {
        console.error("Client fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    loadVideos();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Join Stylish English Academy Online
        </h2>
        <p className="text-gray-500 max-w-md mx-auto">
          Watch recent tutorials and practice spoken English with our global community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ================= YOUTUBE SECTION ================= */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📺</span>
              <h3 className="text-xl font-bold text-gray-200 dark:text-white">Latest Lessons</h3>
            </div>
            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-semibold text-red-600 hover:underline"
            >
              Subscribe
            </a>
          </div>

          <div className="space-y-4">
            {loading ? (
              // Display 4 placeholder cards while fetching data
              <div className="animate-pulse space-y-4">
                {[1, 2, 3, 4].map((n) => (
                  <div key={n} className="flex space-x-4 p-2">
                    <div className="w-32 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length > 0 ? (
              videos.map((video) => (
                <a 
                  key={video.id.videoId} 
                  href={`https://youtube.com{video.id.videoId}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-start space-x-4 p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                  <img 
                    src={video.snippet.thumbnails.medium.url} 
                    alt={video.snippet.title} 
                    className="w-32 h-20 object-cover rounded-lg flex-shrink-0" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-2">
                      {video.snippet.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(video.snippet.publishedAt).toLocaleDateString()}
                    </p>
                  </div>
                </a>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-sm text-gray-400 mb-4">View our educational lessons directly</p>
                <a 
                  href="https://youtube.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-block px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition"
                >
                  Open YouTube Channel
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ================= INSTAGRAM SECTION ================= */}
        <section className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">📸</span>
              <h3 className="text-xl font-bold text-gray-200 dark:text-white">Instagram Feed</h3>
            </div>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-semibold text-pink-600 hover:underline"
            >
              Follow Us
            </a>
          </div>

          <div className="w-full min-h-[350px]">
            <div className="elfsight-app-YOUR-WIDGET-ID-HERE" data-elfsight-app-lazy></div>
          </div>

          <Script src="https://elfsight.com" strategy="afterInteractive" />
        </section>
      </div>
    </div>
  );
}
