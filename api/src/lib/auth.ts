import { RequestHandler } from "express";
import { getPolisherSecret } from "./config";
import { logger } from "./logger";

const polisherSecret = getPolisherSecret();

export const authMiddleware: RequestHandler = (req, res, next) => {
  const header = req.headers.authorization;
  
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    logger.warn({ path: req.path, reason: "missing bearer" }, "auth failed");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const token = header.slice("bearer ".length).trim();

  if (token !== polisherSecret) {
    logger.warn({ path: req.path, reason: "invalid token" }, "auth failed");
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};
