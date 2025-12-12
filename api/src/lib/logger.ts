import type { NextFunction, Request, Response } from "express";
import pino from "pino";
import { logLevel } from "./config";

export const logger = pino({
  level: logLevel,
  base: undefined, // omit pid/hostname for leaner logs; add if needed
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  logger.info({ method: req.method, path: req.path }, "incoming request");

  res.on("finish", () => {
    const duration = Date.now() - start;
    logger.info(
      { method: req.method, path: req.path, status: res.statusCode, durationMs: duration },
      "request completed",
    );
  });

  next();
};
