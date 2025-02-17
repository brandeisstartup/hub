import React, { useState, useEffect } from "react";

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
  startDate: string; // The start date in 'YYYY-MM-DD' format
  endDate: string; // The end date in 'YYYY-MM-DD' format
}

const CalendarEventsList: React.FC<CalendarEventsListProps> = ({
  startDate,
  endDate
}) => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [calendarData, setCalendarData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);

  // Timer: Update `currentDateTime` every 60 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000); // Check every 60 seconds

    return () => clearInterval(timer); // Cleanup when component unmounts
  }, []);

  useEffect(() => {
    const fetchCalendarData = async () => {
      const calendarId =
        process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_ID || "primary";
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_API;
      const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
        calendarId
      )}/events?key=${apiKey}`;

      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data: CalendarData = await response.json();
        setCalendarData(data);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  if (loading) {
    return;
  }

  if (!calendarData) {
    return;
  }

  // Filter and process events...
  const start = new Date(startDate);
  const end = new Date(endDate);

  const filteredEvents = calendarData.items.filter((event) => {
    const eventStart = new Date(event.start.dateTime || event.start.date!);
    return eventStart >= start && eventStart <= end;
  });

  const eventsByDate = filteredEvents.reduce(
    (acc: Record<string, CalendarEvent[]>, event: CalendarEvent) => {
      const startDate = event.start.dateTime || event.start.date;
      const date = new Date(startDate!).toDateString();

      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);

      acc[date].sort((a, b) => {
        const startA = new Date(a.start.dateTime || a.start.date!).getTime();
        const startB = new Date(b.start.dateTime || b.start.date!).getTime();
        return startA - startB;
      });

      return acc;
    },
    {}
  );

  const sortedDates = Object.keys(eventsByDate).sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );

  // Function to check if the event is the current event
  const isCurrentEvent = (event: CalendarEvent): boolean => {
    const eventStart = new Date(event.start.dateTime || event.start.date!);
    const eventEnd = event.end.dateTime
      ? new Date(event.end.dateTime)
      : new Date(eventStart.getTime() + 3600000); // Default to 1 hour if end time is not provided

    return eventStart <= currentDateTime && currentDateTime <= eventEnd;
  };

  return (
    <div className="w-full flex flex-col align-middle items-center mt-20 mb-20">
      <h2 className=" font-sans pb-2 text-4xl leading-10 tracking-tight">
        Schedule
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sortedDates.length === 0 ? (
          <p>No events found for the selected date range.</p>
        ) : (
          sortedDates.map((date) => (
            <div
              className=" font-sans flex flex-col align-middle items-center"
              key={date}>
              <h3 className="text-2xl mt-4 mb-2">
                {new Date(date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric"
                })}
              </h3>
              <ul className="max-w-md">
                {eventsByDate[date].map((event, index) => (
                  <li
                    key={index}
                    className={`text-sm mb-1 flex flex-row px-1 pb-1 transition-all duration-300 ${
                      isCurrentEvent(event)
                        ? "text-blue-500 bg-white border border-blue-500 rounded-sm shadow-lg"
                        : "other-class"
                    }`}>
                    <span className="w-[80px] text-xxs flex flex-row">
                      {new Date(
                        event.start.dateTime || event.start.date!
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}{" "}
                      -{" "}
                      {new Date(
                        event.end.dateTime || event.end.date!
                      ).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true
                      })}
                    </span>
                    <span className="w-[420px]">
                      <strong>{event.summary}</strong>
                      <br /> {event.description}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarEventsList;
