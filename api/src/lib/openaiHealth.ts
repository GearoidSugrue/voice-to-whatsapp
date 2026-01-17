import { client, transcribeAudio } from "./openai";
import { makeSilenceWav } from "./openaiShared";

export async function checkOpenAiConnectivity() {
  const listed = await client.models.list();
  return {
    ok: true as const,
    modelsSeen: listed.data.slice(0, 3).map((m) => m.id),
  };
}

export async function transcribeTestAudio() {
  const silence = makeSilenceWav();
  return transcribeAudio(silence, "audio/wav", "silence.wav");
}
