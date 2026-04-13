import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import slugify from "slugify";
import {
  parseLocalEndDate,
  parseLocalStartDate
} from "@/utils";
import { useCompetitions } from "@/context/EventContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid";

type shortEvent = {
  title: string;
  startDate: string;
  endDate: string;
  showLiveInfo?: boolean;
  pitchSummitLiveInfoSheetUrl?: string;
};

interface TopBannerProps {
  linkLabel: string;
  dismissTimeout?: number; // Time in hours before it reappears (default: 24h)
}

// Function to check if the event is live
const isEventLive = (event?: shortEvent): boolean => {
  if (!event) return false;

  const today = new Date();

  const startDate = parseLocalStartDate(event.startDate);
  const endDate = parseLocalEndDate(event.endDate);

  return today >= startDate && today <= endDate;
};

const formatDateNoYear = (dateString: string): string => {
  const datePart = dateString.split("T")[0];
  const [year, month, day] = datePart.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric"
  }).format(date);
};

const formatEventDateDisplayNoYear = (
  startDate: string,
  endDate?: string
): string => {
  if (!endDate) {
    return formatDateNoYear(startDate);
  }

  const start = parseLocalStartDate(startDate);
  const end = parseLocalStartDate(endDate);
  const inclusiveDays =
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  if (inclusiveDays <= 2) {
    return formatDateNoYear(startDate);
  }

  return `${formatDateNoYear(startDate)} - ${formatDateNoYear(endDate)}`;
};

const TopBanner = ({
  linkLabel,
  dismissTimeout = 24
}: TopBannerProps) => {
  const { thisWeekEvents } = useCompetitions();
  const events = thisWeekEvents;
  const [visible, setVisible] = useState(false);
  const [eventIndex, setEventIndex] = useState(0);
  const [hasManualNavigation, setHasManualNavigation] = useState(false);

  const currentEvent = useMemo(() => {
    if (events.length === 0) return null;
    return events[eventIndex % events.length];
  }, [eventIndex, events]);

  const currentEventIsLive = useMemo(
    () => isEventLive(currentEvent || undefined),
    [currentEvent]
  );

  const currentEventDateLabel = useMemo(() => {
    if (!currentEvent) return "";
    return formatEventDateDisplayNoYear(
      currentEvent.startDate,
      currentEvent.endDate
    );
  }, [currentEvent]);

  useEffect(() => {
    setEventIndex(0);
    setHasManualNavigation(false);
  }, [events.length]);

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

  useEffect(() => {
    if (!visible || events.length <= 1 || hasManualNavigation) return;

    const interval = setInterval(() => {
      setEventIndex((prev) => (prev + 1) % events.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [events.length, hasManualNavigation, visible]);

  // If it's not time to show yet or the banner was dismissed, return null
  if (!visible || !currentEvent) return null;

  const showEventControls = events.length > 1;

  const goToNextEvent = () => {
    setHasManualNavigation(true);
    setEventIndex((prev) => (prev + 1) % events.length);
  };

  const goToPreviousEvent = () => {
    setHasManualNavigation(true);
    setEventIndex((prev) => (prev - 1 + events.length) % events.length);
  };

  const goToEvent = (index: number) => {
    setHasManualNavigation(true);
    setEventIndex(index);
  };

  return (
    <div
      className={`bg-BrandeisBrandShade overflow-hidden transition-all duration-700 block ${
        visible
          ? "h-auto opacity-100 translate-y-0"
          : "h-0 opacity-0 -translate-y-full"
      }`}>
      <section className="text-white text-xs md:text-base p-3 m-0">
        <div className="mx-auto flex items-center justify-center gap-4 px-4 relative">
          <div className="flex flex-row items-center gap-6">
            <div className="flex items-center justify-center gap-3 md:gap-6">
              <div className="flex flex-col items-center text-center">
                <Link
                  href={
                    currentEvent.showLiveInfo && currentEventIsLive
                      ? `/day-of/${slugify(currentEvent.title, { lower: true })}`
                      : `/events/${slugify(currentEvent.title, { lower: true })}`
                  }
                  className="font-semibold text-xs underline underline-offset-2 hover:opacity-90 transition md:hidden">
                  {currentEvent.title}
                  {currentEventIsLive ? " - Happening now" : ""}
                </Link>
                <span className="hidden md:inline font-semibold md:text-base">
                  {currentEvent.title}
                  {currentEventIsLive ? " - Happening now" : ""}
                </span>
                <span className="text-[11px] md:text-sm opacity-90">
                  {currentEventDateLabel}
                </span>
              </div>

              <Link
                href={
                  currentEvent.showLiveInfo && currentEventIsLive
                    ? `/day-of/${slugify(currentEvent.title, { lower: true })}`
                    : `/events/${slugify(currentEvent.title, { lower: true })}`
                }
                className="hidden md:inline-flex md:no-underline md:border md:px-3 md:py-1 md:rounded-md md:text-white md:font-bold md:hover:bg-gray-200 md:hover:text-blue-700 transition">
                {currentEvent.showLiveInfo && currentEventIsLive
                  ? "Go to Live Info"
                  : linkLabel}
              </Link>
            </div>

            {showEventControls && (
              <div className="flex items-center gap-2" aria-live="polite">
                <button
                  type="button"
                  onClick={goToPreviousEvent}
                  aria-label="Show previous event"
                  className="h-7 w-7 md:h-8 md:w-8 inline-flex items-center justify-center rounded-full hover:bg-white/20 transition">
                  <ChevronLeftIcon className="h-4 w-4" aria-hidden="true" />
                </button>

                <div className="flex items-center gap-1.5">
                  {events.map((event, index) => {
                    const isActive = index === eventIndex;
                    return (
                      <button
                        key={`${event.title}-${index}`}
                        type="button"
                        onClick={() => goToEvent(index)}
                        aria-label={`Show event ${index + 1}`}
                        className={`h-2.5 w-2.5 rounded-full transition ${
                          isActive ? "bg-white" : "bg-white/40 hover:bg-white/70"
                        }`}
                      />
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={goToNextEvent}
                  aria-label="Show next event"
                  className="h-7 w-7 md:h-8 md:w-8 inline-flex items-center justify-center rounded-full hover:bg-white/20 transition">
                  <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
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
