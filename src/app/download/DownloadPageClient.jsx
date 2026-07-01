"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { buildDownloadUrl, getDownloadInfo, startDownloadWithToast } from "@/app/api/api";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import TopAlertBar from "@/components/sections/TopAlertBar";
import { useSearchParams } from "next/navigation";

const downloads = [
  { name: "Windows", icon: "fa-windows", description: "Windows 10 and later" },
  { name: "macOS", icon: "fa-apple", description: "macOS 12+ Intel & Apple Silicon" },
  { name: "Android", icon: "fa-android", description: "Android 9+ mobile app" },
  { name: "Browser", icon: "fa-chrome", description: "Chrome & Edge extension" },
];

export default function DownloadPageClient() {
  const searchParams = useSearchParams();
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("video");
  const [selectedFormatId, setSelectedFormatId] = useState(null);
  const hasLoadedFromQuery = useRef(false);
  const encodedUrl = useMemo(() => encodeURIComponent(videoUrl.trim()), [videoUrl]);
  const canDownload = encodedUrl.length > 0;

  const loadVideoInfo = useCallback(async (url) => {
    if (!url?.trim()) return;
    setIsLoading(true);
    setError("");
    try {
      const data = await getDownloadInfo(url);
      setVideoInfo(data);
      setSelectedFormatId(null);
      setActiveTab("video");
    } catch (err) {
      setError(err?.message || "Failed to load video info");
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDownload = async () => {
    if (!canDownload) return;
    await loadVideoInfo(videoUrl);
  };

  const handleFormatDownload = (formatId) => {
    const downloadUrl = buildDownloadUrl(videoUrl, formatId);
    if (!downloadUrl) return;
    startDownloadWithToast(downloadUrl);
  };

  const formats = videoInfo?.formats || [];
  const videoFormats = formats.filter((format) => format.vcodec !== "none");
  const audioFormats = formats.filter((format) => format.vcodec === "none");

  useEffect(() => {
    if (hasLoadedFromQuery.current) return;
    const url = searchParams.get("url");
    if (!url) return;
    hasLoadedFromQuery.current = true;
    setVideoUrl(url);
    loadVideoInfo(url);
  }, [loadVideoInfo, searchParams]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleDownload();
    }
  };

  return (
    <main>
      <TopAlertBar />
      <Navbar />
      <PageHero
        tag="DOWNLOAD"
        title="Get VidBuddy on"
        highlight="every device"
        description="Choose your platform and start downloading in seconds."
      />
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div
            className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row max-w-3xl mx-auto mb-10 primary-border"
            style={{ border: "2px solid #FF6B00" }}
          >
            <input
              type="text"
              placeholder="Paste your video URL here..."
              value={videoUrl}
              onChange={(event) => setVideoUrl(event.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-4 text-gray-800 outline-none rounded-xl sm:rounded-none sm:rounded-l-xl"
            />
            <button
              type="button"
              onClick={handleDownload}
              disabled={!canDownload || isLoading}
              className="px-8 py-4 text-white font-semibold rounded-xl sm:rounded-none sm:rounded-r-xl transition hover:opacity-90 disabled:opacity-50"
              style={{ background: "#FF6B00" }}
            >
              {isLoading ? "Loading..." : "Download Now"} <i className="fas fa-download ml-2"></i>
            </button>
          </div>
          {error ? <p className="mt-4 text-sm text-red-600 text-center">{error}</p> : null}
          {videoInfo ? (
            <div className="mt-6 bg-white p-4 rounded-2xl shadow-lg max-w-3xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                {videoInfo.thumbnail ? (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title || "Video thumbnail"}
                    className="w-full sm:w-40 rounded-xl object-cover"
                  />
                ) : null}
                <div>
                  <p className="text-lg font-semibold text-gray-900">{videoInfo.title}</p>
                  <p className="text-sm text-gray-500">{videoInfo.duration}</p>
                </div>
              </div>
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === "video" ? "bg-orange-100" : "bg-white"}`}
                  style={{ borderColor: "#FFE4D6", color: "#FF6B00" }}
                >
                  Video
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("audio")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border ${activeTab === "audio" ? "bg-orange-100" : "bg-white"}`}
                  style={{ borderColor: "#FFE4D6", color: "#FF6B00" }}
                >
                  Audio
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(activeTab === "video" ? videoFormats : audioFormats).map((format) => {
                  const label = `${format.quality} • ${format.ext} • ${format.filesize}`;
                  const isSelected = selectedFormatId === format.format_id;
                  return (
                    <button
                      key={format.format_id}
                      type="button"
                      onClick={() => setSelectedFormatId(format.format_id)}
                      className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl border transition text-left ${
                        isSelected ? "shadow" : "hover:shadow"
                      }`}
                      style={{ borderColor: isSelected ? "#FF6B00" : "#FFE4D6" }}
                    >
                      <span className="text-sm font-medium text-gray-800">{label}</span>
                      <span className="text-xs text-gray-500">{activeTab === "audio" ? "Audio" : "Video"}</span>
                    </button>
                  );
                })}
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleFormatDownload(selectedFormatId)}
                  disabled={!selectedFormatId}
                  className="w-full py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition disabled:opacity-50"
                  style={{ background: "#FF6B00" }}
                >
                  Download Selected
                </button>
              </div>
            </div>
          ) : null}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {downloads.map((item) => (
              <div key={item.name} className="gradient-card p-8 rounded-2xl border hover-scale" style={{ borderColor: "#FFE4D6" }}>
                <div className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center" style={{ background: "#FFE4D6" }}>
                  <i className={`fab ${item.icon} text-2xl`} style={{ color: "#FF6B00" }}></i>
                </div>
                <h3 className="text-xl font-bold mb-2">{item.name}</h3>
                <p className="text-gray-600 mb-6">{item.description}</p>
                <button
                  type="button"
                  onClick={handleDownload}
                  disabled={!canDownload}
                  className="w-full py-2.5 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition"
                  style={{ background: "#FF6B00" }}
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
      <Footer />
    </main>
  );
}
