import { useEffect, useState } from "react";
import Link from "next/link";
import slugify from "slugify";

type shortEvent = {
  title: string;
  startDate: string;
  endDate: string;
  showLiveInfo?: boolean;
  pitchSummitLiveInfoSheetUrl?: string;
};

interface TopBannerProps {
  message: string;
  linkLabel: string;
  dismissTimeout?: number; // Time in hours before it reappears (default: 24h)
  event?: shortEvent | null;
}

// Function to check if the event is live
const isEventLive = (event?: shortEvent | null): boolean => {
  if (!event) return false;

  const slug = slugify(event.title, { lower: true });
  // Force Pitch Summit to be considered live for testing regardless of dates.
  if (slug === "pitch-summit") return true;

  const today = new Date();
  const startDate = new Date(event.startDate);
  const endDate = new Date(event.endDate);

  return today >= startDate && today <= endDate;
};

const TopBanner = ({
  event,
  message,
  linkLabel,
  dismissTimeout = 24
}: TopBannerProps) => {
  const [visible, setVisible] = useState(false);
  const [isLiveEvent] = useState(isEventLive(event));

  // Show banner after mount
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Hide banner function with timeout
  const dismissBanner = () => {
    setVisible(false);
    const expiryTimestamp = Date.now() + dismissTimeout * 60 * 60 * 1000;
    localStorage.setItem("dismissedBannerExpiry", expiryTimestamp.toString());
  };

  // Check if the banner was dismissed before and if it should reappear
  useEffect(() => {
    const storedTimestamp = localStorage.getItem("dismissedBannerExpiry");
    if (storedTimestamp) {
      const expiryTime = parseInt(storedTimestamp, 10);
      if (Date.now() < expiryTime) {
        setVisible(false);
      } else {
        localStorage.removeItem("dismissedBannerExpiry");
      }
    }
  }, []);

  // If it's not time to show yet or the banner was dismissed, return null
  if (!visible) return null;

  return (
    <div
      className={`bg-BrandeisBrandShade overflow-hidden transition-all duration-700 ${
        visible
          ? "h-auto opacity-100 translate-y-0"
          : "h-0 opacity-0 -translate-y-full"
      }`}>
      <section className="text-white text-xs md:text-base p-3">
        <div className="mx-auto flex items-center justify-center gap-4 px-4 relative">
          <div className="flex flex-row items-center gap-6">
            {event && isLiveEvent ? (
              <span className="font-semibold text-center">{event.title} — Happening now</span>
            ) : (
              <span className="text-center">{message}</span>
            )}
            {event && (
              <Link
                href={
                  event.showLiveInfo && isLiveEvent
                    ? `/day-of/${slugify(event.title, { lower: true })}`
                    : `/events/${slugify(event.title, { lower: true })}`
                }
                className="border text-white px-3 py-1 rounded-md font-bold hover:bg-gray-200 hover:text-blue-700 transition">
                {event.showLiveInfo && isLiveEvent ? "Go to Live Info" : linkLabel}
              </Link>
            )}
          </div>

          <button
            onClick={dismissBanner}
            aria-label="Dismiss banner"
            className="absolute right-4 text-white text-xl font-light hover:opacity-70 transition">
            ×
          </button>
        </div>
      </section>
    </div>
  );
};

export default TopBanner;
