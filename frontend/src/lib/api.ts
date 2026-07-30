export interface SourceChunk {
  source_file: string;
  drive_link?: string | null;
  chunk_index: number;
  page?: number | null;
  text_snippet: string;
}

export interface ChatResponse {
  answer: string;
  sources: SourceChunk[];
}

export interface IngestResponse {
  status: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}

const DEFAULT_API_URL = "https://drivemind-rag-1.onrender.com";

export function getApiBaseUrl(): string {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("drivemind_api_url");
    if (stored && stored.trim()) {
      return stored.trim().replace(/\/+$/, "");
    }
  }
  return (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL).replace(/\/+$/, "");
}

export function setApiBaseUrl(url: string): void {
  if (typeof window !== "undefined") {
    localStorage.setItem("drivemind_api_url", url.trim().replace(/\/+$/, ""));
  }
}

export async function checkHealth(customUrl?: string): Promise<HealthResponse> {
  const baseUrl = customUrl ? customUrl.trim().replace(/\/+$/, "") : getApiBaseUrl();
  const res = await fetch(`${baseUrl}/health`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Backend check failed with status ${res.status}`);
  }
  return res.json();
}

export async function sendChatMessage(message: string): Promise<ChatResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Error ${res.status}: Failed to get answer from backend.`);
  }
  return res.json();
}

export async function triggerIngest(): Promise<IngestResponse> {
  const baseUrl = getApiBaseUrl();
  const res = await fetch(`${baseUrl}/ingest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Error ${res.status}: Failed to trigger Google Drive ingestion.`);
  }
  return res.json();
}
