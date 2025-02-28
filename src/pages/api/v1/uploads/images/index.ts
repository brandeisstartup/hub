// pages/api/v1/uploads/images/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { IncomingForm } from "formidable";
import fs from "fs";
import sharp from "sharp";
import { put } from "@vercel/blob";

// Disable Next.js body parsing so formidable can handle the multipart data
export const config = {
  api: {
    bodyParser: false
  }
};

// Wrap formidable parsing in a Promise
const parseForm = (req: NextApiRequest) => {
  return new Promise<{ fields: any; files: any }>((resolve, reject) => {
    const form = new IncomingForm({ multiples: false });
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
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
    // Parse the multipart/form-data request
    const { files } = await parseForm(req);
    const file = files.file;
    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // If multiple files are somehow uploaded, use the first one.
    const uploadedFile = Array.isArray(file) ? file[0] : file;

    // Read the temporary file from disk
    const fileBuffer = fs.readFileSync(uploadedFile.filepath);

    // Convert the image to WebP using Sharp
    const webpBuffer = await sharp(fileBuffer).toFormat("webp").toBuffer();

    // Create a unique filename with .webp extension
    const fileName = `uploads/${Date.now()}-${
      uploadedFile.originalFilename || "upload"
    }.webp`;

    // Upload the converted image to Vercel Blob with public access
    const { url } = await put(fileName, webpBuffer, {
      access: "public",
      contentType: "image/webp"
    });

    // Return the URL of the uploaded file
    return res.status(200).json({ url });
  } catch (error) {
    console.error("Upload error:", error);
    return res.status(500).json({ error: "Upload failed" });
  }
}
