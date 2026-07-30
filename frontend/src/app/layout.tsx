import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DriveMind RAG — Personal Library AI Assistant",
  description: "Interactive RAG assistant powered by Google Drive documents, Gemini API, and Qdrant Cloud.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0F1115] text-[#EAEAEA] antialiased selection:bg-[#D9A441] selection:text-[#0F1115]">
        {children}
      </body>
    </html>
  );
}
