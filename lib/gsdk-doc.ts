import fs from "node:fs";
import path from "node:path";

// G-SDK 공식 문서(docs/_apis/*.md, Jekyll 포맷)를 빌드타임에 파싱해
// 메서드/메시지/enum/필드 단위의 구조화된 레퍼런스 데이터로 변환합니다.

export type DocFieldKind = "message" | "enum" | "service" | "other";

export type DocField = {
  name: string;
  fieldType?: string; // proto 타입(uint32, CardData ...) 또는 enum 값(0x01)
  repeated?: boolean;
  typeRef?: string; // 같은 페이지 앵커(#CardData) 또는 외부/타 API 링크
  version?: string; // [+ 1.9.0] 같은 도입 버전 태그
  desc: string; // inline 마크다운이 HTML로 변환된 값
};

export type IoRow = {
  param: string;
  type: string;
  typeRef?: string;
  desc: string;
};

export type DocBlock =
  | { kind: "section"; title: string; anchor: string }
  | { kind: "subsection"; title: string; anchor: string; isMethod: boolean }
  | { kind: "prose"; html: string }
  | { kind: "proto"; defKind: DocFieldKind; name: string; anchor: string; code: string; fields: DocField[] }
  | { kind: "io"; label: "Request" | "Response"; rows: IoRow[] }
  | { kind: "table"; headers: string[]; rows: string[][] };

export type ApiDoc = {
  slug: string;
  title: string;
  blocks: DocBlock[];
  methodNames: string[];
  typeNames: string[];
};

const EN_DIR = path.join(process.cwd(), "content", "g-sdk-apis");
const KO_DIR = path.join(process.cwd(), "content", "g-sdk-apis-ko");

// 한국어 번역본(ko)이 있으면 우선 사용하고, 없으면 영어 원본(en)으로 폴백합니다.
function resolveDocPath(slug: string): string | null {
  const file = SLUG_TO_FILE[slug] ?? slug;
  const ko = path.join(KO_DIR, `${file}.md`);
  if (fs.existsSync(ko)) return ko;
  const en = path.join(EN_DIR, `${file}.md`);
  if (fs.existsSync(en)) return en;
  return null;
}

// 위키 slug -> md 파일명(확장자 제외) 매핑. 명시되지 않은 slug는 그대로 사용.
const SLUG_TO_FILE: Record<string, string> = {
  "connect-master": "connectMaster",
  "master-admin": "masteradmin",
  "device-license": "devicelicense",
  ta: "tna",
  "anti-passback-zone": "apbZone",
  "timed-anti-passback-zone": "timedApbZone",
  "intrusion-alarm-zone": "intrusionZone",
  "fire-alarm-zone": "fireZone",
  "scheduled-lock-zone": "lockZone",
  "interlock-zone": "interlockZone",
  "lift-zone": "liftZone",
  "udp-master": "udpMaster",
};

export function hasApiDoc(slug: string): boolean {
  return resolveDocPath(slug) !== null;
}

export function getApiDoc(slug: string): ApiDoc | null {
  const fullPath = resolveDocPath(slug);
  if (!fullPath) return null;
  const raw = fs.readFileSync(fullPath, "utf8");
  return parseApiDoc(slug, raw);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// Jekyll liquid `{{ '/api/user/' | relative_url }}` -> `/api/user/`
function stripLiquid(text: string): string {
  return text.replace(/\{\{\s*'([^']+)'\s*\|\s*relative_url\s*\}\}/g, "$1");
}

// desc/prose 안의 인라인 마크다운을 안전한 HTML로 변환
function inlineMd(text: string): string {
  let out = escapeHtml(stripLiquid(text.trim()));
  // 링크 [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label: string, url: string) => {
    const href = url.trim();
    if (href.startsWith("#")) {
      return `<a class="gsdk-ref" href="${href}">${label}</a>`;
    }
    if (href.startsWith("/")) {
      return `<a class="gsdk-ref" href="${href}">${label}</a>`;
    }
    if (href.startsWith("http")) {
      return `<a class="gsdk-ref" href="${href}" target="_blank" rel="noreferrer">${label}</a>`;
    }
    return label;
  });
  out = out.replace(/`([^`]+)`/g, '<code class="gsdk-code">$1</code>');
  out = out.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  out = out.replace(/__(.+?)__/g, "<strong>$1</strong>");
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  // 단어 내부 언더스코어(DATA_BINARY 등)는 제외하고 _italic_ 만 변환
  out = out.replace(/(^|[\s(])_([^_\s][^_]*?)_(?=[\s.,):]|$)/g, "$1<em>$2</em>");
  return out;
}

function slugifyAnchor(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// "[+ 1.9.0] [field](#ref)" 또는 "field" 형태의 term 라인을 분해
function parseTermLine(line: string): { name: string; typeRef?: string; version?: string } | null {
  let rest = line.trim();
  if (!rest) return null;
  let version: string | undefined;
  const verMatch = rest.match(/^\[\+\s*([^\]]+)\]\s*/);
  if (verMatch) {
    version = verMatch[1].trim();
    rest = rest.slice(verMatch[0].length).trim();
  }
  // [name](#ref)
  const linkMatch = rest.match(/^\[([^\]]+)\]\(([^)]+)\)\s*$/);
  if (linkMatch) {
    return { name: linkMatch[1], typeRef: linkMatch[2].trim(), version };
  }
  // 일반 식별자 (slash 허용: headerCRC/cardCRC, startTime/endTime)
  if (/^[A-Za-z_][\w/]*$/.test(rest)) {
    return { name: rest, version };
  }
  return null;
}

function protoBody(code: string): string {
  const open = code.indexOf("{");
  const close = code.lastIndexOf("}");
  if (open < 0 || close < 0) return "";
  return code.slice(open + 1, close);
}

// message body에서 타입이 있는 필드 목록을 추출
function parseMessageMembers(code: string): { name: string; fieldType: string; repeated: boolean }[] {
  const out: { name: string; fieldType: string; repeated: boolean }[] = [];
  for (let line of protoBody(code).split("\n")) {
    line = line.replace(/\/\/.*$/, "").trim().replace(/;+\s*$/, "").trim();
    if (!line) continue;
    if (/^oneof\b/.test(line) || line === "}" || line === "{") continue; // oneof 래퍼는 건너뜀
    const m = line.match(/^(repeated\s+|optional\s+)?([\w.]+)\s+(\w+)\s*(?:=\s*\d+)?$/);
    if (m) {
      out.push({ repeated: (m[1] ?? "").includes("repeated"), fieldType: m[2], name: m[3] });
    }
  }
  return out;
}

// enum body에서 값 목록을 추출
function parseEnumMembers(code: string): { name: string; fieldType: string }[] {
  const out: { name: string; fieldType: string }[] = [];
  for (let line of protoBody(code).split("\n")) {
    line = line.replace(/\/\/.*$/, "").trim().replace(/;+\s*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^(\w+)\s*=\s*(0x[0-9a-fA-F]+|\d+)$/);
    if (m) out.push({ name: m[1], fieldType: m[2] });
  }
  return out;
}

function parseProtoSignature(code: string): { defKind: DocFieldKind; name: string } {
  const enumMatch = code.match(/enum\s+(\w+)/);
  if (enumMatch) return { defKind: "enum", name: enumMatch[1] };
  const msgMatch = code.match(/message\s+(\w+)/);
  if (msgMatch) return { defKind: "message", name: msgMatch[1] };
  const svcMatch = code.match(/service\s+(\w+)/);
  if (svcMatch) return { defKind: "service", name: svcMatch[1] };
  return { defKind: "other", name: "" };
}

function parseApiDoc(slug: string, raw: string): ApiDoc {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  let i = 0;

  // front matter
  let title = slug;
  if (lines[0]?.trim() === "---") {
    i = 1;
    while (i < lines.length && lines[i].trim() !== "---") {
      const m = lines[i].match(/^title:\s*"?([^"]+)"?\s*$/);
      if (m) title = m[1].trim();
      i++;
    }
    i++; // 닫는 ---
  }

  const blocks: DocBlock[] = [];

  const flushProse = (buf: string[]) => {
    const text = buf.join("\n").trim();
    if (text) blocks.push({ kind: "prose", html: inlineMd(text) });
  };

  let proseBuf: string[] = [];

  const isStructToken = (line: string) => {
    const t = line.trim();
    return (
      t.startsWith("## ") ||
      t.startsWith("### ") ||
      t.startsWith("```") ||
      t === "| Request |" ||
      t === "| Response |"
    );
  };

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    // 섹션 / 하위섹션
    if (trimmed.startsWith("## ") && !trimmed.startsWith("### ")) {
      flushProse(proseBuf);
      proseBuf = [];
      const t = trimmed.replace(/^##\s+/, "").trim();
      blocks.push({ kind: "section", title: t, anchor: slugifyAnchor(t) });
      i++;
      continue;
    }
    if (trimmed.startsWith("### ")) {
      flushProse(proseBuf);
      proseBuf = [];
      const t = trimmed.replace(/^###\s+/, "").trim();
      // 메서드 여부는 후처리에서 결정 (뒤에 io 블록이 붙는지로 판단)
      blocks.push({ kind: "subsection", title: t, anchor: slugifyAnchor(t), isMethod: false });
      i++;
      continue;
    }

    // protobuf 코드블록
    if (trimmed.startsWith("```")) {
      flushProse(proseBuf);
      proseBuf = [];
      const fence = trimmed;
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() !== "```") {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // 닫는 ```
      const code = codeLines.join("\n");
      const isProto = fence.includes("protobuf") || /\b(message|enum|service)\b/.test(code);
      if (!isProto) {
        // 일반 코드블록은 prose로 보존
        blocks.push({ kind: "prose", html: `<pre class="gsdk-pre"><code>${escapeHtml(code)}</code></pre>` });
        continue;
      }
      const sig = parseProtoSignature(code);
      // 다음 비빈 라인의 {: #Anchor }
      let anchor = slugifyAnchor(sig.name);
      let j = i;
      while (j < lines.length && lines[j].trim() === "") j++;
      const anchorMatch = lines[j]?.match(/^\{:\s*#([\w-]+)\s*\}\s*$/);
      if (anchorMatch) {
        anchor = anchorMatch[1];
        i = j + 1;
      }
      // definition list (필드/enum 값 설명) 수집
      type Def = { desc: string; version?: string; typeRef?: string };
      const defMap = new Map<string, Def>();
      const defOrder: string[] = [];
      while (i < lines.length) {
        // 다음 구조 토큰 만나면 종료
        if (isStructToken(lines[i])) break;
        const termInfo = parseTermLine(lines[i]);
        const nextLine = lines[i + 1] ?? "";
        if (termInfo && nextLine.trim().startsWith(":")) {
          // desc 수집: 첫 ': ' 라인 + 이어지는 비빈/비term 라인
          const descParts: string[] = [];
          descParts.push(nextLine.trim().replace(/^:\s?/, ""));
          let k = i + 2;
          while (k < lines.length) {
            const ln = lines[k];
            if (ln.trim() === "") break;
            if (isStructToken(ln)) break;
            // 다음 term 시작이면 중단
            const peek = parseTermLine(ln);
            if (peek && (lines[k + 1] ?? "").trim().startsWith(":")) break;
            if (ln.trim().startsWith("|")) break; // 보조 테이블은 생략
            descParts.push(ln.trim());
            k++;
          }
          const def: Def = {
            desc: inlineMd(descParts.join(" ")),
            version: termInfo.version,
            typeRef: termInfo.typeRef,
          };
          // "headerCRC/cardCRC" 처럼 한 줄에 묶인 term은 각각 매핑
          for (const part of termInfo.name.split("/")) {
            const key = part.trim();
            if (!defMap.has(key)) defOrder.push(key);
            defMap.set(key, def);
          }
          i = k;
          continue;
        }
        if (lines[i].trim() === "") {
          i++;
          continue;
        }
        break;
      }

      // proto 코드 멤버(타입 포함)와 definition 설명을 병합
      const fields: DocField[] = [];
      const used = new Set<string>();
      const members =
        sig.defKind === "enum"
          ? parseEnumMembers(code)
          : sig.defKind === "message"
            ? parseMessageMembers(code)
            : [];
      for (const mem of members) {
        const def = defMap.get(mem.name);
        if (def) used.add(mem.name);
        fields.push({
          name: mem.name,
          fieldType: mem.fieldType,
          repeated: "repeated" in mem ? (mem as { repeated: boolean }).repeated : undefined,
          typeRef: def?.typeRef,
          version: def?.version,
          desc: def?.desc ?? "",
        });
      }
      // 코드에 없지만 설명만 있는 term은 뒤에 덧붙임
      for (const key of defOrder) {
        if (used.has(key)) continue;
        const def = defMap.get(key);
        if (!def) continue;
        fields.push({ name: key, typeRef: def.typeRef, version: def.version, desc: def.desc });
      }

      blocks.push({ kind: "proto", defKind: sig.defKind, name: sig.name || anchor, anchor, code, fields });
      continue;
    }

    // Request / Response 테이블
    if (trimmed === "| Request |" || trimmed === "| Response |") {
      flushProse(proseBuf);
      proseBuf = [];
      const label = trimmed === "| Request |" ? "Request" : "Response";
      i++;
      // 다음 테이블(헤더 | 구분선 | 행들) 파싱
      while (i < lines.length && lines[i].trim() === "") i++;
      const rows: IoRow[] = [];
      if (lines[i]?.trim().startsWith("|")) {
        // 헤더 + 구분선 스킵
        i += 2;
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          const cells = splitTableRow(lines[i]);
          if (cells.length >= 3) {
            const typeCell = cells[1];
            const link = typeCell.match(/\[([^\]]+)\]\(([^)]+)\)/);
            rows.push({
              param: cells[0],
              type: link ? link[1] : typeCell,
              typeRef: link ? link[2] : undefined,
              desc: inlineMd(cells[2]),
            });
          }
          i++;
        }
      }
      blocks.push({ kind: "io", label, rows });
      continue;
    }

    // 마크다운 테이블: 구분선이 있으면 헤더 있는 표, 없으면 헤더 없는 key-value 표
    if (trimmed.startsWith("|")) {
      const nextTrim = (lines[i + 1] ?? "").trim();
      const isSeparator = (s: string) => /^\|?[\s:|-]+\|?$/.test(s) && s.includes("-");
      const headed = isSeparator(nextTrim);
      // 헤더 없는 표는 다음 줄도 `|` 로 시작하는 경우에만(단일 파이프 문장 오인 방지)
      if (headed || nextTrim.startsWith("|")) {
        flushProse(proseBuf);
        proseBuf = [];
        let headers: string[] = [];
        if (headed) {
          headers = splitTableRow(line);
          i += 2;
        }
        const rows: string[][] = [];
        while (i < lines.length && lines[i].trim().startsWith("|")) {
          if (isSeparator(lines[i].trim())) {
            i++;
            continue;
          }
          rows.push(splitTableRow(lines[i]).map((c) => inlineMd(c)));
          i++;
        }
        blocks.push({ kind: "table", headers, rows });
        continue;
      }
    }

    // 그 외: prose 누적
    proseBuf.push(line);
    i++;
  }
  flushProse(proseBuf);

  // 후처리: subsection 뒤에 io 블록이 따라오면 메서드로 표시
  for (let b = 0; b < blocks.length; b++) {
    const block = blocks[b];
    if (block.kind === "subsection") {
      for (let n = b + 1; n < blocks.length; n++) {
        const nb = blocks[n];
        if (nb.kind === "section" || nb.kind === "subsection") break;
        if (nb.kind === "io") {
          block.isMethod = true;
          break;
        }
      }
    }
  }

  const methodNames = blocks
    .filter((b): b is Extract<DocBlock, { kind: "subsection" }> => b.kind === "subsection" && b.isMethod)
    .map((b) => b.title);
  const typeNames = blocks
    .filter((b): b is Extract<DocBlock, { kind: "proto" }> => b.kind === "proto")
    .map((b) => b.name);

  return { slug, title, blocks, methodNames, typeNames };
}

function splitTableRow(line: string): string[] {
  const t = line.trim().replace(/^\|/, "").replace(/\|$/, "");
  return t.split("|").map((c) => c.trim());
}
