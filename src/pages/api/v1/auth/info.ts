import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest } from "next";

export default function handler(req: NextApiRequest, res: any) {
  const { userId, sessionId, getToken } = getAuth(req);
  // Optionally, get the JWT:
  const token = getToken();

  console.log("User ID:", userId);
  console.log("Session ID:", sessionId);
  console.log("JWT Token:", token);

  res.status(200).json({ userId, sessionId, token });
}
