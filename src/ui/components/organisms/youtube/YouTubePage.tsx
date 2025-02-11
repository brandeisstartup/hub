import YouTubeGrid from "@/ui/components/organisms/youtube/YouTubeGrid";
import { useYouTubeVideos } from "@/hooks/useYouTubeVideos";

const YouTubePage = () => {
  const { videos, loading, error } = useYouTubeVideos();

  if (loading) return <p>Loading videos...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <YouTubeGrid videos={videos} label="Our YouTube Videos" extend />
    </div>
  );
};

export default YouTubePage;
