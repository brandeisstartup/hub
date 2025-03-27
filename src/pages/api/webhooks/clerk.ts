// pages/api/webhooks/clerk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";
import { PrismaClient } from "@prisma/client";

// Disable body parsing so we can access the raw payload
export const config = {
  api: {
    bodyParser: false
  }
};

const prisma = new PrismaClient();

const clerkWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("Webhook endpoint hit");

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

  // Process the user.created event
  if (event.type === "user.created") {
    const { email_addresses, first_name, last_name, image_url } = event.data;
    const primaryEmail =
      email_addresses && email_addresses[0]
        ? email_addresses[0].email_address
        : null;

    if (!primaryEmail) {
      console.error("Primary email missing in webhook payload.");
    } else {
      try {
        // Create a new user record in your database
        await prisma.users.create({
          data: {
            email: primaryEmail,
            firstName: first_name || null,
            lastName: last_name || null,
            imageUrl: image_url || null,
            secondaryEmail: null, // Default value, adjust if needed
            bio: "", // Default empty bio
            graduationYear: null,
            major: null
          }
        });
        console.log("User created in database");
      } catch (error) {
        console.error("Error creating user:", error);
      }
    }
  }

  // Return a success response
  res.status(200).json({ received: true, event });
};

export default clerkWebhookHandler;
