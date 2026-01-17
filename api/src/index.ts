import express from "express";
import cors from "cors";
import { logger, requestLogger } from "./lib/logger";
import { allowedOrigins, port } from "./lib/config";
import polishAudioRouter from "./routes/polish-audio";
import healthOpenAiRouter from "./routes/health-openai";

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

app.use(healthOpenAiRouter);
app.use(polishAudioRouter);

app.use(
  // Simple error handler to keep early scaffolding predictable
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    logger.error({ err }, "unhandled error");
    res.status(500).json({ error: "Internal Server Error" });
  },
);

const server = app.listen(port, () => {
  logger.info(
    { port, allowedOrigins: allowedOrigins.length ? allowedOrigins : "all" },
    "API listening",
  );
});

server.requestTimeout = 0;
server.headersTimeout = 120_000;
server.keepAliveTimeout = 65_000;
