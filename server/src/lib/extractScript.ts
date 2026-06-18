/**
 * The Synthesia API's exact response shape for a video's script has changed
 * across versions and isn't guaranteed to be echoed back after creation.
 * This walks every known/likely location instead of assuming one shape, so
 * the feature keeps working if Synthesia tweaks field names.
 */
export interface ExtractedScript {
  found: boolean;
  scenes: { index: number; text: string }[];
  fullText: string;
}

function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function pickText(scene: Record<string, unknown>): string | undefined {
  const candidates = ["scriptText", "script", "text"];
  for (const key of candidates) {
    const value = scene[key];
    if (typeof value === "string" && value.trim().length > 0) {
      return value;
    }
  }
  return undefined;
}

export function extractScript(video: Record<string, unknown>): ExtractedScript {
  const sceneSources = [video.input, video.scenes, video.scriptInputs];

  for (const source of sceneSources) {
    const scenes = asArray(source);
    if (scenes.length === 0) continue;

    const extracted = scenes
      .map((scene, index) => {
        if (typeof scene === "string") return { index, text: scene };
        if (scene && typeof scene === "object") {
          const text = pickText(scene as Record<string, unknown>);
          return text ? { index, text } : null;
        }
        return null;
      })
      .filter((s): s is { index: number; text: string } => s !== null);

    if (extracted.length > 0) {
      return {
        found: true,
        scenes: extracted,
        fullText: extracted.map((s) => s.text).join("\n\n"),
      };
    }
  }

  if (typeof video.scriptText === "string" && video.scriptText.trim().length > 0) {
    return {
      found: true,
      scenes: [{ index: 0, text: video.scriptText }],
      fullText: video.scriptText,
    };
  }

  return { found: false, scenes: [], fullText: "" };
}
