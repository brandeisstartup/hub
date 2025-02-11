import { useEffect, useState } from "react";

export type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
};

export const useYouTubeVideos = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideosFromAPI = async () => {
    try {
      const response = await fetch("/api/v1/youtube/youtube");
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setVideos(data.videos);
    } catch (err: unknown) {
      console.error("Error fetching videos:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosFromAPI();
  }, []);

  return { videos, loading, error };
};
