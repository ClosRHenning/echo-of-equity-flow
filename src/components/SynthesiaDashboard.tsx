import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VideoTable } from "@/components/VideoTable";
import { ScriptDialog } from "@/components/ScriptDialog";
import { fetchVideos, exportAllUrl } from "@/lib/api";
import type { SynthesiaVideoSummary } from "@/types/synthesia";
import { Download, Loader2, RefreshCw } from "lucide-react";

const PAGE_SIZE = 50;

export function SynthesiaDashboard() {
  const [videos, setVideos] = useState<SynthesiaVideoSummary[]>([]);
  const [offset, setOffset] = useState(0);
  const [nextOffset, setNextOffset] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadVideos = (currentOffset: number) => {
    setLoading(true);
    setError(null);
    fetchVideos(PAGE_SIZE, currentOffset)
      .then((data) => {
        setVideos(data.videos ?? []);
        setNextOffset(data.nextOffset ?? null);
        setOffset(currentOffset);
      })
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos(0);
  }, []);

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-4">
          <div>
            <CardTitle>Synthesia Skript-Downloader</CardTitle>
            <CardDescription>
              Lade die Skripte deiner Synthesia-Videos über die offizielle API herunter.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadVideos(offset)}>
              <RefreshCw className="mr-2 h-4 w-4" /> Aktualisieren
            </Button>
            <Button asChild size="sm">
              <a href={exportAllUrl()} download>
                <Download className="mr-2 h-4 w-4" /> Alle als ZIP
              </a>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Videos werden geladen…
            </div>
          )}

          {error && (
            <p className="py-8 text-center text-sm text-destructive">
              Fehler beim Laden der Videos: {error}
            </p>
          )}

          {!loading && !error && videos.length === 0 && (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Keine Videos gefunden.
            </p>
          )}

          {!loading && !error && videos.length > 0 && (
            <>
              <VideoTable videos={videos} onSelect={setSelectedId} />
              <div className="mt-4 flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={offset === 0}
                  onClick={() => loadVideos(Math.max(0, offset - PAGE_SIZE))}
                >
                  Zurück
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={nextOffset === null}
                  onClick={() => nextOffset !== null && loadVideos(nextOffset)}
                >
                  Weiter
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ScriptDialog videoId={selectedId} onOpenChange={(open) => !open && setSelectedId(null)} />
    </div>
  );
}
