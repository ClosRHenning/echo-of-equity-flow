import "dotenv/config";

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 4000),
  synthesiaApiKey: required("SYNTHESIA_API_KEY"),
  synthesiaApiBaseUrl: process.env.SYNTHESIA_API_BASE_URL ?? "https://api.synthesia.io/v2",
  clientOrigin: process.env.CLIENT_ORIGIN ?? "http://localhost:8080",
};
