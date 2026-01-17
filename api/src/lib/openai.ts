// Simple OpenAI client wrapper keeping models centralized.
import OpenAI, { toFile } from "openai";
import { getOpenAiKey } from "./secrets";

const client = new OpenAI({
  apiKey: getOpenAiKey(),
  timeout: 120_000,
  maxRetries: 2,
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
  const file = await toFile(audio, filename ?? "audio.webm", {
    type: mimeType,
  });
  const response = await client.audio.transcriptions.create({
    file,
    model: models.transcribe,
  });
  return response.text;
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
