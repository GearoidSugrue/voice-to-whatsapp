export function normalizeMime(mime: string) {
  const trimmed = mime?.split(";")[0]?.trim();
  return trimmed || "audio/webm";
}

export function defaultFilename(mime: string) {
  if (mime.includes("wav")) return "audio.wav";
  if (mime.includes("ogg")) return "audio.ogg";
  if (mime.includes("mpeg") || mime.includes("mp3")) return "audio.mp3";
  if (mime.includes("mp4")) return "audio.mp4";
  return "audio.webm";
}

export function makeSilenceWav(durationMs = 1000, sampleRate = 16000) {
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
