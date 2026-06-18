import type { SynthesiaVideoListResponse, VideoScript } from "@/types/synthesia";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`);
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ? JSON.stringify(body.error) : `Request failed: ${response.status}`);
  }
  return response.json();
}

export function fetchVideos(limit = 50, offset = 0): Promise<SynthesiaVideoListResponse> {
  return request(`/videos?limit=${limit}&offset=${offset}`);
}

export function fetchScript(id: string): Promise<VideoScript> {
  return request(`/videos/${id}/script`);
}

export function scriptDownloadUrl(id: string): string {
  return `${API_BASE_URL}/videos/${id}/script/download`;
}

export function exportAllUrl(): string {
  return `${API_BASE_URL}/export`;
}
