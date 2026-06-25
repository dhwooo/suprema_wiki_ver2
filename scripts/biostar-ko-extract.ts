// 번역 파이프라인 1단계: 원문(영어) 텍스트를 그룹 균등 청크로 추출.
// 산출물 content/biostar/_kosrc/{product}-chunk{N}.json 를 번역 에이전트가 받아 번역합니다.
import fs from "node:fs";
import path from "node:path";
import { getBiostarApi, type BiostarProduct } from "../lib/biostar-doc";

const OUT = path.join(process.cwd(), "content", "biostar", "_kosrc");
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });

const TARGET_BYTES = 50 * 1024;

type Ep = ReturnType<typeof getBiostarApi>["groups"][number]["endpoints"][number];
type GroupMeta = { title: string; descHtml?: string };

for (const product of ["bs2", "bsx"] as BiostarProduct[]) {
  const api = getBiostarApi(product);

  // 모든 endpoint를 평면화(그룹 출처 보존)한 뒤 크기 기준으로 균등 청크 분할.
  const flat: { gSlug: string; gMeta: GroupMeta; e: Ep }[] = [];
  for (const g of api.groups) {
    const gMeta: GroupMeta = { title: g.title, ...(g.descHtml ? { descHtml: g.descHtml } : {}) };
    for (const e of g.endpoints) flat.push({ gSlug: g.slug, gMeta, e });
  }

  const chunks: (typeof flat)[] = [[]];
  let cur = 0;
  for (const item of flat) {
    const s = JSON.stringify(item.e).length;
    if (cur > 0 && cur + s > TARGET_BYTES) {
      chunks.push([]);
      cur = 0;
    }
    chunks[chunks.length - 1].push(item);
    cur += s;
  }

  chunks.forEach((items, i) => {
    const out: {
      product: string;
      chunk: number;
      groups: Record<string, GroupMeta>;
      endpoints: Record<string, { name: string; descHtml?: string; params?: Record<string, string> }>;
    } = { product, chunk: i + 1, groups: {}, endpoints: {} };

    for (const { gSlug, gMeta, e } of items) {
      out.groups[gSlug] = gMeta; // 같은 그룹이 여러 청크에 걸치면 meta 중복(머지 시 동일값, 무해)
      const params: Record<string, string> = {};
      for (const arr of [e.pathParams, e.queryParams, e.headers]) {
        for (const p of arr) if (p.desc) params[p.key] = p.desc;
      }
      out.endpoints[e.slug] = {
        name: e.name,
        ...(e.descHtml ? { descHtml: e.descHtml } : {}),
        ...(Object.keys(params).length ? { params } : {}),
      };
    }
    const file = path.join(OUT, `${product}-chunk${i + 1}.json`);
    fs.writeFileSync(file, JSON.stringify(out, null, 2));
    const kb = Math.round(fs.statSync(file).size / 1024);
    console.log(`${file}: ${Object.keys(out.endpoints).length} endpoints, ${kb}KB`);
  });
}
