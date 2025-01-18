import React, { useEffect, useState } from "react";
import YouTubeGrid from "@/ui/components/organisms/youtube/YouTubeGrid";

type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
};

const YouTubePage: React.FC = () => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch videos from the API
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

      // Ensure we handle only string-based errors safely
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideosFromAPI();
  }, []);

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <YouTubeGrid videos={videos} label="Our YouTube Videos" extend />
    </div>
  );
};

export default YouTubePage;
