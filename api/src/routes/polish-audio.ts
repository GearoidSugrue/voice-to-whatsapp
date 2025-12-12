import { Router } from "express";
import multer from "multer";
import { authMiddleware } from "../lib/auth";

const router = Router();
const upload = multer();

router.post(
  "/polish-audio",
  authMiddleware,
  upload.single("audio"),
  (_req, res) => {
    res.json({
      transcript: "stub transcript",
      polished: "stub polished message ready for WhatsApp",
    });
  },
);

export default router;
