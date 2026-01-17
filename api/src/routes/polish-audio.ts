import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../lib/auth";
import { logger } from "../lib/logger";
import { polishMessage, transcribeAudio } from "../lib/openai";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
}); // 8MB cap to keep request small

router.post(
  "/polish-audio",
  authMiddleware,
  upload.single("audio"),
  async (req, res, next) => {
    try {
      const startTime = Date.now();

      if (!req.file) {
        res.status(400).json({ error: "Missing audio file (field 'audio')" });
        return;
      }

      if (!req.file.buffer || req.file.buffer.length === 0) {
        res.status(400).json({ error: "Uploaded audio is empty" });
        return;
      }

      const afterValidationTime = Date.now();
      logger.info(
        {
          elapsedMs: afterValidationTime - startTime,
          size: req.file.size,
          mimeType: req.file.mimetype,
          filename: req.file.originalname,
        },
        "polish-audio: after validation",
      );

      const beforeTranscribeTime = Date.now();
      logger.info({ elapsedMs: beforeTranscribeTime - startTime }, "polish-audio: before transcribe");

      const mime = req.file.mimetype || "audio/wav";
      const transcript = await transcribeAudio(
        req.file.buffer,
        mime,
        req.file.originalname,
      );
      const afterTranscribeTime = Date.now();
      logger.info(
        {
          elapsedMs: afterTranscribeTime - startTime,
          transcribeMs: afterTranscribeTime - beforeTranscribeTime,
        },
        "polish-audio: after transcribe",
      );

      const polished = await polishMessage(transcript);
      const afterPolishTime = Date.now();
      logger.info(
        {
          elapsedMs: afterPolishTime - startTime,
          polishMs: afterPolishTime - afterTranscribeTime,
        },
        "polish-audio: after polish",
      );

      res.json({ transcript, polished });
    } catch (err) {
      logger.error({ err }, "polish-audio failed");
      next(err);
    }
  },
);

export default router;
