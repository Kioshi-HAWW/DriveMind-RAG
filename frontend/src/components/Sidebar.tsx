"use client";

import React, { useState, useEffect } from "react";
import { X, Server, Database, Cloud, RefreshCw, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { getApiBaseUrl, setApiBaseUrl, checkHealth, triggerIngest } from "@/lib/api";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onHealthStatusChange?: (status: "online" | "checking" | "error") => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  onHealthStatusChange,
}) => {
  const [apiUrl, setUrlInput] = useState<string>("");
  const [isTestingHealth, setIsTestingHealth] = useState(false);
  const [healthStatus, setHealthStatus] = useState<string | null>(null);
  const [healthError, setHealthError] = useState<string | null>(null);

  const [isIngesting, setIsIngesting] = useState(false);
  const [ingestMsg, setIngestMsg] = useState<string | null>(null);

  useEffect(() => {
    setUrlInput(getApiBaseUrl());
  }, [isOpen]);

  const handleSaveUrl = async () => {
    setApiBaseUrl(apiUrl);
    await runHealthCheck(apiUrl);
  };

  const runHealthCheck = async (urlToTest?: string) => {
    setIsTestingHealth(true);
    setHealthStatus(null);
    setHealthError(null);
    if (onHealthStatusChange) onHealthStatusChange("checking");

    try {
      const res = await checkHealth(urlToTest || apiUrl);
      setHealthStatus(`Connected (${res.status})`);
      if (onHealthStatusChange) onHealthStatusChange("online");
    } catch (err: any) {
      setHealthError(err.message || "Failed to reach backend");
      if (onHealthStatusChange) onHealthStatusChange("error");
    } finally {
      setIsTestingHealth(false);
    }
  };

  const handleIngest = async () => {
    setIsIngesting(true);
    setIngestMsg(null);
    try {
      const res = await triggerIngest();
      setIngestMsg(res.message || "Ingestion started in background.");
    } catch (err: any) {
      setIngestMsg(`Failed: ${err.message}`);
    } finally {
      setIsIngesting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs transition-opacity">
      <div className="h-full w-full max-w-md border-l border-[#2A2E36] bg-[#181B21] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-[#2A2E36] pb-4">
            <div className="flex items-center space-x-2">
              <Server className="h-5 w-5 text-[#D9A441]" />
              <h2 className="text-lg font-semibold text-[#EAEAEA]">System Settings</h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1 text-[#8A8F9B] hover:bg-[#2A2E36] hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Section 1: Backend Connection */}
          <div className="mt-6 space-y-3">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#8A8F9B]">
              Render Backend URL
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={apiUrl}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://drivemind-rag-1.onrender.com"
                className="w-full rounded-lg border border-[#2A2E36] bg-[#0F1115] px-3.5 py-2 text-sm text-[#EAEAEA] placeholder-[#505663] focus:border-[#D9A441] focus:outline-none"
              />
              <button
                onClick={handleSaveUrl}
                disabled={isTestingHealth}
                className="rounded-lg bg-[#D9A441] px-4 py-2 text-sm font-semibold text-[#0F1115] hover:bg-[#EBB552] transition-colors disabled:opacity-50"
              >
                Save
              </button>
            </div>
            <p className="text-xs text-[#8A8F9B]">
              Default Render URL: <code className="text-[#D9A441]">https://drivemind-rag-1.onrender.com</code>
            </p>

            {/* Health Result */}
            <div className="pt-2">
              <button
                onClick={() => runHealthCheck()}
                disabled={isTestingHealth}
                className="flex items-center space-x-2 text-xs font-medium text-[#D9A441] hover:underline disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isTestingHealth ? "animate-spin" : ""}`} />
                <span>Run Backend Health Check</span>
              </button>

              {healthStatus && (
                <div className="mt-2 flex items-center space-x-2 rounded-lg bg-emerald-950/40 p-2.5 text-xs text-emerald-400 border border-emerald-800/30">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{healthStatus}</span>
                </div>
              )}

              {healthError && (
                <div className="mt-2 flex items-center space-x-2 rounded-lg bg-rose-950/40 p-2.5 text-xs text-rose-400 border border-rose-800/30">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{healthError}</span>
                </div>
              )}
            </div>
          </div>

          <hr className="my-6 border-[#2A2E36]" />

          {/* Section 2: Drive Sync / Ingestion */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Cloud className="h-5 w-5 text-[#D9A441]" />
              <h3 className="text-sm font-semibold text-[#EAEAEA]">Google Drive Synchronization</h3>
            </div>
            <p className="text-xs text-[#8A8F9B]">
              Download latest PDF, DOCX, and text notes from your linked Google Drive folder, re-chunk, generate 3072-dim embeddings, and update Qdrant Cloud.
            </p>
            <button
              onClick={handleIngest}
              disabled={isIngesting}
              className="w-full flex items-center justify-center space-x-2 rounded-lg border border-[#D9A441] bg-[#D9A441]/10 px-4 py-2.5 text-sm font-semibold text-[#D9A441] hover:bg-[#D9A441] hover:text-[#0F1115] transition-all disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isIngesting ? "animate-spin" : ""}`} />
              <span>{isIngesting ? "Triggering Drive Sync..." : "Sync Google Drive Knowledge"}</span>
            </button>

            {ingestMsg && (
              <div className="rounded-lg bg-[#0F1115] p-3 border border-[#2A2E36] text-xs text-[#EAEAEA]">
                {ingestMsg}
              </div>
            )}
          </div>

          <hr className="my-6 border-[#2A2E36]" />

          {/* Section 3: Architecture summary */}
          <div className="space-y-2 rounded-xl bg-[#0F1115] p-4 border border-[#2A2E36] text-xs text-[#8A8F9B]">
            <div className="flex items-center space-x-2 font-medium text-[#EAEAEA]">
              <Database className="h-4 w-4 text-[#D9A441]" />
              <span>DriveMind RAG Architecture</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 pt-1">
              <li><strong>Free Tier</strong>: Gemini API + Qdrant Cloud + Render</li>
              <li><strong>Embedding Model</strong>: 3072-dim Gemini Embeddings</li>
              <li><strong>Agent</strong>: Custom Gemini Function Calling Loop</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-[#2A2E36] text-center text-xs text-[#505663]">
          DriveMind RAG &bull; Deployed on Vercel
        </div>
      </div>
    </div>
  );
};
