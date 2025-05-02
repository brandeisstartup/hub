export const formatDate = (dateString: string) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  }).format(new Date(dateString));

export function formatImageUrl(url: string): string {
  if (url.startsWith("//")) {
    return `https:${url}`;
  }
  return url;
}
