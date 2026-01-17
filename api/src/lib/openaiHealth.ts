import { client, models as defaultModels, transcribeAudio } from "./openai";
import { makeSilenceWav } from "./openaiShared";

export async function checkOpenAiConnectivity() {
  const listed = await client.models.list();
  return {
    ok: true as const,
    modelsSeen: listed.data.slice(0, 3).map((m) => m.id),
  };
}

export async function transcribeTestAudio(modelOverride?: string) {
  const silence = makeSilenceWav();
  const modelToUse = modelOverride?.trim() || defaultModels.transcribe;
  return transcribeAudio(silence, "audio/wav", "silence.wav", modelToUse);
}
