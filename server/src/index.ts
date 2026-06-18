import express from "express";
import cors from "cors";
import { config } from "./config.js";
import { videosRouter } from "./routes/videos.js";

const app = express();

app.use(cors({ origin: config.clientOrigins }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api", videosRouter);

app.use((_req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.listen(config.port, () => {
  console.log(`Synthesia script server listening on http://localhost:${config.port}`);
});
