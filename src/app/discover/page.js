"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { getTrendingVideos, searchVideos } from "@/app/api/api";
import Navbar from "@/components/sections/Navbar";
import TopAlertBar from "@/components/sections/TopAlertBar";
import Footer from "@/components/sections/Footer";

const tabs = [
  { id: "trending", label: "Trending", type: "trending" },
  { id: "music", label: "Music", type: "search", query: "music" },
  { id: "movies", label: "Movies", type: "search", query: "movies" },
  { id: "gaming", label: "Gaming", type: "search", query: "gaming" },
  { id: "news", label: "News", type: "search", query: "news" },
  { id: "sports", label: "Sports", type: "search", query: "sports" },
  { id: "learning", label: "Learning", type: "search", query: "learning" },
  { id: "fashion", label: "Fashion & Beauty", type: "search", query: "fashion beauty" },
  { id: "podcasts", label: "Podcasts", type: "search", query: "podcasts" },
  { id: "afghan-songs", label: "Songs Afghanistan", type: "search", query: "afghan songs" },
];

export default function DiscoverPage() {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const activeLabel = useMemo(() => activeTab?.label || "Trending", [activeTab]);

  const loadTab = useCallback(async (tab) => {
    setIsLoading(true);
    setError("");
    setVideos([]);
    try {
      if (tab.type == "trending") {
        const data = await getTrendingVideos();
        setVideos(data || []);
      } else {
        const data = await searchVideos(tab.query);
        setVideos(data || []);
      }
    } catch (err) {
      setError(err?.message || "Failed to load videos");
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    setIsLoading(true);
    setError("");
    setVideos([]);
    try {
      const data = await searchVideos(searchQuery.trim());
      setVideos(data || []);
    } catch (err) {
      setError(err?.message || "Search failed");
      setVideos([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    loadTab(activeTab);
  }, [activeTab, loadTab]);

  return (
    <main>
      <TopAlertBar />
      <Navbar />
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Discover</h1>
              <p className="text-gray-600 mt-2">Trending, music, movies, and more.</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${
                    activeTab.id === tab.id ? "bg-orange-100" : "bg-white"
                  }`}
                  style={{ borderColor: "#FFE4D6", color: "#FF6B00" }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div
              className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row max-w-3xl primary-border"
              style={{ border: "2px solid #FF6B00" }}
            >
              <input
                type="text"
                placeholder="Search videos..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSearch();
                  }
                }}
                className="flex-1 px-4 py-4 text-gray-800 outline-none rounded-xl sm:rounded-none sm:rounded-l-xl"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-8 py-4 text-white font-semibold rounded-xl sm:rounded-none sm:rounded-r-xl transition hover:opacity-90"
                style={{ background: "#FF6B00" }}
              >
                Search
              </button>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">Showing: {activeLabel}</p>
              {isLoading ? <p className="text-sm text-gray-500">Loading...</p> : null}
            </div>

            {error ? <p className="text-sm text-red-600">{error}</p> : null}

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {isLoading && videos.length === 0
                ? Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className="bg-white rounded-2xl shadow-lg border animate-pulse"
                      style={{ borderColor: "#FFE4D6" }}
                    >
                      <div className="w-full h-48 rounded-t-2xl bg-gray-200" />
                      <div className="p-4 space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-200 rounded w-1/3" />
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))
                : null}
              {videos.map((video) => (
                <div
                  key={video.id || video.url}
                  className="bg-white rounded-2xl shadow-lg border"
                  style={{ borderColor: "#FFE4D6" }}
                >
                  {video.thumbnail ? (
                    <img
                      src={video.thumbnail}
                      alt={video.title || "Video"}
                      className="w-full h-48 object-cover rounded-t-2xl"
                    />
                  ) : null}
                  <div className="p-4">
                    <p className="font-semibold text-gray-900 line-clamp-2">{video.title}</p>
                    {video.views ? <p className="text-sm text-gray-500 mt-1">{video.views} views</p> : null}
                    <div className="mt-4 flex gap-3">
                      {video.url ? (
                        <Link
                          href={`/download?url=${encodeURIComponent(video.url)}`}
                          className="px-4 py-2 text-white rounded-xl text-sm font-semibold"
                          style={{ background: "#FF6B00" }}
                        >
                          Get Formats
                        </Link>
                      ) : null}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
