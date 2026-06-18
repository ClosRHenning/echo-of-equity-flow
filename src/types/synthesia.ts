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
}

export interface VideoScript {
  id: string;
  title: string | null;
  found: boolean;
  scenes: { index: number; text: string }[];
  fullText: string;
}
