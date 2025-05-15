import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId, sessionId, getToken } = getAuth(req);
  const token = getToken();
  res.status(200).json({ userId, sessionId, token });
}
