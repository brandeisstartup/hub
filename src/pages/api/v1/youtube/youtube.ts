import type { NextApiRequest, NextApiResponse } from "next";
const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID;
const BASE_URL = "https://www.googleapis.com/youtube/v3/search";

type YouTubeVideo = {
  videoId: string;
  title: string;
  thumbnailUrl: string;
  publishedAt: string;
};

async function fetchVideos(pageToken: string = ""): Promise<any> {
  const url = `${BASE_URL}?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50${
    pageToken ? `&pageToken=${pageToken}` : ""
  }`;

  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw new Error("Failed to fetch YouTube videos");
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (!API_KEY || !CHANNEL_ID) {
      return res.status(400).json({ error: "Missing API key or channel ID" });
    }

    let allVideos: YouTubeVideo[] = [];
    let nextPageToken: string | undefined = "";

    do {
      const data = await fetchVideos(nextPageToken);

      if (data.error) {
        return res.status(500).json({ error: data.error.message });
      }
      const mappedVideos = data.items
        .filter((item: any) => item.id.videoId)
        .map((item: any) => ({
          videoId: item.id.videoId,
          title: item.snippet.title,
          thumbnailUrl: item.snippet.thumbnails.medium.url,
          publishedAt: item.snippet.publishedAt
        }));

      allVideos = [...allVideos, ...mappedVideos];
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return res.status(200).json({ videos: allVideos });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch YouTube videos" });
  }
}
