export function Footer() {
  // Build timestamp - set at build time
  const buildTime = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();

  const formatBuildTime = () => {
    const date = new Date(buildTime);
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  return (
    <footer className="border-t border-[var(--color-border)] py-4 px-8">
      <p className="text-xs text-[var(--color-text-muted)]">
        LAST UPDATED {formatBuildTime()} PT
      </p>
    </footer>
  );
}
