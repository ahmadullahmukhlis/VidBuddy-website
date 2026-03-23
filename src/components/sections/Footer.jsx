export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 rounded-xl" >
                      <img src="/logo.png" alt="VidBuddy Logo" className="h-8 w-auto object-contain" />
              </div>
              <span className="text-2xl font-bold">
                Vid<span style={{ color: "#FF6B00" }}>Buddy</span>
              </span>
            </div>
            <p className="text-gray-400">The ultimate video downloader for all platforms.</p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Blog
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-[#FF6B00] transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/nasarimukhlis" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="https://x.com/ahmadullahmukhi" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="https://www.instagram.com/nasarimukhlis" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="https://www.linkedin.com/in/ahmadullahmukhlis" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition">
                <i className="fab fa-linkedin"></i>
              </a>
              <a href="mailto:ahmadullahmukhlis2025@gmail.com" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition" aria-label="Email">
                <i className="fas fa-envelope"></i>
              </a>
              
              <a href="https://www.youtube.com/channel/UCtO4W3H2vjA1Q9z8T5Yd4rQ" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-[#FF6B00] transition">
                <i className="fab fa-youtube"></i>
              </a>
            </div>
          </div>
        </div>

        <hr className="border-gray-800 my-8" />

        <div className="text-center text-gray-400">
          <p>
            &copy; 2024 VidBuddy. All rights reserved. | Made with <i className="fas fa-heart" style={{ color: "#FF6B00" }}></i> for video lovers
          </p>
        </div>
      </div>
    </footer>
  );
}
