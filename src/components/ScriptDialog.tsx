import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { fetchScript, scriptDownloadUrl } from "@/lib/api";
import type { VideoScript } from "@/types/synthesia";
import { useToast } from "@/hooks/use-toast";
import { Copy, Download, Loader2 } from "lucide-react";

interface ScriptDialogProps {
  videoId: string | null;
  onOpenChange: (open: boolean) => void;
}

export function ScriptDialog({ videoId, onOpenChange }: ScriptDialogProps) {
  const [script, setScript] = useState<VideoScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!videoId) return;
    setLoading(true);
    setError(null);
    setScript(null);
    fetchScript(videoId)
      .then(setScript)
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, [videoId]);

  const handleCopy = async () => {
    if (!script?.fullText) return;
    await navigator.clipboard.writeText(script.fullText);
    toast({ description: "Skript in die Zwischenablage kopiert." });
  };

  return (
    <Dialog open={videoId !== null} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{script?.title ?? "Skript"}</DialogTitle>
          <DialogDescription>
            {script?.found
              ? `${script.scenes.length} Szene(n)`
              : "Skript-Inhalt aus der Synthesia API"}
          </DialogDescription>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Skript wird geladen…
          </div>
        )}

        {error && (
          <p className="text-sm text-destructive">Fehler: {error}</p>
        )}

        {script && !script.found && !error && (
          <p className="text-sm text-muted-foreground">
            Für dieses Video wurde kein Skript in der API-Antwort gefunden.
          </p>
        )}

        {script?.found && (
          <>
            <ScrollArea className="h-72 rounded-md border p-4">
              <pre className="whitespace-pre-wrap text-sm font-sans">{script.fullText}</pre>
            </ScrollArea>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleCopy}>
                <Copy className="mr-2 h-4 w-4" /> Kopieren
              </Button>
              <Button asChild>
                <a href={scriptDownloadUrl(script.id)} download>
                  <Download className="mr-2 h-4 w-4" /> Als .txt herunterladen
                </a>
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
