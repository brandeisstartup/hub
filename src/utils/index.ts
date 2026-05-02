export const formatDate = (dateString: string) => {
  // Parse the date string directly (e.g., "2026-02-07" or "2026-02-07T...")
  const datePart = dateString.split('T')[0]; // Get just the date part
  const [year, month, day] = datePart.split('-').map(Number);
  
  // Create date using local timezone interpretation
  const date = new Date(year, month - 1, day);
  
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(date);
};

export const parseLocalStartDate = (dateString: string): Date => {
  const datePart = dateString.split("T")[0];
  return new Date(`${datePart}T00:00:00`);
};

export const parseLocalEndDate = (dateString: string): Date => {
  const datePart = dateString.split("T")[0];
  return new Date(`${datePart}T23:59:59.999`);
};

export const formatEventDateDisplay = (
  startDate: string,
  endDate?: string
): string => {
  if (!endDate) {
    return formatDate(startDate);
  }

  const start = parseLocalStartDate(startDate);
  const end = parseLocalStartDate(endDate);
  const inclusiveDays =
    Math.floor((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

  // Keep one- and two-day events concise with only the start date.
  if (inclusiveDays <= 2) {
    return formatDate(startDate);
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

export function formatImageUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}

import slugify from "slugify";

/**
 * Consistently generates a URL-safe slug from a project title.
 * Used for routing and matching between search results and detail pages.
 */
export function slugifyTitle(title: string): string {
  if (!title) return "untitled";
  return slugify(title, {
    lower: true,
    strict: true,
    trim: true
  });
}

export function parseYear(raw: string): string {
  if (!raw) return "N/A";
  if (/^\d{4}$/.test(raw)) {
    return raw;
  }
  let ms: number;
  if (/^\d+$/.test(raw)) {
    ms = raw.length <= 10 ? Number(raw) * 1000 : Number(raw);
  } else {
    const parsed = Date.parse(raw);
    ms = isNaN(parsed) ? 0 : parsed;
  }
  const d = new Date(ms);
  return isNaN(d.getTime()) ? "N/A" : d.getFullYear().toString();
}
