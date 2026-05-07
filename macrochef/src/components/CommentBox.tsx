"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/Button";

export default function CommentBox({ onSubmit }: { onSubmit: (content: string) => Promise<void> }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!content.trim()) return;
    setLoading(true);
    await onSubmit(content);
    setContent("");
    setLoading(false);
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <textarea
        className="min-h-24 flex-1 rounded-lg border border-zinc-800 bg-zinc-950 p-3 text-sm text-white outline-none focus:border-emerald-400"
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Add a comment"
      />
      <Button className="sm:self-end" disabled={loading}>
        <Send size={16} />
        Comment
      </Button>
    </form>
  );
}
