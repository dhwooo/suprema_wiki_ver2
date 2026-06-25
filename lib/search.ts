import { docs } from "@/lib/docs";
import { apiCollections, apiItems, getApiDetail } from "@/lib/api-reference";
import { biostar2ApiGroups, biostar2Examples, biostarXApiGroups, biostarXExamples } from "@/lib/biostar-reference";

export type SearchEntry = {
  title: string;
  subtitle: string;
  href: string;
  group: "API" | "Collection" | "Reference" | "BioStar 2" | "BioStar X";
  keywords: string; // 소문자 결합 검색 대상(메서드명 포함)
};

let cached: SearchEntry[] | null = null;

// 사이트 전체 콘텐츠(API 서비스·메서드명·Collection·Reference·BioStar)를 한 인덱스로 모읍니다.
export function getSearchEntries(): SearchEntry[] {
  if (cached) return cached;
  const entries: SearchEntry[] = [];

  for (const item of apiItems) {
    const detail = getApiDetail(item.slug);
    const methodNames = detail?.methodGroups?.flatMap((group) => group.methods) ?? [];
    entries.push({
      title: item.name,
      subtitle: item.summary,
      href: `/api/${item.slug}`,
      group: "API",
      keywords: [item.name, item.summary, item.group, ...methodNames].join(" ").toLowerCase(),
    });
  }

  for (const collection of apiCollections) {
    entries.push({
      title: collection.title,
      subtitle: collection.description,
      href: `/api#coll-${collection.slug}`,
      group: "Collection",
      keywords: [collection.title, collection.description, ...collection.apis].join(" ").toLowerCase(),
    });
  }

  for (const doc of docs) {
    entries.push({
      title: doc.title,
      subtitle: doc.description,
      href: `/reference/${doc.slug}`,
      group: "Reference",
      keywords: [doc.title, doc.description, doc.category, doc.workflow, ...doc.tags].join(" ").toLowerCase(),
    });
  }

  for (const group of biostar2ApiGroups) {
    entries.push({
      title: group.title,
      subtitle: group.description,
      href: `/biostar/2/api-reference#${group.slug}`,
      group: "BioStar 2",
      keywords: [group.title, group.description, group.protocol, ...group.endpoints].join(" ").toLowerCase(),
    });
  }
  for (const example of biostar2Examples) {
    entries.push({
      title: example.title,
      subtitle: example.description,
      href: `/biostar/2/examples#${example.slug}`,
      group: "BioStar 2",
      keywords: [example.title, example.description, ...example.tags].join(" ").toLowerCase(),
    });
  }

  for (const group of biostarXApiGroups) {
    entries.push({
      title: group.title,
      subtitle: group.description,
      href: `/biostar/x/api-reference#${group.slug}`,
      group: "BioStar X",
      keywords: [group.title, group.description, group.protocol, ...group.endpoints].join(" ").toLowerCase(),
    });
  }
  for (const example of biostarXExamples) {
    entries.push({
      title: example.title,
      subtitle: example.description,
      href: `/biostar/x/examples#${example.slug}`,
      group: "BioStar X",
      keywords: [example.title, example.description, ...example.tags].join(" ").toLowerCase(),
    });
  }

  cached = entries;
  return entries;
}

// 공백으로 나눈 모든 토큰이 keywords에 포함되면 매치(AND). 점수로 정렬용 가중치 반환.
export function searchEntries(entries: SearchEntry[], query: string): SearchEntry[] {
  const tokens = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return [];
  const scored: { entry: SearchEntry; score: number }[] = [];
  for (const entry of entries) {
    const title = entry.title.toLowerCase();
    let ok = true;
    let score = 0;
    for (const token of tokens) {
      if (!entry.keywords.includes(token)) {
        ok = false;
        break;
      }
      if (title.includes(token)) score += 3;
      if (title.startsWith(token)) score += 2;
    }
    if (ok) scored.push({ entry, score });
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.entry);
}
