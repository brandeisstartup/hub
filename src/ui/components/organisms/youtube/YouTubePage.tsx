import YouTubeGrid from "@/ui/components/organisms/youtube/YouTubeGrid";
import { useYouTubeVideos } from "@/hooks/useYouTubeVideos";

const YouTubePage = () => {
  const { videos, loading, error } = useYouTubeVideos();

  if (loading) return;
  if (error) return;

  return (
    <div>
      {videos.length > 0 && (
        <YouTubeGrid videos={videos} label="Our YouTube Videos" extend />
      )}
    </div>
  );
};

export default YouTubePage;
