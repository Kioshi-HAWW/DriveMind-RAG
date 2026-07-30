"use client";

import React, { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { ChatMessage, Message } from "@/components/ChatMessage";
import { SourceModal } from "@/components/SourceModal";
import { sendChatMessage, checkHealth, SourceChunk } from "@/lib/api";
import { Send, Trash2, Sparkles, BookOpen, Search, ArrowRight, Loader2 } from "lucide-react";

const SAMPLE_PROMPTS = [
  "What documents and books are available in my library?",
  "Summarize the main themes and key takeaways from my notes.",
  "What does my library say about system design and architecture?",
  "Find references to machine learning or RAG in my documents.",
];

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState<"online" | "checking" | "error" | "idle">("checking");
  const [backendMsg, setBackendMsg] = useState<string>("");

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Source Modal state
  const [sourceModalOpen, setSourceModalOpen] = useState(false);
  const [activeSources, setActiveSources] = useState<SourceChunk[]>([]);
  const [activeSourceHighlight, setActiveSourceHighlight] = useState<SourceChunk | undefined>();

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check health on mount
  useEffect(() => {
    handleCheckHealth();
  }, []);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleCheckHealth = async () => {
    setBackendStatus("checking");
    try {
      const res = await checkHealth();
      setBackendStatus("online");
      setBackendMsg(`Status: ${res.status}`);
    } catch (err: any) {
      setBackendStatus("error");
      setBackendMsg(err.message || "Cannot connect to backend");
    }
  };

  const handleSend = async (textToSend?: string) => {
    const query = (textToSend || input).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setIsLoading(true);

    try {
      const res = await sendChatMessage(query);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: res.answer,
        sources: res.sources,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `⚠️ **Connection Error**: ${err.message || "Failed to reach backend service."}\n\nPlease check that your Render backend is running and CORS is enabled. Click the **Settings** icon to test your API URL.`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenSources = (sources: SourceChunk[], highlight?: SourceChunk) => {
    setActiveSources(sources);
    setActiveSourceHighlight(highlight);
    setSourceModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#0F1115] text-[#EAEAEA]">
      {/* Navbar Header */}
      <Header
        status={backendStatus}
        statusMessage={backendMsg}
        onOpenSettings={() => setIsSidebarOpen(true)}
        onRecheckHealth={handleCheckHealth}
      />

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto relative">
        {messages.length === 0 ? (
          /* Hero Section */
          <div className="mx-auto flex max-w-3xl flex-col items-center justify-center px-4 py-12 text-center sm:py-20">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D9A441] to-[#996D1E] text-[#0F1115] shadow-xl shadow-[#D9A441]/15 mb-6">
              <BookOpen className="h-8 w-8" />
            </div>

            <h2 className="font-serif-title text-3xl sm:text-4xl font-bold tracking-tight text-[#EAEAEA]">
              What would you like to explore from your library?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-[#8A8F9B]">
              Ask questions grounded directly in your Google Drive documents, books, research papers, and notes with instant vector citations.
            </p>

            {/* Quick Sample Prompts Grid */}
            <div className="mt-10 grid w-full gap-3 sm:grid-cols-2">
              {SAMPLE_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="group flex items-start justify-between rounded-xl border border-[#2A2E36] bg-[#181B21] p-4 text-left transition-all hover:border-[#D9A441] hover:bg-[#1E222A]"
                >
                  <span className="text-xs sm:text-sm font-medium text-[#C5C8D0] group-hover:text-[#EAEAEA]">
                    {prompt}
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[#8A8F9B] opacity-0 group-hover:opacity-100 group-hover:text-[#D9A441] transition-all ml-2" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Messages Feed */
          <div className="mx-auto max-w-4xl pb-32 pt-4">
            <div className="flex items-center justify-end px-4 py-2">
              <button
                onClick={() => setMessages([])}
                className="flex items-center space-x-1.5 text-xs text-[#8A8F9B] hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Clear Conversation</span>
              </button>
            </div>

            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} onViewSources={handleOpenSources} />
            ))}

            {/* Loading Spinner Indicator */}
            {isLoading && (
              <div className="flex items-center space-x-3 px-6 py-4 text-xs text-[#D9A441]">
                <Loader2 className="h-4 w-4 animate-spin text-[#D9A441]" />
                <span>DriveMind AI is querying vector store & synthesizing answer...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        )}
      </main>

      {/* Floating Bottom Input Dock */}
      <div className="sticky bottom-0 w-full border-t border-[#2A2E36] bg-[#0F1115]/95 backdrop-blur-md px-4 py-4 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <div className="relative flex items-center rounded-2xl border border-[#2A2E36] bg-[#181B21] shadow-xl focus-within:border-[#D9A441] transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your books, notes, or papers..."
              rows={1}
              className="w-full resize-none bg-transparent px-4 py-3.5 text-sm text-[#EAEAEA] placeholder-[#505663] focus:outline-none max-h-32"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || isLoading}
              className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#D9A441] text-[#0F1115] transition-all hover:bg-[#EBB552] disabled:opacity-30 disabled:hover:bg-[#D9A441]"
              title="Send question"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
          <p className="mt-2 text-center text-[11px] text-[#505663]">
            Powered by Google Gemini 1.5 & Qdrant Cloud &bull; Grounded answers with direct Google Drive links
          </p>
        </div>
      </div>

      {/* Settings Drawer */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onHealthStatusChange={(st) => setBackendStatus(st)}
      />

      {/* Source Citations Modal */}
      <SourceModal
        isOpen={sourceModalOpen}
        onClose={() => setSourceModalOpen(false)}
        sources={activeSources}
        activeSource={activeSourceHighlight}
      />
    </div>
  );
}
