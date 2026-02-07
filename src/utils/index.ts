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
