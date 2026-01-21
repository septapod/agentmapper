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
    <footer className="border-t border-[var(--color-border)] py-4 px-8">
      {currentTime && (
        <p className="text-xs text-[var(--color-text-muted)]">
          LAST UPDATED {currentTime} PT
        </p>
      )}
    </footer>
  );
}
