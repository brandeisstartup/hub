import { useEffect, useState } from "react";

/**
 * Generic hook to fetch and parse CSV data from a public Google Sheet
 * @param sheetId - The Google Sheets ID
 * @param parseFunction - Function to parse the CSV string into desired format
 * @param pollInterval - Interval in milliseconds to refresh data (default: 60000 = 1 minute)
 */
export const usePublicSheet = <T,>(
  sheetId: string,
  parseFunction: (csv: string) => T,
  pollInterval: number = 60000
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!sheetId) {
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;

      const response = await fetch(csvUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch sheet: ${response.statusText}`);
      }

      const csv = await response.text();
      const parsedData = parseFunction(csv);
      setData(parsedData);
    } catch (err) {
      console.error("Error fetching public sheet:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Fetch data on mount and set up polling
  useEffect(() => {
    fetchData();

    const interval = setInterval(fetchData, pollInterval);
    return () => clearInterval(interval);
  }, [sheetId, pollInterval]);

  return { data, loading, error };
};
