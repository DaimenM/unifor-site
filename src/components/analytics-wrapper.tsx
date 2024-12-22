'use client'

import { useEffect } from 'react';

interface AnalyticsWrapperProps {
  articleId: string;
  children: React.ReactNode;
}

export function AnalyticsWrapper({ articleId, children }: AnalyticsWrapperProps) {
  useEffect(() => {
    // Log visit analytics
    const logVisit = async () => {
      const getPlatform = () => {
        const userAgent = window.navigator.userAgent;
        if (/mobile/i.test(userAgent)) return "mobile";
        if (/tablet/i.test(userAgent)) return "tablet";
        return "desktop";
      };

      try {
        await fetch("/api/analytics", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            articleId,
            platform: getPlatform(),
          }),
        });
      } catch (error) {
        console.error("Failed to log visit:", error);
      }
    };

    logVisit();
  }, [articleId]);

  return <>{children}</>;
} 