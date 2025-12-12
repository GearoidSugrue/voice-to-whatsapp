import dotenv from "dotenv";

dotenv.config();

export const port = Number(process.env.PORT ?? 3001);

export function getPolisherSecret(): string {
  const secret = process.env.POLISHER_SECRET;
  if (!secret) {
    throw new Error("POLISHER_SECRET is not set");
  }
  return secret;
}
