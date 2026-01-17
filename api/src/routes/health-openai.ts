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

router.get("/health/openai/transcription", authMiddleware, async (_req, res, next) => {
  try {
    const transcript = await transcribeTestAudio();
    res.json({ ok: true, transcript });
  } catch (err) {
    logger.error({ err }, "openai test transcription failed");
    next(err);
  }
});

export default router;
