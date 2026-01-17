// Simple OpenAI client wrapper keeping models centralized.
import OpenAI, { APIConnectionError, toFile } from "openai";
import { getOpenAiKey } from "./secrets";
import { logger } from "./logger";
import { defaultFilename, normalizeMime } from "./openaiShared";

const client = new OpenAI({
  apiKey: getOpenAiKey(),
  timeout: 120_000,
  maxRetries: 4,
});
export { client };

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

export async function checkOpenAiConnectivity() {
  const models = await client.models.list();
  return {
    ok: true as const,
    modelsSeen: models.data.slice(0, 3).map((m) => m.id),
  };
}

export async function transcribeTestAudio() {
  const silence = makeSilenceWav();
  return transcribeAudio(silence, "audio/wav", "silence.wav");
}

const polishSystemPrompt =
  "Fix typos and grammar, improve clarity, and keep the tone casual and natural. " +
  "Do not add new information. Keep it concise. Return only the polished text.";

function makeSilenceWav(durationMs = 1000, sampleRate = 16000) {
  const samples = Math.max(1, Math.round((durationMs / 1000) * sampleRate));
  const headerSize = 44;
  const dataSize = samples * 2; // 16-bit mono
  const buffer = Buffer.alloc(headerSize + dataSize);

  buffer.write("RIFF", 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write("WAVE", 8);
  buffer.write("fmt ", 12);
  buffer.writeUInt32LE(16, 16); // PCM chunk size
  buffer.writeUInt16LE(1, 20); // PCM format
  buffer.writeUInt16LE(1, 22); // mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28); // byte rate
  buffer.writeUInt16LE(2, 32); // block align
  buffer.writeUInt16LE(16, 34); // bits per sample
  buffer.write("data", 36);
  buffer.writeUInt32LE(dataSize, 40);
  // data section is already zeroed (silence)
  return buffer;
}
