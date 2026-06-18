import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SynthesiaVideoSummary } from "@/types/synthesia";
import { FileText } from "lucide-react";

interface VideoTableProps {
  videos: SynthesiaVideoSummary[];
  onSelect: (id: string) => void;
}

function statusVariant(status?: string) {
  switch (status) {
    case "complete":
      return "default" as const;
    case "in_progress":
      return "secondary" as const;
    case "failed":
      return "destructive" as const;
    default:
      return "outline" as const;
  }
}

export function VideoTable({ videos, onSelect }: VideoTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Titel</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Erstellt am</TableHead>
          <TableHead className="text-right">Skript</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {videos.map((video) => (
          <TableRow key={video.id}>
            <TableCell className="font-medium">{video.title ?? video.id}</TableCell>
            <TableCell>
              <Badge variant={statusVariant(video.status)}>{video.status ?? "unbekannt"}</Badge>
            </TableCell>
            <TableCell className="text-muted-foreground">
              {video.createdAt ? new Date(video.createdAt).toLocaleString("de-DE") : "—"}
            </TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => onSelect(video.id)}>
                <FileText className="mr-2 h-4 w-4" /> Anzeigen
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
