// 번역 파이프라인 2단계: _kotrans/{product}-chunk*.json 조각을 product별 ko.json으로 병합.
// 원본 endpoint slug를 모두 커버하는지 검증합니다.
import fs from "node:fs";
import path from "node:path";
import { getBiostarApi, type BiostarProduct } from "../lib/biostar-doc";

const TRANS = path.join(process.cwd(), "content", "biostar", "_kotrans");
const OUT = path.join(process.cwd(), "content", "biostar");

type KoOverlay = {
  groups: Record<string, { title?: string; descHtml?: string }>;
  endpoints: Record<string, { name?: string; descHtml?: string; params?: Record<string, string> }>;
};

for (const product of ["bs2", "bsx"] as BiostarProduct[]) {
  // ko.json을 쓰기 전에 원본 slug 집합 확보 (아직 ko 미적용 상태)
  const koPath = path.join(OUT, `${product}.ko.json`);
  fs.rmSync(koPath, { force: true });
  // 캐시 회피를 위해 새 프로세스가 아니므로, 원본 검증은 collection 파서가 ko 없을 때 결과로 충분
  const api = getBiostarApi(product);
  const srcSlugs = new Set(api.groups.flatMap((g) => g.endpoints.map((e) => e.slug)));

  const merged: KoOverlay = { groups: {}, endpoints: {} };
  const files = fs
    .readdirSync(TRANS)
    .filter((f) => f.startsWith(`${product}-chunk`) && f.endsWith(".json"))
    .sort();
  for (const f of files) {
    const d = JSON.parse(fs.readFileSync(path.join(TRANS, f), "utf8")) as KoOverlay;
    Object.assign(merged.groups, d.groups);
    Object.assign(merged.endpoints, d.endpoints);
  }

  fs.writeFileSync(koPath, JSON.stringify(merged, null, 2));

  const koSlugs = new Set(Object.keys(merged.endpoints));
  const missing = [...srcSlugs].filter((s) => !koSlugs.has(s));
  const extra = [...koSlugs].filter((s) => !srcSlugs.has(s));
  console.log(
    `${product}: src=${srcSlugs.size} ko=${koSlugs.size} groups=${Object.keys(merged.groups).length} | missing=${missing.length} extra=${extra.length}`,
  );
  if (missing.length) console.log(`  MISSING: ${missing.slice(0, 10).join(", ")}${missing.length > 10 ? " ..." : ""}`);
  if (extra.length) console.log(`  EXTRA: ${extra.slice(0, 10).join(", ")}`);
}
