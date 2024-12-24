"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

// Create a separate component for the loading logic
function LoadingTransitionContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute top-0 left-0 w-full h-1 bg-red-100">
        <div className="absolute top-0 left-0 h-full bg-red-600 animate-[loading_1s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}

// Wrap the content component with Suspense
export function LoadingTransition() {
  return (
    <Suspense>
      <LoadingTransitionContent />
    </Suspense>
  );
} 