// Simple OpenAI client wrapper keeping models centralized.
import OpenAI, { APIConnectionError, toFile } from "openai";
import { getOpenAiKey } from "./secrets";
import { logger } from "./logger";

const client = new OpenAI({
  apiKey: getOpenAiKey(),
  timeout: 120_000,
  maxRetries: 4,
});

export const models = {
  transcribe: "gpt-4o-transcribe",
  polish: "gpt-4o-mini",
} as const;

export async function transcribeAudio(
  audio: Buffer,
  mimeType: string,
  filename?: string,
) {
  const safeMime = normalizeMime(mimeType);
  const file = await toFile(audio, filename ?? defaultFilename(safeMime), {
    type: safeMime,
  });

  try {
    const response = await client.audio.transcriptions.create({
      file,
      model: models.transcribe,
    });
    return response.text;
  } catch (err) {
    if (err instanceof APIConnectionError) {
      logger.error(
        { err, mimeType: safeMime, filename: filename ?? undefined },
        "OpenAI connection error during transcription",
      );
    }
    throw err;
  }
}

export async function polishMessage(rawText: string) {
  const response = await client.responses.create({
    model: models.polish,
    input: [
      { role: "system", content: polishSystemPrompt },
      { role: "user", content: rawText },
    ],
  });

  const firstText = response.output_text ?? "";
  return firstText.trim();
}

const polishSystemPrompt =
  "Fix typos and grammar, improve clarity, and keep the tone casual and natural. " +
  "Do not add new information. Keep it concise. Return only the polished text.";

function normalizeMime(mime: string) {
  const trimmed = mime?.split(";")[0]?.trim();
  return trimmed || "audio/webm";
}

function defaultFilename(mime: string) {
  if (mime.includes("wav")) return "audio.wav";
  if (mime.includes("ogg")) return "audio.ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "audio.mp3";
  if (mime.includes("mp4")) return "audio.mp4";
  return "audio.webm";
}
