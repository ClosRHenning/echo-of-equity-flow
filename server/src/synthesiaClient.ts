import axios from "axios";
import { config } from "./config.js";

export const synthesia = axios.create({
  baseURL: config.synthesiaApiBaseUrl,
  headers: {
    Authorization: config.synthesiaApiKey,
    "Content-Type": "application/json",
  },
  timeout: 20_000,
});

export interface SynthesiaVideoSummary {
  id: string;
  title?: string;
  status?: string;
  createdAt?: string;
  lastUpdatedAt?: string;
  [key: string]: unknown;
}

export interface SynthesiaVideoListResponse {
  videos: SynthesiaVideoSummary[];
  nextOffset?: number | null;
  [key: string]: unknown;
}

export async function listVideos(limit: number, offset: number): Promise<SynthesiaVideoListResponse> {
  const { data } = await synthesia.get("/videos", { params: { limit, offset } });
  return data;
}

export async function getVideo(id: string): Promise<Record<string, unknown>> {
  const { data } = await synthesia.get(`/videos/${id}`);
  return data;
}
