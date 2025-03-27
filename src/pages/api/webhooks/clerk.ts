// pages/api/clerk-webhook.ts
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

// Disable body parsing so we can access the raw payload
export const config = {
  api: {
    bodyParser: false
  }
};

const clerkWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  // Get the raw body
  const buf = await buffer(req);

  // Log the raw payload for debugging
  console.log("Raw Clerk webhook payload:", buf.toString());

  // Attempt to parse the JSON payload
  let event;
  try {
    event = JSON.parse(buf.toString());
    console.log("Parsed Clerk webhook event:", event);
  } catch (error) {
    console.error("Error parsing webhook payload:", error);
    return res.status(400).json({ error: "Invalid payload" });
  }

  // For now, just return the event as the response so you can inspect it
  res.status(200).json({ received: true, event });
};

export default clerkWebhookHandler;
