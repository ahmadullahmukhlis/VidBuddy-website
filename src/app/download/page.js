"use client";

import { useCallback, useState } from "react";
import { getDownloadInfo } from "@/app/api/api";
import CtaSection from "@/components/sections/CtaSection";
import Footer from "@/components/sections/Footer";
import Navbar from "@/components/sections/Navbar";
import PageHero from "@/components/sections/PageHero";
import TopAlertBar from "@/components/sections/TopAlertBar";

const downloads = [
  {
    name: "Windows",
    icon: "fa-windows",
    description: "Windows 10 and later",
  },
  {
    name: "macOS",
    icon: "fa-apple",
    description: "macOS 12+ Intel & Apple Silicon",
  },
  {
    name: "Android",
    icon: "fa-android",
    description: "Android 9+ mobile app",
  },
  {
    name: "Browser",
    icon: "fa-chrome",
    description: "Chrome & Edge extension",
  },
];

export default function DownloadPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [videoInfo, setVideoInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("video");

  const canLoad = videoUrl.trim().length > 0;

  const loadVideoInfo = useCallback(async () => {
    if (!videoUrl?.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await getDownloadInfo(videoUrl);
      setVideoInfo(data);
      setActiveTab("video");
    } catch (err) {
      setError(err?.message || "Failed to load video info");
      setVideoInfo(null);
    } finally {
      setIsLoading(false);
    }
  }, [videoUrl]);

  const formats = videoInfo?.formats || [];
  const videoFormats = formats.filter(
    (format) => format.vcodec !== "none"
  );
  const audioFormats = formats.filter(
    (format) => format.vcodec === "none"
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      loadVideoInfo();
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

          {/* URL INPUT */}
          <div
            className="bg-white p-2 rounded-2xl shadow-xl flex flex-col sm:flex-row max-w-3xl mx-auto mb-10"
            style={{ border: "2px solid #FF6B00" }}
          >
            <input
              type="text"
              placeholder="Paste your video URL here..."
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 px-4 py-4 text-gray-800 outline-none rounded-xl"
            />

            <button
              type="button"
              onClick={loadVideoInfo}
              disabled={!canLoad || isLoading}
              className="px-8 py-4 text-white font-semibold rounded-xl transition disabled:opacity-50"
              style={{ background: "#FF6B00" }}
            >
              {isLoading ? "Loading..." : "Load Info"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-sm text-red-600 text-center">
              {error}
            </p>
          )}

          {/* VIDEO INFO */}
          {videoInfo && (
            <div className="mt-6 bg-white p-4 rounded-2xl shadow-lg max-w-3xl mx-auto">

              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {videoInfo.thumbnail && (
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title || "Thumbnail"}
                    className="w-full sm:w-40 rounded-xl object-cover"
                  />
                )}

                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {videoInfo.title}
                  </p>
                  <p className="text-sm text-gray-500">
                    {videoInfo.duration}
                  </p>
                </div>
              </div>

              {/* TABS */}
              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("video")}
                  className={`px-4 py-2 rounded-full border ${
                    activeTab === "video"
                      ? "bg-orange-100"
                      : "bg-white"
                  }`}
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FF6B00",
                  }}
                >
                  Video
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("audio")}
                  className={`px-4 py-2 rounded-full border ${
                    activeTab === "audio"
                      ? "bg-orange-100"
                      : "bg-white"
                  }`}
                  style={{
                    borderColor: "#FFE4D6",
                    color: "#FF6B00",
                  }}
                >
                  Audio
                </button>
              </div>

              {/* READ ONLY FORMATS */}
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {(activeTab === "video"
                  ? videoFormats
                  : audioFormats
                ).map((format) => (
                  <div
                    key={format.format_id}
                    className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border"
                    style={{ borderColor: "#FFE4D6" }}
                  >
                    <span className="text-sm font-medium text-gray-800">
                      {format.quality} • {format.ext} •{" "}
                      {format.filesize}
                    </span>

                    <span className="text-xs text-gray-500">
                      READ ONLY
                    </span>
                  </div>
                ))}
              </div>

              {/* DOWNLOAD DISABLED */}
              <div className="mt-4">
                <button
                  type="button"
                  disabled
                  className="w-full py-3 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                  style={{
                    background: "#999",
                    color: "#fff",
                  }}
                >
                  Download Disabled
                </button>
              </div>
            </div>
          )}

          {/* PLATFORM CARDS */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {downloads.map((item) => (
              <div
                key={item.name}
                className="p-8 rounded-2xl border"
                style={{ borderColor: "#FFE4D6" }}
              >
                <div
                  className="w-14 h-14 rounded-xl mb-5 flex items-center justify-center"
                  style={{ background: "#FFE4D6" }}
                >
                  <i
                    className={`fab ${item.icon} text-2xl`}
                    style={{ color: "#FF6B00" }}
                  />
                </div>

                <h3 className="text-xl font-bold mb-2">
                  {item.name}
                </h3>

                <p className="text-gray-600 mb-6">
                  {item.description}
                </p>

                <button
                  type="button"
                  disabled
                  className="w-full py-2.5 rounded-xl font-semibold opacity-60 cursor-not-allowed"
                  style={{
                    background: "#999",
                    color: "#fff",
                  }}
                >
                  Read Only
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
