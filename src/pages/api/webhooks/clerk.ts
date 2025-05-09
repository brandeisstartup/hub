// src/pages/api/webhooks/clerk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

// Disable body parsing so we can access the raw payload
export const config = {
  api: {
    bodyParser: false
  }
};

// Set your GraphQL API endpoint (adjust if needed)
const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ||
  "https://startuphub-jade.vercel.app/api/graphql";

interface ClerkEmailAddress {
  email_address: string;
}

interface ClerkUserData {
  email_addresses?: ClerkEmailAddress[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
  profile_image_url?: string;
  // Note: For deletion events, these fields might be absent
}

interface ClerkWebhookEvent {
  type: "user.created" | "user.deleted" | string;
  data: ClerkUserData & { id: string; deleted?: boolean };
  // other fields can be added as needed
}

const clerkWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("Webhook endpoint hit");

  // Get the raw body
  const buf = await buffer(req);
  console.log("Raw Clerk webhook payload:", buf.toString());

  // Parse the JSON payload
  let event: ClerkWebhookEvent;
  try {
    event = JSON.parse(buf.toString()) as ClerkWebhookEvent;
    console.log("Parsed Clerk webhook event:", event);
  } catch (error) {
    console.error("Error parsing webhook payload:", error);
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Helper to extract primary email if available
  const getPrimaryEmail = (data: ClerkUserData): string | null =>
    data.email_addresses && data.email_addresses.length > 0
      ? data.email_addresses[0].email_address
      : null;

  if (event.type === "user.created") {
    const data = event.data;
    const primaryEmail = getPrimaryEmail(data);
    const clerkId = data.id; // Grab the Clerk user id
    const imageUrl = data.profile_image_url || data.image_url || null;

    if (!primaryEmail) {
      console.error("Primary email missing in webhook payload.");
    } else {
      const mutation = `
        mutation CreateUser(
          $clerkId: String!,
          $email: String!,
          $firstName: String,
          $lastName: String,
          $imageUrl: String
        ) {
          createUser(
            clerkId: $clerkId,
            email: $email,
            firstName: $firstName,
            lastName: $lastName,
            imageUrl: $imageUrl
          ) {
            id
            email
          }
        }
      `;

      const variables = {
        clerkId,
        email: primaryEmail,
        firstName: data.first_name || null,
        lastName: data.last_name || null,
        imageUrl
      };

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: mutation,
            variables
          })
        });

        const result = await response.json();
        if (result.errors) {
          console.error("GraphQL mutation errors (createUser):", result.errors);
        } else {
          console.log("User created via GraphQL API:", result.data.createUser);
        }
      } catch (error) {
        console.error("Error calling GraphQL API (createUser):", error);
      }
    }
  }

  if (event.type === "user.deleted") {
    const data = event.data;
    const clerkId = data.id;
    if (!clerkId) {
      console.error("Clerk id missing in webhook payload for deletion.");
    } else {
      const mutation = `
        mutation DeleteUserByClerkId($clerkId: String!) {
          deleteUserByClerkId(clerkId: $clerkId) {
            id
            email
          }
        }
      `;
      const variables = { clerkId };

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            query: mutation,
            variables
          })
        });
        const result = await response.json();
        if (result.errors) {
          console.error(
            "GraphQL mutation errors (deleteUserByClerkId):",
            result.errors
          );
        } else {
          console.log(
            "User deleted via GraphQL API:",
            result.data.deleteUserByClerkId
          );
        }
      } catch (error) {
        console.error(
          "Error calling GraphQL API (deleteUserByClerkId):",
          error
        );
      }
    }
  }

  res.status(200).json({ received: true, event });
};

export default clerkWebhookHandler;
