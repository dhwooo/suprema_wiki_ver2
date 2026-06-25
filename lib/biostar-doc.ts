import fs from "node:fs";
import path from "node:path";

// BioStar 2 / BioStar X 공식 Postman collection(v2.1 JSON)을 빌드타임에 파싱해
// 그룹/endpoint/파라미터/요청·응답 예시 단위의 구조화된 REST 레퍼런스로 변환합니다.
// G-SDK(lib/gsdk-doc.ts)가 gRPC/proto 문서를 다루는 것과 동형 구조이며,
// 데이터 모델만 REST(method·path·body·response)에 맞춰져 있습니다.

export type BiostarProduct = "bs2" | "bsx";

export type KeyValDesc = { key: string; value?: string; desc?: string };

export type BiostarResponse = {
  name: string;
  code?: number;
  status?: string;
  lang: string; // json, xml, text ...
  body: string;
};

export type BiostarEndpoint = {
  slug: string;
  name: string;
  method: string; // GET, POST, PUT, DELETE ...
  path: string; // {{baseUrl}} 제거한 경로 (예: /api/access_groups/:id)
  descHtml: string;
  group: string;
  groupSlug: string;
  subgroup?: string; // 2단계 폴더명 (예: Setting > Active Directory)
  pathParams: KeyValDesc[];
  queryParams: KeyValDesc[];
  headers: KeyValDesc[];
  bodyLang?: string;
  body?: string; // 요청 본문 예시 (raw)
  responses: BiostarResponse[];
};

export type BiostarGroup = {
  slug: string;
  title: string;
  descHtml: string;
  endpoints: BiostarEndpoint[];
};

export type BiostarApi = {
  product: BiostarProduct;
  title: string;
  baseUrl: string;
  groups: BiostarGroup[];
};

const CONTENT_DIR = path.join(process.cwd(), "content", "biostar");
const FILE: Record<BiostarProduct, string> = {
  bs2: "bs2.postman.json",
  bsx: "bsx.postman.json",
};

// "Revision Notes"처럼 endpoint가 아닌 문서 폴더는 레퍼런스에서 제외합니다.
const SKIP_GROUPS = new Set(["revision notes"]);

// ---------------------------------------------------------------------------
// markdown -> HTML (의존성 없이 처리. 블록: heading/list/code fence/paragraph,
// inline: bold/code/link). Postman description에 들어오는 수준만 지원합니다.
// ---------------------------------------------------------------------------

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function inline(text: string): string {
  let out = escapeHtml(text);
  // inline code
  out = out.replace(/`([^`]+)`/g, (_m, c) => `<code>${c}</code>`);
  // bold
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, label, href) => {
    const safe = String(href).replace(/"/g, "&quot;");
    return `<a href="${safe}" target="_blank" rel="noreferrer">${label}</a>`;
  });
  return out;
}

// 신뢰된 공식 소스이지만 dangerouslySetInnerHTML로 렌더하므로 실행 가능한 벡터만 제거.
function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/(href|src)\s*=\s*("|')\s*javascript:[^"']*\2/gi, '$1=$2#$2');
}

// BS2 description은 이미 HTML, BSX description은 마크다운입니다. 포맷을 감지해 분기합니다.
function richText(src: string | undefined | null): string {
  if (!src) return "";
  const text = String(src).replace(/\r\n/g, "\n").trim();
  if (!text) return "";
  if (/<(p|h[1-6]|ul|ol|li|table|div|br|strong|pre|code|blockquote)\b/i.test(text)) {
    return sanitizeHtml(text);
  }
  return mdToHtml(text);
}

function mdToHtml(text: string): string {

  const lines = text.split("\n");
  const blocks: string[] = [];
  let para: string[] = [];
  let list: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let inFence = false;
  let fence: string[] = [];

  const flushPara = () => {
    if (para.length) {
      blocks.push(`<p>${inline(para.join(" "))}</p>`);
      para = [];
    }
  };
  const flushList = () => {
    if (list.length && listType) {
      blocks.push(`<${listType}>${list.map((li) => `<li>${inline(li)}</li>`).join("")}</${listType}>`);
      list = [];
      listType = null;
    }
  };

  for (const raw of lines) {
    const line = raw;
    if (line.trim().startsWith("```")) {
      if (inFence) {
        blocks.push(`<pre class="bs-pre"><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
        fence = [];
        inFence = false;
      } else {
        flushPara();
        flushList();
        inFence = true;
      }
      continue;
    }
    if (inFence) {
      fence.push(line);
      continue;
    }

    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      flushPara();
      flushList();
      const level = Math.min(heading[1].length + 2, 6); // #=h3 기준
      blocks.push(`<h${level}>${inline(heading[2].trim())}</h${level}>`);
      continue;
    }

    const ol = line.match(/^\s*\d+[.)]\s+(.*)$/);
    const ul = line.match(/^\s*[-*+]\s+(.*)$/);
    if (ol) {
      flushPara();
      if (listType && listType !== "ol") flushList();
      listType = "ol";
      list.push(ol[1]);
      continue;
    }
    if (ul) {
      flushPara();
      if (listType && listType !== "ul") flushList();
      listType = "ul";
      list.push(ul[1]);
      continue;
    }

    if (line.trim() === "") {
      flushPara();
      flushList();
      continue;
    }
    para.push(line.trim());
  }
  if (inFence && fence.length) blocks.push(`<pre class="bs-pre"><code>${escapeHtml(fence.join("\n"))}</code></pre>`);
  flushPara();
  flushList();
  return blocks.join("\n");
}

// ---------------------------------------------------------------------------
// Postman collection 파싱
// ---------------------------------------------------------------------------

type PmDesc = string | { content?: string } | null | undefined;

function descText(d: PmDesc): string {
  if (!d) return "";
  if (typeof d === "string") return d;
  return d.content ?? "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60) || "item";
}

function stripBaseUrl(raw: string, baseUrl: string): string {
  if (!raw) return "";
  let p = raw.replace(/^\{\{[^}]+\}\}/, ""); // BSX: {{baseUrl}} 등 선행 변수 제거
  if (baseUrl && p.startsWith(baseUrl)) p = p.slice(baseUrl.length); // BS2: 치환된 절대 URL 제거
  p = p.replace(/^https?:\/\/[^/]+/, ""); // 잔여 호스트 제거
  if (!p.startsWith("/")) p = `/${p}`;
  return p;
}

type PmItem = {
  name?: string;
  description?: PmDesc;
  item?: PmItem[];
  request?: {
    method?: string;
    url?: string | { raw?: string; path?: string[]; query?: Array<{ key?: string; value?: string; description?: PmDesc }>; variable?: Array<{ key?: string; value?: string; description?: PmDesc }> };
    header?: Array<{ key?: string; value?: string; description?: PmDesc; disabled?: boolean }>;
    body?: { mode?: string; raw?: string; options?: { raw?: { language?: string } } };
    description?: PmDesc;
  };
  response?: Array<{
    name?: string;
    code?: number;
    status?: string;
    _postman_previewlanguage?: string;
    body?: string;
  }>;
};

function parseEndpoint(item: PmItem, group: string, groupSlug: string, subgroup: string | undefined, index: number, baseUrl: string): BiostarEndpoint {
  const req = item.request!;
  const url = req.url;
  const raw = typeof url === "string" ? url : url?.raw ?? "";
  const method = (req.method ?? "GET").toUpperCase();

  const pathParams: KeyValDesc[] = [];
  const queryParams: KeyValDesc[] = [];
  if (url && typeof url === "object") {
    for (const v of url.variable ?? []) {
      if (v.key) pathParams.push({ key: v.key, value: v.value, desc: descText(v.description) || undefined });
    }
    for (const q of url.query ?? []) {
      if (q.key) queryParams.push({ key: q.key, value: q.value, desc: descText(q.description) || undefined });
    }
  }

  const headers: KeyValDesc[] = (req.header ?? [])
    .filter((h) => h.key && !h.disabled)
    .map((h) => ({ key: h.key as string, value: h.value, desc: descText(h.description) || undefined }));

  const bodyRaw = req.body?.mode === "raw" ? req.body?.raw : undefined;
  const bodyLang = req.body?.options?.raw?.language ?? (bodyRaw ? "json" : undefined);

  const responses: BiostarResponse[] = (item.response ?? [])
    .filter((r) => r.body)
    .map((r) => ({
      name: r.name ?? "Response",
      code: r.code,
      status: r.status,
      lang: r._postman_previewlanguage ?? "json",
      body: r.body as string,
    }));

  const cleanPath = stripBaseUrl(raw, baseUrl);
  const name = item.name ?? `${method} ${cleanPath}`;
  const slug = `${groupSlug}-${slugify(name)}-${index}`;

  return {
    slug,
    name,
    method,
    path: cleanPath,
    descHtml: richText(descText(req.description) || descText(item.description)),
    group,
    groupSlug,
    subgroup,
    pathParams,
    queryParams,
    headers,
    bodyLang: bodyRaw ? bodyLang : undefined,
    body: bodyRaw,
    responses,
  };
}

// 그룹(최상위 폴더) 안의 endpoint를 재귀로 모읍니다. 중첩 폴더명은 subgroup으로 기록.
function collectEndpoints(items: PmItem[], group: string, groupSlug: string, subgroup: string | undefined, acc: BiostarEndpoint[], baseUrl: string): void {
  for (const it of items) {
    if (it.request) {
      acc.push(parseEndpoint(it, group, groupSlug, subgroup, acc.length, baseUrl));
    } else if (it.item) {
      collectEndpoints(it.item, group, groupSlug, it.name, acc, baseUrl);
    }
  }
}

function readCollection(product: BiostarProduct): PmItem & { info?: { name?: string }; variable?: Array<{ key?: string; value?: string }> } {
  const file = path.join(CONTENT_DIR, FILE[product]);
  const data = JSON.parse(fs.readFileSync(file, "utf8"));
  return data.collection ?? data;
}

const cache: Partial<Record<BiostarProduct, BiostarApi>> = {};

export function getBiostarApi(product: BiostarProduct): BiostarApi {
  if (cache[product]) return cache[product]!;
  const root = readCollection(product);
  const baseUrl = (root.variable ?? []).find((v) => v.key === "baseUrl")?.value ?? "";

  const groups: BiostarGroup[] = [];
  for (const top of root.item ?? []) {
    if (!top.item && !top.request) continue;
    const title = top.name ?? "Untitled";
    if (SKIP_GROUPS.has(title.toLowerCase())) continue;

    const endpoints: BiostarEndpoint[] = [];
    const groupSlug = slugify(title);
    if (top.item) collectEndpoints(top.item, title, groupSlug, undefined, endpoints, baseUrl);
    else if (top.request) collectEndpoints([top], title, groupSlug, undefined, endpoints, baseUrl);

    if (endpoints.length === 0) continue;
    groups.push({
      slug: groupSlug,
      title,
      descHtml: richText(descText(top.description)),
      endpoints,
    });
  }

  const api: BiostarApi = {
    product,
    title: root.info?.name ?? (product === "bs2" ? "BioStar 2 API" : "BioStar X API"),
    baseUrl,
    groups,
  };
  cache[product] = api;
  return api;
}

export function getBiostarEndpoint(product: BiostarProduct, slug: string): { endpoint: BiostarEndpoint; group: BiostarGroup } | null {
  const api = getBiostarApi(product);
  for (const group of api.groups) {
    const endpoint = group.endpoints.find((e) => e.slug === slug);
    if (endpoint) return { endpoint, group };
  }
  return null;
}

export function getBiostarParams(product: BiostarProduct): { slug: string }[] {
  return getBiostarApi(product).groups.flatMap((g) => g.endpoints.map((e) => ({ slug: e.slug })));
}
