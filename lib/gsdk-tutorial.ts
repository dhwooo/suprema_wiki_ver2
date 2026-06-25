import fs from "node:fs";
import path from "node:path";

// G-SDK Python 튜토리얼(docs/_tutorials/python/*.md)을 단계 + 코드 블록으로 파싱합니다.

export type TutorialBlock =
  | { kind: "step"; title: string; anchor: string; num: string | null }
  | { kind: "prose"; html: string }
  | { kind: "code"; lang: string; code: string };

export type Tutorial = {
  slug: string;
  title: string;
  blocks: TutorialBlock[];
  steps: { title: string; anchor: string; num: string | null }[];
};

const EN_DIR = path.join(process.cwd(), "content", "g-sdk-tutorials");
const KO_DIR = path.join(process.cwd(), "content", "g-sdk-tutorials-ko");

function resolvePath(slug: string): string | null {
  const ko = path.join(KO_DIR, `${slug}.md`);
  if (fs.existsSync(ko)) return ko;
  const en = path.join(EN_DIR, `${slug}.md`);
  if (fs.existsSync(en)) return en;
  return null;
}

export function listTutorials(): string[] {
  const dir = fs.existsSync(EN_DIR) ? EN_DIR : null;
  if (!dir) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}

export function hasTutorial(slug: string): boolean {
  return resolvePath(slug) !== null;
}

export function getTutorial(slug: string): Tutorial | null {
  const p = resolvePath(slug);
  if (!p) return null;
  return parseTutorial(slug, fs.readFileSync(p, "utf8"));
}

function escapeHtml(t: string): string {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function stripLiquid(t: string): string {
  return t.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, "$1");
}

function inlineMd(text: string): string {
  let out = escapeHtml(stripLiquid(text.trim()));
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, url: string) => {
    const href = url.trim();
    if (href.startsWith("#") || href.startsWith("/")) return `<a class="gsdk-ref" href="${href}">${label}</a>`;
    if (href.startsWith("http")) return `<a class="gsdk-ref" href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
    return label;
  });
  out = out.replace(/`([^`]+)`/g, '<code class="gsdk-code">$1</code>');
  out = out.replace(/__(.+?)__/g, "<strong>$1</strong>");
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  return out;
}

function slugifyAnchor(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9가-힣]+/g, "-").replace(/(^-|-$)/g, "");
}

function dedent(lines: string[]): string {
  const nonEmpty = lines.filter((l) => l.trim() !== "");
  if (nonEmpty.length === 0) return lines.join("\n");
  const indent = Math.min(...nonEmpty.map((l) => l.match(/^\s*/)?.[0].length ?? 0));
  return lines.map((l) => l.slice(indent)).join("\n").trim();
}

function parseTutorial(slug: string, raw: string): Tutorial {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;
  let title = slug;

  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") {
      const m = lines[i].match(/^title:\s*"?([^"]+)"?\s*$/);
      if (m) title = m[1].trim();
      i++;
    }
    i++;
  }

  const blocks: TutorialBlock[] = [];
  let proseBuf: string[] = [];
  const flushProse = () => {
    const text = proseBuf.join("\n").trim();
    if (text) blocks.push({ kind: "prose", html: inlineMd(text) });
    proseBuf = [];
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (trimmed.startsWith("## ")) {
      flushProse();
      const t = trimmed.replace(/^##\s+/, "").trim();
      const numMatch = t.match(/^(\d+)\.\s*(.*)$/);
      const num = numMatch ? numMatch[1] : null;
      const cleanTitle = numMatch ? numMatch[2] : t;
      blocks.push({ kind: "step", title: cleanTitle, anchor: slugifyAnchor(t), num });
      i++;
      continue;
    }

    // 코드블록 (들여쓰기 가능): trim 후 ``` 시작
    if (trimmed.startsWith("```")) {
      flushProse();
      const lang = trimmed.replace(/`/g, "").trim() || "text";
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "```") {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // 닫는 ```
      blocks.push({ kind: "code", lang, code: dedent(codeLines) });
      continue;
    }

    proseBuf.push(line);
    i++;
  }
  flushProse();

  const steps = blocks
    .filter((b): b is Extract<TutorialBlock, { kind: "step" }> => b.kind === "step")
    .map((b) => ({ title: b.title, anchor: b.anchor, num: b.num }));

  return { slug, title, blocks, steps };
}
