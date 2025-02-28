// pages/api/upload.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { put } from "@vercel/blob";

// Disable Next.js body parsing so we can handle the raw binary data ourselves
export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Read the request body as a buffer
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const fileBuffer = Buffer.concat(chunks);

    // Define a unique path/name for the uploaded file
    const filePath = `uploads/${Date.now()}.bin`;

    // Upload the buffer to Vercel Blob with public access.
    const { url } = await put(filePath, fileBuffer, { access: "public" });

    // Return the URL of the uploaded file
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
