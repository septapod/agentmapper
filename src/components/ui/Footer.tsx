"use client";

import { useEffect, useState } from "react";

export function Footer() {
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "America/Los_Angeles",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      const pacificTime = now.toLocaleString("en-US", options);
      setCurrentTime(pacificTime);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-[var(--color-bg)]/80 backdrop-blur-sm border-t border-[var(--color-border)] py-2 px-4 z-50">
      <div className="max-w-7xl mx-auto text-left">
        {currentTime && (
          <p className="text-xs text-[var(--color-text-muted)]">
            LAST UPDATED {currentTime} PT
          </p>
        )}
      </div>
    </footer>
  );
}
