import { RequestHandler } from "express";
import { getPolisherSecret } from "./config";

const polisherSecret = getPolisherSecret();

export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice("bearer ".length).trim();
  if (token !== polisherSecret) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
