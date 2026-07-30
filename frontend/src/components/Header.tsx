"use client";

import React from "react";
import { BookOpen, Settings, RefreshCw, CheckCircle2, AlertCircle, HelpCircle } from "lucide-react";

interface HeaderProps {
  status: "online" | "checking" | "error" | "idle";
  statusMessage?: string;
  onOpenSettings: () => void;
  onRecheckHealth: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  statusMessage,
  onOpenSettings,
  onRecheckHealth,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[#2A2E36] bg-[#0F1115]/90 backdrop-blur-md px-4 py-3 sm:px-6">
      <div className="mx-auto flex max-w-6xl items-center justify-between">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#D9A441] to-[#996D1E] text-[#0F1115] shadow-lg shadow-[#D9A441]/10">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif-title text-lg sm:text-xl font-bold tracking-tight text-[#D9A441]">
              DriveMind RAG
            </h1>
            <p className="hidden text-xs text-[#8A8F9B] sm:block">
              Personal Library AI Assistant
            </p>
          </div>
        </div>

        {/* Right Action Bar */}
        <div className="flex items-center space-x-3">
          {/* Status Badge */}
          <button
            onClick={onRecheckHealth}
            title={statusMessage || "Click to re-check backend health"}
            className={`flex items-center space-x-2 rounded-full px-3 py-1 text-xs font-medium transition-all ${
              status === "online"
                ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60"
                : status === "checking"
                ? "bg-amber-950/60 text-amber-400 border border-amber-800/40"
                : status === "error"
                ? "bg-rose-950/60 text-rose-400 border border-rose-800/40 hover:bg-rose-900/60"
                : "bg-[#181B21] text-[#8A8F9B] border border-[#2A2E36]"
            }`}
          >
            {status === "online" && (
              <>
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Backend Online</span>
              </>
            )}
            {status === "checking" && (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin text-amber-400" />
                <span>Checking...</span>
              </>
            )}
            {status === "error" && (
              <>
                <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                <span>Backend Offline</span>
              </>
            )}
            {status === "idle" && (
              <>
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Unknown Status</span>
              </>
            )}
          </button>

          {/* Settings Drawer Button */}
          <button
            onClick={onOpenSettings}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#2A2E36] bg-[#181B21] text-[#EAEAEA] transition-colors hover:border-[#D9A441] hover:text-[#D9A441]"
            title="Settings & Drive Ingestion"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
