import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../lib/auth";
import { polishMessage, transcribeAudio } from "../lib/openai";

const router = Router();
const upload = multer({ limits: { fileSize: 8 * 1024 * 1024 } }); // 8MB cap to keep request small

router.post(
  "/polish-audio",
  authMiddleware,
  upload.single("audio"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: "Missing audio file (field 'audio')" });
        return;
      }

      const mime = req.file.mimetype || "audio/wav";
      const transcript = await transcribeAudio(
        req.file.buffer,
        mime,
        req.file.originalname,
      );
      const polished = await polishMessage(transcript);

      res.json({ transcript, polished });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
