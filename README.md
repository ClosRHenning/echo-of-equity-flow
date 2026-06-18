# Synthesia Skript-Downloader

Eine kleine Plattform, um die Skripte deiner eigenen Synthesia-Videos über die offizielle
[Synthesia API](https://docs.synthesia.io/) abzurufen und herunterzuladen — als einzelne `.txt`-Datei
oder gesammelt als ZIP.

Das Projekt besteht aus zwei Teilen:

- **`server/`** — ein kleiner Express-Backend, der die Synthesia API mit deinem API-Key anspricht.
  Der Key bleibt serverseitig und landet nie im Browser oder im Frontend-Code.
- **Frontend (`src/`)** — eine React/Vite/shadcn-UI, die Videos auflistet und Skripte anzeigt
  bzw. herunterladen lässt.

## Voraussetzungen

- Node.js (>= 18)
- Ein Synthesia-API-Key (Synthesia-Konto → Settings → API)

## Setup

1. **Backend konfigurieren**

   ```sh
   cd server
   cp .env.example .env
   # Trage deinen SYNTHESIA_API_KEY in server/.env ein
   npm install
   ```

2. **Frontend-Abhängigkeiten installieren** (im Projekt-Root)

   ```sh
   npm install
   ```

3. **Beide Server gemeinsam starten** (im Projekt-Root)

   ```sh
   npm run dev:all
   ```

   Das startet das Frontend unter `http://localhost:8080` (mit Proxy für `/api` auf den Backend-Port
   4000) und das Backend unter `http://localhost:4000`.

   Alternativ getrennt in zwei Terminals: `npm run dev` (Frontend) und `npm run dev:server` (Backend).

## Funktionsweise

- Das Backend ruft `GET /videos` und `GET /videos/{id}` der Synthesia API auf und extrahiert das
  Skript aus der Antwort (verschiedene mögliche Feldnamen werden berücksichtigt, da Synthesia das
  Skript nach der Video-Erstellung nicht in jedem Fall in der API-Antwort zurückgibt).
- Findet sich für ein Video kein Skript in der Antwort, wird das im UI klar angezeigt, statt einen
  Fehler zu verschleiern.
- Im Frontend kannst du pro Video das Skript ansehen, kopieren oder als `.txt` herunterladen, oder
  alle Videos als ZIP exportieren.

## Wichtige Endpunkte (Backend)

| Methode | Pfad                              | Beschreibung                              |
| ------- | ---------------------------------- | ------------------------------------------ |
| GET     | `/api/videos`                      | Liste der Videos (Pagination via `limit`/`offset`) |
| GET     | `/api/videos/:id`                  | Rohdaten eines Videos                      |
| GET     | `/api/videos/:id/script`           | Extrahiertes Skript als JSON                |
| GET     | `/api/videos/:id/script/download`  | Skript als `.txt`-Datei                     |
| GET     | `/api/export`                      | Alle Skripte als ZIP                        |

## Technologien

- Vite, TypeScript, React, shadcn-ui, Tailwind CSS (Frontend)
- Express, Axios, Archiver (Backend)
