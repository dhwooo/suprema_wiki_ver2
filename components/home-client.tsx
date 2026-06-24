"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Boxes,
  CirclePlay,
  Code2,
  Fingerprint,
  Network,
  Search,
  Server,
  Settings2,
  ShieldCheck,
  Users,
  Zap,
} from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DocThumbnail } from "@/components/doc-thumbnail";
import { SiteHeader } from "@/components/site-header";
import {
  categories,
  collections,
  docs,
  docTypes,
  platforms,
  teams,
  workflows,
  type Collection,
  type IconName,
} from "@/lib/docs";
import { cn } from "@/lib/utils";

const iconMap: Record<IconName, React.ElementType> = {
  network: Network,
  play: CirclePlay,
  fingerprint: Fingerprint,
  users: Users,
  shield: ShieldCheck,
  settings: Settings2,
};

const sortOptions = ["추천순", "짧은 문서", "고급 우선"];

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function rankLevel(level: string) {
  return { 고급: 3, 중급: 2, 입문: 1 }[level as "고급" | "중급" | "입문"] ?? 0;
}

export function HomeClient() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  const category = searchParams.get("category") ?? "전체";
  const platform = searchParams.get("platform") ?? "전체";
  const workflow = searchParams.get("workflow") ?? "전체";
  const team = searchParams.get("team") ?? "전체";
  const type = searchParams.get("type") ?? "전체";
  const sort = searchParams.get("sort") ?? "추천순";

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "전체" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function setSearch(value: string) {
    setQuery(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value.trim()) {
      params.set("q", value);
    } else {
      params.delete("q");
    }
    router.replace(`${pathname}${params.toString() ? `?${params.toString()}` : ""}`, { scroll: false });
  }

  function applyCollection(collection: Collection) {
    setParam(collection.filterKind, collection.filter);
  }

  const matchesCurrentFilters = useCallback(
    (doc: (typeof docs)[number]) => {
      const text = normalize(query);
      const haystack = normalize([
        doc.title,
        doc.description,
        doc.category,
        doc.platform,
        doc.workflow,
        doc.team,
        doc.type,
        doc.level,
        ...doc.tags,
      ].join(" "));

      return (
        (!text || haystack.includes(text)) &&
        (category === "전체" || doc.category === category) &&
        (platform === "전체" || doc.platform === platform) &&
        (workflow === "전체" || doc.workflow === workflow) &&
        (team === "전체" || doc.team === team) &&
        (type === "전체" || doc.type === type)
      );
    },
    [category, platform, query, team, type, workflow],
  );

  const filteredDocs = useMemo(() => {
    const result = docs.filter(matchesCurrentFilters);

    if (sort === "짧은 문서") {
      return [...result].sort((a, b) => Number.parseInt(a.time) - Number.parseInt(b.time));
    }
    if (sort === "고급 우선") {
      return [...result].sort((a, b) => rankLevel(b.level) - rankLevel(a.level));
    }
    return result;
  }, [matchesCurrentFilters, sort]);

  const featuredDocs = docs.filter((doc) => doc.featured && matchesCurrentFilters(doc)).slice(0, 3);

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader
        active="home"
        searchSlot={
          <label className="flex h-10 w-[250px] items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-4 text-neutral-500 max-[760px]:w-full">
            <Search size={16} />
            <Input value={query} onChange={(event) => setSearch(event.target.value)} placeholder="문서 검색" />
          </label>
        }
      />

      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-7 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">Platform</p>
            <h2 className="mb-2 text-[17px] font-medium leading-tight text-neutral-200">BioStar 2 장치 연동</h2>
            <p className="text-sm leading-6 text-neutral-500">Gateway 기반 연결, 사용자 관리, 출입통제, 이벤트 수집을 기능별로 탐색합니다.</p>
          </div>
          <FilterGroup title="Category" values={categories} current={category} onChange={(value) => setParam("category", value)} />
          <FilterGroup title="Native" values={platforms} current={platform} onChange={(value) => setParam("platform", value)} />
          <FilterGroup title="Workflows" values={workflows} current={workflow} onChange={(value) => setParam("workflow", value)} />
          <FilterGroup title="Team" values={teams} current={team} onChange={(value) => setParam("team", value)} />
          <FilterGroup title="Task type" values={docTypes} current={type} onChange={(value) => setParam("type", value)} />
        </aside>

        <section className="w-full max-w-[1540px] px-9 pb-20 pt-6 max-[820px]:px-5 max-[820px]:pt-7">
          <section className="mx-auto mb-20 max-w-[820px] text-center max-[820px]:mb-14 max-[820px]:text-left">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">Developer documentation</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-[1.06] tracking-normal text-neutral-100 max-[820px]:text-[33px]">
              Suprema G-SDK
            </h1>
            <p className="mx-auto max-w-[680px] text-[17px] leading-7 text-neutral-400 max-[820px]:mx-0 max-[820px]:text-base">
              gRPC 기반 Gateway를 통해 슈프리마 BioStar 2 장치를 연결하고 운영·관리하는 한국어 개발자 문서입니다.
            </p>
            <label className="mx-auto mt-8 flex min-h-[62px] max-w-[780px] items-center gap-3 rounded-full border border-white/10 bg-neutral-900 px-6 text-neutral-500 max-[820px]:min-h-[56px] max-[820px]:px-5">
              <Search size={21} />
              <Input value={query} onChange={(event) => setSearch(event.target.value)} placeholder="Gateway, 장치 연결, 사용자, 출입통제 검색" className="text-base" />
            </label>
            <div className="mt-4 flex flex-wrap justify-center gap-2 max-[820px]:justify-start">
              <Badge><Server size={14} /> Device Gateway 최대 1,000대</Badge>
              <Badge><Boxes size={14} /> Master Gateway 최대 100,000대</Badge>
              <Badge><Code2 size={14} /> C++ · C# · Java · Python · Go · Node.js</Badge>
              <Badge><Zap size={14} /> 사용자 전송 5~10배 향상</Badge>
            </div>
          </section>

          {featuredDocs.length > 0 ? (
            <section id="featured" className="mb-20">
              <SectionHeader title="Featured" description="G-SDK를 처음 볼 때 가장 먼저 읽기 좋은 문서입니다." />
              <div className="grid grid-cols-3 gap-5 max-[1180px]:grid-cols-2 max-[760px]:grid-cols-1">
                {featuredDocs.map((doc) => (
                  <DocCard key={doc.slug} doc={doc} />
                ))}
              </div>
            </section>
          ) : null}

          <section id="collections" className="mb-20">
            <h2 className="mb-9 text-[28px] font-semibold text-neutral-200">Collections</h2>
            <div className="grid max-w-[1260px] grid-cols-2 gap-x-24 gap-y-12 max-[980px]:grid-cols-1 max-[760px]:gap-y-8">
              {collections.map((collection) => {
                const Icon = iconMap[collection.icon];
                return (
                  <button
                    className="flex items-center gap-6 text-left max-[760px]:gap-4"
                    key={collection.title}
                    onClick={() => applyCollection(collection)}
                    type="button"
                  >
                    <span className={cn("collection-icon", `collection-icon-${collection.accent}`)}>
                      <Icon size={27} />
                    </span>
                    <span>
                      <strong className="mb-1 block text-[20px] font-medium text-neutral-200">{collection.title}</strong>
                      <small className="block text-[17px] leading-7 text-neutral-400 max-[760px]:text-base">{collection.description}</small>
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          <section id="docs">
            <div className="mb-7 flex items-end justify-between gap-6 max-[760px]:items-start">
              <SectionHeader title="All docs" description={`${filteredDocs.length}개 문서`} />
              <div className="flex items-center gap-1 text-sm text-neutral-500">
                <span>Sort:</span>
                <Select value={sort} onValueChange={(value) => setParam("sort", value)}>
                  <SelectTrigger className="w-[126px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem value={option} key={option}>{option}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-x-5 gap-y-11 max-[1380px]:grid-cols-3 max-[1020px]:grid-cols-2 max-[700px]:grid-cols-1">
              {filteredDocs.map((doc) => (
                <DocCard key={doc.slug} doc={doc} />
              ))}
            </div>
            {filteredDocs.length === 0 ? (
              <p className="py-14 text-center text-neutral-500">검색 조건에 맞는 문서가 없습니다.</p>
            ) : null}
          </section>

        </section>
      </div>

      <Button className="fixed bottom-5 right-5 z-50 h-12 px-5 shadow-2xl" type="button">
        Ask AI
      </Button>
    </main>
  );
}

function FilterGroup({
  title,
  values,
  current,
  onChange,
}: {
  title: string;
  values: string[];
  current: string;
  onChange: (value: string) => void;
}) {
  return (
    <section className="mb-7 max-[820px]:mb-3 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2">
      <p className="mb-2 text-sm font-medium text-neutral-500 max-[820px]:mb-0 max-[820px]:mt-1.5 max-[820px]:shrink-0">{title}</p>
      {values.map((value) => (
        <button
          className={cn(
            "flex h-8 w-full items-center justify-between rounded-md px-2 text-left text-[15px] font-normal text-neutral-400 hover:bg-white/8 hover:text-neutral-100 max-[820px]:w-auto max-[820px]:shrink-0 max-[820px]:bg-neutral-950 max-[820px]:px-3",
            current === value && "bg-white/8 text-neutral-100",
          )}
          key={value}
          onClick={() => onChange(value)}
          type="button"
        >
          {value}
          {current === value ? <span className="ml-4">✓</span> : null}
        </button>
      ))}
    </section>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h2 className="mb-2 text-[26px] font-medium text-neutral-200">{title}</h2>
      <p className="text-[17px] text-neutral-400">{description}</p>
    </div>
  );
}

function DocCard({ doc }: { doc: (typeof docs)[number] }) {
  return (
    <Link href={`/reference/${doc.slug}`} className="group block min-w-0">
      <DocThumbnail type={doc.thumbnail} accent={doc.accent} />
      <div className="pt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">{doc.category} · {doc.type} · {doc.time}</p>
        <h3 className="mb-2 text-[19px] font-medium leading-tight text-neutral-200 group-hover:text-white">{doc.title}</h3>
        <p className="min-h-[72px] text-[15px] leading-6 text-neutral-400">{doc.description}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {doc.tags.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </div>
    </Link>
  );
}
