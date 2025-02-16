import { useEffect, useState } from "react";
import Link from "next/link";
import slugify from "slugify";

type shortEvent = {
  title: string;
};
interface TopBannerProps {
  message: string;
  linkLabel: string;
  dismissTimeout?: number; // Time in hours before it reappears (default: 24h)
  event?: shortEvent | null;
}

// Arrow function component
const TopBanner = ({
  event,
  message,
  linkLabel,
  dismissTimeout = 24
}: TopBannerProps) => {
  const [visible, setVisible] = useState(true);

  // Hide banner function with timeout
  const dismissBanner = () => {
    setVisible(false);
    const expiryTimestamp = Date.now() + dismissTimeout * 60 * 60 * 1000; // Convert hours to milliseconds
    localStorage.setItem("dismissedBannerExpiry", expiryTimestamp.toString());
  };

  // Check if the banner was dismissed before and if it should reappear
  useEffect(() => {
    const storedTimestamp = localStorage.getItem("dismissedBannerExpiry");
    if (storedTimestamp) {
      const expiryTime = parseInt(storedTimestamp, 10);
      if (Date.now() < expiryTime) {
        setVisible(false); // Hide banner if still within the timeout
      } else {
        localStorage.removeItem("dismissedBannerExpiry"); // Reset after expiry
      }
    }
  }, []);

  if (!visible) return null;

  return (
    <div className="bg-BrandeisBrandShade">
      <section className="text-white p-2 flex items-center mx-auto  px-4">
        <div className="flex items-center gap-4 w-full justify-center">
          <div className="flex flex-row gap-3">
            <div> {message}</div>
            {event && <div> {event.title}</div>}
          </div>
          <div className="flex items-center gap-4 px-6">
            {event && (
              <Link
                href={`/events/${slugify(event.title, { lower: true })}`}
                className="bg-white text-blue-600 px-3 rounded-md font-bold hover:bg-gray-200 transition">
                {linkLabel}
              </Link>
            )}
            <button
              onClick={dismissBanner}
              className="text-white hover:text-gray-300 transition">
              ✖
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TopBanner;
