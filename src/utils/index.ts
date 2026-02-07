export const formatDate = (dateString: string) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_TIMEZONE || "UTC"
  }).format(new Date(dateString));
};

export function formatImageUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
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
