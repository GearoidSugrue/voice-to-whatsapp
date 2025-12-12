import express from "express";
import cors from "cors";
import { logger, requestLogger } from "./lib/logger";
import { allowedOrigins, port } from "./lib/config";
import polishAudioRouter from "./routes/polish-audio";

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: allowedOrigins.length ? allowedOrigins : true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Authorization", "Content-Type"],
};

app.use(cors(corsOptions));
app.use(requestLogger);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(polishAudioRouter);

app.use(
  // Simple error handler to keep early scaffolding predictable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  },
);

app.listen(port, () => {
  logger.info(
    { port, allowedOrigins: allowedOrigins.length ? allowedOrigins : "all" },
    "API listening",
  );
});
