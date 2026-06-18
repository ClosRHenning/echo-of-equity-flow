import { Router } from "express";
import archiver from "archiver";
import { listVideos, getVideo } from "../synthesiaClient.js";
import { extractScript } from "../lib/extractScript.js";

export const videosRouter = Router();

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9-_]+/gi, "_").slice(0, 80) || "script";
}

function forwardSynthesiaError(res: import("express").Response, error: unknown) {
  const status = (error as { response?: { status?: number } })?.response?.status ?? 502;
  const message =
    (error as { response?: { data?: unknown } })?.response?.data ??
    (error instanceof Error ? error.message : "Unknown error contacting Synthesia API");
  res.status(status).json({ error: message });
}

videosRouter.get("/videos", async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 50);
    const offset = Number(req.query.offset ?? 0);
    const data = await listVideos(limit, offset);
    res.json(data);
  } catch (error) {
    forwardSynthesiaError(res, error);
  }
});

videosRouter.get("/videos/:id", async (req, res) => {
  try {
    const data = await getVideo(req.params.id);
    res.json(data);
  } catch (error) {
    forwardSynthesiaError(res, error);
  }
});

videosRouter.get("/videos/:id/script", async (req, res) => {
  try {
    const video = await getVideo(req.params.id);
    const script = extractScript(video);
    res.json({
      id: req.params.id,
      title: video.title ?? null,
      ...script,
    });
  } catch (error) {
    forwardSynthesiaError(res, error);
  }
});

videosRouter.get("/videos/:id/script/download", async (req, res) => {
  try {
    const video = await getVideo(req.params.id);
    const script = extractScript(video);
    if (!script.found) {
      res.status(404).json({ error: "Kein Skript in der API-Antwort für dieses Video gefunden." });
      return;
    }
    const title = typeof video.title === "string" ? video.title : req.params.id;
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="${sanitizeFilename(title)}.txt"`);
    res.send(script.fullText);
  } catch (error) {
    forwardSynthesiaError(res, error);
  }
});

videosRouter.get("/export", async (req, res) => {
  try {
    const limit = Number(req.query.limit ?? 100);
    const offset = Number(req.query.offset ?? 0);
    const { videos } = await listVideos(limit, offset);

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", 'attachment; filename="synthesia-scripts.zip"');

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.on("error", (err) => {
      throw err;
    });
    archive.pipe(res);

    for (const summary of videos ?? []) {
      try {
        const video = await getVideo(summary.id);
        const script = extractScript(video);
        const title = typeof video.title === "string" ? video.title : summary.id;
        const filename = `${sanitizeFilename(title)}-${summary.id}.txt`;
        const content = script.found
          ? script.fullText
          : "Kein Skript in der API-Antwort für dieses Video gefunden.";
        archive.append(content, { name: filename });
      } catch {
        archive.append(`Fehler beim Abrufen von Video ${summary.id}`, {
          name: `${summary.id}-error.txt`,
        });
      }
    }

    await archive.finalize();
  } catch (error) {
    forwardSynthesiaError(res, error);
  }
});
