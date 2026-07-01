import { Suspense } from "react";
import DownloadPageClient from "./DownloadPageClient";

export default function DownloadPage() {
  return (
    <Suspense
      fallback={
        <main>
          <div className="min-h-[60vh] flex items-center justify-center px-6">
            <p className="text-sm text-gray-500">Loading download page...</p>
          </div>
        </main>
      }
    >
      <DownloadPageClient />
    </Suspense>
  );
}
