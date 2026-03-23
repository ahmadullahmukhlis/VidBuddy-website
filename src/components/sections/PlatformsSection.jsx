const platforms = [
  { icon: "fa-youtube", name: "YouTube" },
  { icon: "fa-facebook", name: "Facebook" },
  { icon: "fa-instagram", name: "Instagram" },
  { icon: "fa-twitter", name: "Twitter" },
  { icon: "fa-tiktok", name: "TikTok" },
  { icon: "fa-vimeo-v", name: "Vimeo" },
  { icon: "fa-dailymotion", name: "Dailymotion" },
  { icon: "fa-twitch", name: "Twitch" },
];

export default function PlatformsSection() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4"
            style={{ background: "#FFE4D6", color: "#FF6B00" }}
          >
            SUPPORTED PLATFORMS
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Works With <span style={{ color: "#FF6B00" }}>1000+ Sites</span>
          </h2>
          <p className="text-xl text-gray-600">Including all major platforms</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {platforms.map((platform) => (
            <div
              key={platform.name}
              className="p-4 border-2 rounded-xl text-center hover-scale cursor-pointer"
              style={{ borderColor: "#FFE4D6" }}
            >
              <i className={`fab ${platform.icon} text-3xl mb-2`} style={{ color: "#FF6B00" }}></i>
              <p className="font-medium text-sm">{platform.name}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
  
        </div>
      </div>
    </section>
  );
}
