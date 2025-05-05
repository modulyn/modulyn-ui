"use client";

import { useState } from "react";

import { Copy } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text?: string;
  className?: string;
}

export function CopyButton({ text = "", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      if (!text) {
        console.error("No text, HTML, or HTML reference to copy");
        return;
      }

      let textContent = text;

      await navigator.clipboard.writeText(textContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={className}
      onClick={copyToClipboard}
    >
      <Copy className="mr-2 h-4 w-4" />
      {copied ? "Copied!" : "Copy to Clipboard"}
    </Button>
  );
}
