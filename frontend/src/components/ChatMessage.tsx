"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { User, Bot, Copy, Check, ExternalLink, Bookmark } from "lucide-react";
import { SourceChunk } from "@/lib/api";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: SourceChunk[];
  timestamp: string;
}

interface ChatMessageProps {
  message: Message;
  onViewSources: (sources: SourceChunk[], activeSource?: SourceChunk) => void;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, onViewSources }) => {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`flex w-full space-x-3 py-4 sm:py-6 px-4 sm:px-6 transition-colors ${
        isUser ? "bg-[#0F1115]" : "bg-[#14171D] border-y border-[#2A2E36]/40"
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold ${
          isUser
            ? "bg-[#2A2E36] text-[#EAEAEA]"
            : "bg-gradient-to-br from-[#D9A441] to-[#996D1E] text-[#0F1115] shadow-md shadow-[#D9A441]/10"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      {/* Content Container */}
      <div className="flex-1 space-y-2 overflow-hidden">
        {/* Header line */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-[#8A8F9B]">
            {isUser ? "You" : "DriveMind Assistant"}
          </span>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] text-[#505663]">{message.timestamp}</span>
            {!isUser && (
              <button
                onClick={handleCopy}
                className="rounded p-1 text-[#8A8F9B] hover:bg-[#2A2E36] hover:text-[#EAEAEA] transition-colors"
                title="Copy response"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
              </button>
            )}
          </div>
        </div>

        {/* Message body */}
        <div className="prose prose-invert max-w-none text-sm text-[#EAEAEA] leading-relaxed">
          {isUser ? (
            <p className="whitespace-pre-wrap">{message.content}</p>
          ) : (
            <ReactMarkdown>{message.content}</ReactMarkdown>
          )}
        </div>

        {/* Source Citations Pills */}
        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="mt-4 border-t border-[#2A2E36]/60 pt-3">
            <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#D9A441] mb-2">
              <Bookmark className="h-3.5 w-3.5" />
              <span>Citations ({message.sources.length}):</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {message.sources.map((src, idx) => (
                <button
                  key={idx}
                  onClick={() => onViewSources(message.sources || [], src)}
                  className="group inline-flex items-center space-x-1.5 rounded-lg border border-[#3A3F4B] bg-[#181B21] px-2.5 py-1 text-xs text-[#D9A441] hover:border-[#D9A441] hover:bg-[#D9A441]/10 transition-all"
                >
                  <span className="max-w-[180px] truncate font-medium">{src.source_file}</span>
                  {src.page && <span className="text-[10px] opacity-75">p.{src.page}</span>}
                  <ExternalLink className="h-3 w-3 opacity-60 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
