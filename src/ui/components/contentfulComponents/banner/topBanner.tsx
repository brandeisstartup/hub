import { useEffect, useState } from "react";
import Link from "next/link";
import slugify from "slugify";

type shortEvent = {
  title: string;
  startDate: string;
  endDate: string;
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

  // ✅ Delay showing the banner by 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 5000);
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
      <section className="text-white text-xs md:text-base p-2 flex items-center mx-auto px-4">
        <div className="flex-col   gap-1 md:flex-row flex items-center md:gap-4 w-full justify-center">
          <div className="flex flex-row gap-3">
            {isLiveEvent ? <div>Happening Now!!</div> : <div>{message}</div>}
            {event && <div className="font-bold">{event.title}</div>}
          </div>
          <div className="flex  items-center gap-4">
            {event && (
              <>
                <Link
                  href={`/events/${slugify(event.title, { lower: true })}`}
                  className="border text-white px-3 rounded-md font-bold hover:bg-gray-200 hover:text-blue-700 transition">
                  {linkLabel}
                </Link>
                {isLiveEvent && (
                  <Link
                    href={`/day-of/${slugify(event.title, { lower: true })}`}
                    className="border text-white px-3 rounded-md font-bold hover:bg-gray-200 hover:text-blue-700 transition">
                    Go to Live Page
                  </Link>
                )}
              </>
            )}
            <button
              onClick={dismissBanner}
              className="border text-white px-3 rounded-md font-bold hover:bg-gray-200 hover:text-blue-700 transition">
              Dismiss
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TopBanner;
