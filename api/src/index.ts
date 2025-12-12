import express from "express";
import { port } from "./lib/config";
import polishAudioRouter from "./routes/polish-audio";

const app = express();

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(polishAudioRouter);

app.use(
  // Simple error handler to keep early scaffolding predictable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    // Log and avoid leaking details to callers
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  },
);

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
