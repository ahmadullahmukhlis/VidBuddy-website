"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildDownloadUrl, getShorts } from "@/app/api/api";
import Navbar from "@/components/sections/Navbar";
import TopAlertBar from "@/components/sections/TopAlertBar";
import Footer from "@/components/sections/Footer";

const PER_PAGE = 5;
const SKELETON_COUNT = 6;

const getYouTubeId = (url) => {
  if (!url) return null;
  const match =
    url.match(/[?&]v=([^&#]+)/) ||
    url.match(/youtu\.be\/([^?&#]+)/) ||
    url.match(/youtube\.com\/shorts\/([^?&#]+)/);
  return match ? match[1] : null;
};

export default function ShortsPage() {
  const [videos, setVideos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const cacheRef = useRef(new Map());
  const sentinelRef = useRef(null);
  const itemRefs = useRef([]);

  const loadShorts = useCallback(async (pageToLoad) => {
    setIsLoading(true);
    setError("");
    try {
      if (cacheRef.current.has(pageToLoad)) {
        const cached = cacheRef.current.get(pageToLoad);
        setVideos((prev) => [...prev, ...cached.items]);
        setHasMore(cached.hasMore);
        return;
      }

      const data = await getShorts(pageToLoad, PER_PAGE);
      const items = data?.items || [];
      const more = Boolean(data?.has_more);

      cacheRef.current.set(pageToLoad, { items, hasMore: more });
      setVideos((prev) => [...prev, ...items]);
      setHasMore(more);
    } catch (err) {
      setError(err?.message || "Failed to load shorts");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = (videoUrl) => {
    const downloadUrl = buildDownloadUrl(videoUrl);
    if (!downloadUrl) return;
    window.location.href = downloadUrl;
  };

  const skeletons = useMemo(() => Array.from({ length: SKELETON_COUNT }), []);

  useEffect(() => {
    loadShorts(1);
  }, [loadShorts]);

  useEffect(() => {
    if (!sentinelRef.current) return undefined;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry.isIntersecting || isLoading || !hasMore) return;
        const nextPage = page + 1;
        setPage(nextPage);
        loadShorts(nextPage);
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasMore, isLoading, loadShorts, page]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = Number(entry.target.dataset.index || 0);
            setActiveIndex(index);
          }
        });
      },
      { threshold: 0.6 }
    );

    itemRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [videos]);

  return (
    <main>
      <TopAlertBar />
      <Navbar />
      <section className="bg-black">
        <div className="h-screen overflow-y-scroll snap-y snap-mandatory">
          {error ? (
            <div className="h-screen flex items-center justify-center text-red-400">{error}</div>
          ) : null}

          {videos.map((video, index) => {
            const videoId = getYouTubeId(video.url);
            const isActive = index === activeIndex;
            const src = videoId
              ? `https://www.youtube.com/embed/${videoId}?autoplay=${isActive ? 1 : 0}&mute=1&playsinline=1&loop=1&playlist=${videoId}&controls=1`
              : null;

            return (
              <div
                key={video.id || video.url}
                ref={(node) => {
                  itemRefs.current[index] = node;
                }}
                data-index={index}
                className="h-screen snap-start flex items-center justify-center"
              >
                <div className="relative w-full h-full max-w-md mx-auto">
                  {src ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={src}
                      title={video.title || "Shorts Video"}
                      allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-900 flex items-center justify-center text-gray-300">
                      No preview
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-6 px-5 flex items-center justify-between text-white">
                    <div className="max-w-[70%]">
                      <p className="text-sm font-semibold line-clamp-2">{video.title}</p>
                      {video.views ? <p className="text-xs text-gray-300 mt-1">{video.views} views</p> : null}
                    </div>
                    {video.url ? (
                      <button
                        type="button"
                        onClick={() => handleDownload(video.url)}
                        className="px-4 py-2 rounded-full text-sm font-semibold shadow-lg"
                        style={{ background: "#FF6B00" }}
                      >
                        Download
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && videos.length === 0
            ? skeletons.map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  className="h-screen snap-start flex items-center justify-center"
                >
                  <div className="relative w-full h-full max-w-md mx-auto animate-pulse">
                    <div className="absolute inset-0 bg-gray-900" />
                    <div className="absolute inset-x-0 bottom-6 px-5 space-y-2">
                      <div className="h-4 bg-gray-700 rounded w-3/4" />
                      <div className="h-3 bg-gray-700 rounded w-1/3" />
                      <div className="h-9 bg-gray-700 rounded-full w-32" />
                    </div>
                  </div>
                </div>
              ))
            : null}

          <div ref={sentinelRef} className="h-1" />
        </div>
      </section>
      <Footer />
    </main>
  );
}
