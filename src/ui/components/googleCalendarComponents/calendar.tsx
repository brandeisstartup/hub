import React, { useState, useEffect } from "react";
import Heading from "@/ui/components/brandeisBranding/headings/heading";

interface CalendarEvent {
  id: string;
  start: {
    dateTime?: string;
    date?: string;
  };
  end: {
    dateTime?: string;
    date?: string;
  };
  summary: string;
  description?: string;
}

interface CalendarData {
  items: CalendarEvent[];
}

interface CalendarEventsListProps {
  startDate: string;
  endDate: string;
  calendarId?: string;
}

const Card: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
    {children}
  </div>
);

const CalendarEventsList: React.FC<CalendarEventsListProps> = ({
  startDate,
  endDate,
  calendarId
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchCalendarData = async () => {
      const params = new URLSearchParams({ startDate, endDate });

      if (calendarId) {
        params.set("calendarId", calendarId);
      }

      try {
        const response = await fetch(
          `/api/v1/calendar/events?${params.toString()}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch calendar events");
        }
        const data = await response.json();
        setCalendarData({ items: data.events || [] });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, [calendarId, startDate, endDate]);

  if (loading || !calendarData) {
    return null;
  }

  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setDate(end.getDate() + 1);

  const filteredEvents = calendarData.items.filter((event) => {
    const eventStart = new Date(event.start.dateTime || event.start.date!);
    return eventStart >= start && eventStart <= end;
  });

  const eventsByDate = filteredEvents.reduce(
    (acc: Record<string, CalendarEvent[]>, event) => {
      const dateKey = new Date(
        event.start.dateTime || event.start.date!
      ).toDateString();

      acc[dateKey] = acc[dateKey] || [];
      acc[dateKey].push(event);

      acc[dateKey].sort((a, b) => {
        const aTime = new Date(
          a.start.dateTime || a.start.date!
        ).getTime();
        const bTime = new Date(
          b.start.dateTime || b.start.date!
        ).getTime();
        return aTime - bTime;
      });

      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(eventsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  const isCurrentEvent = (event: CalendarEvent): boolean => {
    const start = new Date(event.start.dateTime || event.start.date!);
    const end = event.end.dateTime
      ? new Date(event.end.dateTime)
      : new Date(start.getTime() + 60 * 60 * 1000);

    return start <= currentDateTime && currentDateTime <= end;
  };

  return (
    <section className="w-full mt-20 mb-20 px-4 font-sans">
      <div className="mx-auto max-w-8xl w-full">
        <Heading label="Live Schedule" />
        <p className="text-gray-500 mb-6 text-xs font-sans">
          Last updated: {currentDateTime.toLocaleTimeString()}
        </p>

        {sortedDates.length === 0 ? (
          <p className="text-sm text-gray-500 mt-4 font-sans">
            No events found for the selected date range.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedDates.map((date) => (
              <Card key={date}>
                <div className="p-4 space-y-4">
                  <time className="block text-lg font-semibold text-gray-900 font-sans">
                    {new Date(date).toLocaleDateString("en-US", {
                      weekday: "long",
                      month: "long",
                      day: "numeric"
                    })}
                  </time>

                  <ul className="space-y-2">
                    {eventsByDate[date].map((event, index) => {
                      const isLive = isCurrentEvent(event);

                      return (
                        <li
                          key={index}
                          className={`rounded-md border p-3 text-sm transition font-sans ${
                            isLive
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200"
                          }`}
                        >
                          <div className="flex justify-between items-start gap-3">
                            <time className="shrink-0 text-xs font-medium text-gray-600 font-sans">
                              {new Date(
                                event.start.dateTime || event.start.date!
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TIMEZONE
                              })}
                              {" – "}
                              {new Date(
                                event.end.dateTime || event.end.date!
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                timeZone: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TIMEZONE
                              })}
                            </time>

                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 font-sans">
                                {event.summary}
                              </p>
                              {event.description && (
                                <p className="text-xs text-gray-600 mt-1 font-sans">
                                  {event.description}
                                </p>
                              )}
                            </div>
                          </div>

                          {isLive && (
                            <p className="mt-2 text-xs font-semibold text-blue-600 font-sans">
                              ● Happening now
                            </p>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CalendarEventsList;
