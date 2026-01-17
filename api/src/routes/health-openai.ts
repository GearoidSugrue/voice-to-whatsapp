import { Router } from "express";
import { authMiddleware } from "../lib/auth";
import { checkOpenAiConnectivity, transcribeTestAudio } from "../lib/openaiHealth";
import { logger } from "../lib/logger";

const router = Router();

router.get("/health/openai", authMiddleware, async (_req, res, next) => {
  try {
    const result = await checkOpenAiConnectivity();
    res.json(result);
  } catch (err) {
    logger.error({ err }, "openai connectivity check failed");
    next(err);
  }
});

router.get("/health/openai/transcription", authMiddleware, async (req, res, next) => {
  try {
    const model = typeof req.query.model === "string" ? req.query.model : undefined;
    const transcript = await transcribeTestAudio(model);
    res.json({ ok: true, model: model ?? "default", transcript });
  } catch (err) {
    logger.error({ err }, "openai test transcription failed");
    next(err);
  }
});

export default router;
