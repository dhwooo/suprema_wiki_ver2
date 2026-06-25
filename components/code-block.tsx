"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

const PROTO_KEYWORDS = /\b(message|enum|service|rpc|repeated|optional|oneof|returns|import|package|option|map|reserved|stream)\b/g;
const PROTO_TYPES = /\b(uint32|uint64|int32|int64|sint32|sint64|fixed32|fixed64|bytes|bool|string|float|double)\b/g;
const PY_KEYWORDS = /\b(def|class|import|from|return|if|elif|else|for|while|with|try|except|finally|as|in|is|not|and|or|None|True|False|lambda|pass|break|continue|raise|yield|global|print)\b/g;

function escapeCode(code: string): string {
  return code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightProto(code: string): string {
  let out = escapeCode(code);
  const comments: string[] = [];
  out = out.replace(/\/\/[^\n]*/g, (m) => {
    comments.push(m);
    return " C" + (comments.length - 1) + " ";
  });
  out = out.replace(PROTO_KEYWORDS, '<span class="tok-key">$1</span>');
  out = out.replace(PROTO_TYPES, '<span class="tok-type">$1</span>');
  out = out.replace(/=\s*(0x[0-9a-fA-F]+|\d+)/g, '= <span class="tok-num">$1</span>');
  out = out.replace(/ C(\d+) /g, (_m, n: string) => '<span class="tok-comment">' + comments[Number(n)] + "</span>");
  return out;
}

function highlightPython(code: string): string {
  let out = escapeCode(code);
  const comments: string[] = [];
  out = out.replace(/#[^\n]*/g, (m) => {
    comments.push(m);
    return " H" + (comments.length - 1) + " ";
  });
  const strings: string[] = [];
  out = out.replace(/('[^']*'|"[^"]*")/g, (m) => {
    strings.push(m);
    return " S" + (strings.length - 1) + " ";
  });
  out = out.replace(PY_KEYWORDS, '<span class="tok-key">$1</span>');
  out = out.replace(/ S(\d+) /g, (_m, n: string) => ' <span class="tok-str">' + strings[Number(n)] + "</span> ");
  out = out.replace(/ H(\d+) /g, (_m, n: string) => '<span class="tok-comment">' + comments[Number(n)] + "</span>");
  return out;
}

function highlight(code: string, lang: string): string {
  if (lang === "python" || lang === "py") return highlightPython(code);
  if (lang === "protobuf" || lang === "proto") return highlightProto(code);
  return escapeCode(code);
}

export function CodeBlock({ code, label, lang = "protobuf" }: { code: string; label?: string; lang?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // 클립보드 권한 거부 시 조용히 무시
    }
  }

  return (
    <div className="relative overflow-hidden rounded-lg border border-edge bg-[var(--code-bg)]">
      <div className="flex items-center justify-between border-b border-edge px-4 py-2">
        <span className="font-mono text-xs text-muted">{label ?? lang}</span>
        <button
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted transition-colors hover:bg-hover hover:text-text"
          onClick={copy}
          type="button"
          aria-label="코드 복사"
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? "복사됨" : "복사"}
        </button>
      </div>
      <pre className="overflow-x-auto px-4 py-3.5 text-[13px] leading-6">
        <code className="font-mono text-secondary" dangerouslySetInnerHTML={{ __html: highlight(code, lang) }} />
      </pre>
    </div>
  );
}
