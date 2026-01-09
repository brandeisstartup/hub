import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.GOOGLE_CALENDAR_API_KEY;

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

interface CalendarApiResponse {
  items: CalendarEvent[];
  error?: { message: string };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { calendarId, startDate, endDate } = req.query;

  if (!API_KEY) {
    return res.status(500).json({ error: "Missing Google Calendar API key" });
  }

  // Use provided calendarId or fall back to default from env
  const effectiveCalendarId = 
    (calendarId && typeof calendarId === "string" ? calendarId : null) ||
    process.env.GOOGLE_CALENDAR_ID;

  if (!effectiveCalendarId) {
    return res.status(400).json({ error: "No calendar ID available" });
  }

  if (!startDate || !endDate) {
    return res.status(400).json({
      error: "Missing required parameters: startDate, endDate"
    });
  }

  try {
    const params = new URLSearchParams({ key: API_KEY });
    
    if (process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TIMEZONE) {
      params.set("timeZone", process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TIMEZONE);
    }

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      effectiveCalendarId
    )}/events?${params.toString()}`;

    const response = await fetch(url);

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Google Calendar API Error:", errorData);
      return res.status(response.status).json({
        error: errorData.error?.message || "Failed to fetch calendar events"
      });
    }

    const data: CalendarApiResponse = await response.json();

    return res.status(200).json({ events: data.items || [] });
  } catch (err: unknown) {
    console.error("Calendar API Error:", err);
    return res.status(500).json({
      error: "Failed to fetch calendar events"
    });
  }
}
