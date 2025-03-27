// // pages/api/webhooks/clerk.ts
// import { NextApiRequest, NextApiResponse } from "next";
// import { buffer } from "micro";

// // Disable body parsing so we can access the raw payload
// export const config = {
//   api: {
//     bodyParser: false
//   }
// };

// // Set your GraphQL API endpoint (adjust if needed)
// const GRAPHQL_ENDPOINT =
//   process.env.GRAPHQL_ENDPOINT ||
//   "https://startuphub-jade.vercel.app/api/graphql";

// const clerkWebhookHandler = async (
//   req: NextApiRequest,
//   res: NextApiResponse
// ) => {
//   console.log("Webhook endpoint hit");

//   // Get the raw body
//   const buf = await buffer(req);
//   console.log("Raw Clerk webhook payload:", buf.toString());

//   // Parse the JSON payload
//   let event;
//   try {
//     event = JSON.parse(buf.toString());
//     console.log("Parsed Clerk webhook event:", event);
//   } catch (error) {
//     console.error("Error parsing webhook payload:", error);
//     return res.status(400).json({ error: "Invalid payload" });
//   }

//   // Process the user.created event
//   if (event.type === "user.created") {
//     const data = event.data;
//     // Extract the primary email from the email_addresses array
//     const primaryEmail =
//       data.email_addresses && data.email_addresses[0]
//         ? data.email_addresses[0].email_address
//         : null;

//     // Use profile_image_url if available; fallback to image_url otherwise
//     const imageUrl = data.profile_image_url || data.image_url || null;

//     if (!primaryEmail) {
//       console.error("Primary email missing in webhook payload.");
//     } else {
//       // Build your GraphQL mutation for createUser
//       const mutation = `
//         mutation CreateUser(
//           $email: String!,
//           $firstName: String,
//           $lastName: String,
//           $imageUrl: String
//         ) {
//           createUser(
//             email: $email,
//             firstName: $firstName,
//             lastName: $lastName,
//             imageUrl: $imageUrl
//           ) {
//             id
//             email
//           }
//         }
//       `;

//       const variables = {
//         email: primaryEmail,
//         firstName: data.first_name || null,
//         lastName: data.last_name || null,
//         imageUrl
//       };

//       try {
//         const response = await fetch(GRAPHQL_ENDPOINT, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//             // If your GraphQL API requires authentication headers, add them here.
//           },
//           body: JSON.stringify({
//             query: mutation,
//             variables
//           })
//         });

//         const result = await response.json();
//         if (result.errors) {
//           console.error("GraphQL mutation errors:", result.errors);
//         } else {
//           console.log("User created via GraphQL API:", result.data.createUser);
//         }
//       } catch (error) {
//         console.error("Error calling GraphQL API:", error);
//       }
//     }
//   }

//   // Return a success response
//   res.status(200).json({ received: true, event });
// };

// export default clerkWebhookHandler;
// src/pages/api/webhooks/clerk.ts
import { NextApiRequest, NextApiResponse } from "next";
import { buffer } from "micro";

// Disable body parsing so we can access the raw payload
export const config = {
  api: {
    bodyParser: false
  }
};

// Define interfaces for the Clerk webhook event data
interface ClerkEmailAddress {
  email_address: string;
}

interface ClerkUserData {
  email_addresses: ClerkEmailAddress[];
  first_name?: string;
  last_name?: string;
  image_url?: string;
  profile_image_url?: string;
  // Add other fields if necessary
}

interface ClerkWebhookEvent {
  type: "user.created" | "user.deleted" | string;
  data: ClerkUserData;
  // Other fields as needed
  event_attributes?: unknown;
  instance_id?: string;
  object?: string;
  timestamp?: number;
}

// Set your GraphQL API endpoint (adjust if needed)
const GRAPHQL_ENDPOINT =
  process.env.GRAPHQL_ENDPOINT ||
  "https://startuphub-jade.vercel.app/api/graphql";

const clerkWebhookHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log("Webhook endpoint hit");

  // Get the raw body
  const buf = await buffer(req);
  console.log("Raw Clerk webhook payload:", buf.toString());

  // Parse the JSON payload and cast it to ClerkWebhookEvent
  let event: ClerkWebhookEvent;
  try {
    event = JSON.parse(buf.toString()) as ClerkWebhookEvent;
    console.log("Parsed Clerk webhook event:", event);
  } catch (error) {
    console.error("Error parsing webhook payload:", error);
    return res.status(400).json({ error: "Invalid payload" });
  }

  // Helper to extract primary email
  const getPrimaryEmail = (data: ClerkUserData): string | null =>
    data.email_addresses && data.email_addresses.length > 0
      ? data.email_addresses[0].email_address
      : null;

  // Process user.created event
  if (event.type === "user.created") {
    const data = event.data;
    const primaryEmail = getPrimaryEmail(data);
    // Use profile_image_url if available; fallback to image_url
    const imageUrl = data.profile_image_url || data.image_url || null;

    if (!primaryEmail) {
      console.error("Primary email missing in webhook payload.");
    } else {
      const mutation = `
        mutation CreateUser(
          $email: String!,
          $firstName: String,
          $lastName: String,
          $imageUrl: String
        ) {
          createUser(
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
            // Add authentication headers if needed
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

  // Process user.deleted event
  if (event.type === "user.deleted") {
    const data = event.data;
    const primaryEmail = getPrimaryEmail(data);
    if (!primaryEmail) {
      console.error("Primary email missing in webhook payload for deletion.");
    } else {
      const mutation = `
        mutation DeleteUserByEmail($email: String!) {
          deleteUserByEmail(email: $email) {
            id
            email
          }
        }
      `;
      const variables = { email: primaryEmail };

      try {
        const response = await fetch(GRAPHQL_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
            // Add authentication headers if needed
          },
          body: JSON.stringify({
            query: mutation,
            variables
          })
        });
        const result = await response.json();
        if (result.errors) {
          console.error(
            "GraphQL mutation errors (deleteUserByEmail):",
            result.errors
          );
        } else {
          console.log(
            "User deleted via GraphQL API:",
            result.data.deleteUserByEmail
          );
        }
      } catch (error) {
        console.error("Error calling GraphQL API (deleteUserByEmail):", error);
      }
    }
  }

  // Return a success response
  res.status(200).json({ received: true, event });
};

export default clerkWebhookHandler;
