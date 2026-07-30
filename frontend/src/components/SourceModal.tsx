"use client";

import React from "react";
import { X, ExternalLink, FileText, Bookmark } from "lucide-react";
import { SourceChunk } from "@/lib/api";

interface SourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  sources: SourceChunk[];
  activeSource?: SourceChunk | null;
}

export const SourceModal: React.FC<SourceModalProps> = ({
  isOpen,
  onClose,
  sources,
  activeSource,
}) => {
  if (!isOpen || sources.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-xs">
      <div className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border border-[#2A2E36] bg-[#181B21] shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2E36] px-6 py-4">
          <div className="flex items-center space-x-2">
            <Bookmark className="h-5 w-5 text-[#D9A441]" />
            <h3 className="text-lg font-semibold text-[#EAEAEA]">
              Source Citations ({sources.length})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-[#8A8F9B] hover:bg-[#2A2E36] hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {sources.map((src, idx) => {
            const isHighlight = activeSource && activeSource.source_file === src.source_file && activeSource.chunk_index === src.chunk_index;
            return (
              <div
                key={idx}
                className={`rounded-xl border p-4 transition-all ${
                  isHighlight
                    ? "border-[#D9A441] bg-[#D9A441]/10 shadow-lg shadow-[#D9A441]/5"
                    : "border-[#2A2E36] bg-[#0F1115] hover:border-[#3A3F4B]"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-[#D9A441] shrink-0" />
                    <span className="font-semibold text-sm text-[#EAEAEA] break-all">
                      {src.source_file}
                    </span>
                  </div>
                  {src.drive_link && (
                    <a
                      href={src.drive_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-xs text-[#D9A441] hover:underline shrink-0"
                    >
                      <span>Open in Drive</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>

                <div className="mt-2 flex items-center space-x-3 text-xs text-[#8A8F9B]">
                  <span>Chunk #{src.chunk_index}</span>
                  {src.page && <span>&bull; Page {src.page}</span>}
                </div>

                <div className="mt-3 rounded-lg bg-[#181B21] p-3 text-xs text-[#C5C8D0] font-mono leading-relaxed border border-[#2A2E36]/60">
                  &ldquo;{src.text_snippet}&rdquo;
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-[#2A2E36] px-6 py-3 bg-[#0F1115] text-right">
          <button
            onClick={onClose}
            className="rounded-lg bg-[#2A2E36] px-4 py-2 text-xs font-semibold text-[#EAEAEA] hover:bg-[#3A3F4B] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
