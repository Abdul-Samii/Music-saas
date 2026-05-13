"use client";

import { useEffect } from "react";

export const TrackingWrapper = () => {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq
    ) {
      (window as Window & { fbq?: (...args: unknown[]) => void }).fbq!(
        "track",
        "ViewContent",
        {
          content_name: "Landing Page",
          content_category: "Music Marketing",
        },
      );
    }
  }, []);
  return <></>;
};
