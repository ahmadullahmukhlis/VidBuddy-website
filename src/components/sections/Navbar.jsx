"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const isActive = (href) => pathname === href;
  const linkClass = (href) =>
    `font-medium transition ${
      isActive(href) ? "text-[#FF6B00]" : "text-gray-700 hover:text-[#FF6B00]"
    }`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-1.5">
            <img src="./public/logo.png" alt="VidBuddy Logo" className="h-8 w-auto object-contain" />
            <span className="text-2xl font-bold text-gray-800">
              Vid<span style={{ color: "#FF6B00" }}>Buddy</span>
            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            <Link href="/" className={linkClass("/")}>
              Home
            </Link>
            <Link href="/features" className={linkClass("/features")}>
              Features
            </Link>
            <Link href="/discover" className={linkClass("/discover")}>
              Discover
            </Link>
            <Link href="/shorts" className={linkClass("/shorts")}>
              Shorts
            </Link>
            <Link href="/how-it-works" className={linkClass("/how-it-works")}>
              How It Works
            </Link>
            <Link href="/supported-sites" className={linkClass("/supported-sites")}>
              Supported Sites
            </Link>
            {/* <Link href="/premium" className={linkClass("/premium")}>
              Premium
            </Link> */}
            <Link href="/faq" className={linkClass("/faq")}>
              FAQ
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* <Link href="/login" className="px-5 py-2.5 text-gray-700 hover:text-[#FF6B00] font-medium transition">
              Login
            </Link> */}
            <Link
              href="/download"
              className="px-3 py-2.5 text-white rounded-xl font-semibold transition shadow-lg hover:shadow-xl"
              style={{ background: "#FF6B00" }}
            >
               <i className="fas fa-download ml-2 text-xl"></i>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
