import type { NextApiRequest, NextApiResponse } from "next";

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
};

interface YouTubeApiResponse {
  items: {
    id: { videoId?: string };
    snippet: {
      title: string;
      publishedAt: string;
      thumbnails: { medium: { url: string } };
    };
  }[];
  nextPageToken?: string;
  error?: { message: string };
}

async function fetchVideos(
  pageToken: string = ""
): Promise<YouTubeApiResponse> {
  const url = `${BASE_URL}?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Failed to fetch YouTube videos");

  return response.json();
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (!API_KEY || !CHANNEL_ID) {
    return res.status(400).json({ error: "Missing API key or channel ID" });
  }

  let allVideos: YouTubeVideo[] = [];
  let nextPageToken: string | undefined = "";

  try {
    do {
      const data: YouTubeApiResponse = await fetchVideos(nextPageToken);

      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }

      const mappedVideos: YouTubeVideo[] = data.items
        .filter((item) => item.id.videoId)
        .map((item) => ({
          videoId: item.id.videoId as string,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt
        }));

      allVideos = [...allVideos, ...mappedVideos];
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return res.status(200).json({ videos: allVideos });
  } catch (err: unknown) {
    console.error("YouTube API Error:", err);
    return res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
}
