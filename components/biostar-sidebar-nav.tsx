"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type NavEndpoint = { slug: string; name: string; method: string };
export type NavGroup = { slug: string; title: string; endpoints: NavEndpoint[] };

const METHOD_COLOR: Record<string, string> = {
  GET: "text-emerald-400",
  POST: "text-sky-400",
  PUT: "text-amber-400",
  PATCH: "text-violet-400",
  DELETE: "text-rose-400",
};

// 그룹 accordion 사이드바. endpoint가 623개라 전부 펼치면 너무 길어서,
// 활성 endpoint가 속한 그룹만 기본으로 펼치고 나머지는 접습니다.
export function BiostarSidebarNav({
  groups,
  basePath,
  activeSlug,
  label,
}: {
  groups: NavGroup[];
  basePath: string;
  activeSlug?: string;
  label: string;
}) {
  const activeGroup = groups.find((g) => g.endpoints.some((e) => e.slug === activeSlug))?.slug;
  const [open, setOpen] = useState<Record<string, boolean>>(() => (activeGroup ? { [activeGroup]: true } : {}));

  return (
    <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-4 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
      <div className="mb-4 px-2 max-[820px]:hidden">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">{label} API</p>
        <Link href={basePath} className="text-sm text-muted hover:text-text">
          전체 endpoint 색인 →
        </Link>
      </div>
      <nav className="space-y-0.5" aria-label="API 메뉴">
        {groups.map((group) => {
          const isOpen = open[group.slug] ?? false;
          return (
            <div key={group.slug}>
              <button
                type="button"
                onClick={() => setOpen((s) => ({ ...s, [group.slug]: !isOpen }))}
                aria-expanded={isOpen}
                className="flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-left text-[14px] font-medium text-secondary transition-colors hover:bg-hover hover:text-text"
              >
                <ChevronRight size={14} className={cn("shrink-0 text-faint transition-transform", isOpen && "rotate-90")} />
                <span className="min-w-0 flex-1 truncate">{group.title}</span>
                <span className="shrink-0 text-[11px] text-faint">{group.endpoints.length}</span>
              </button>
              {isOpen ? (
                <div className="mb-1 ml-3 border-l border-edge pl-2">
                  {group.endpoints.map((e) => (
                    <Link
                      key={e.slug}
                      href={`${basePath}/${e.slug}`}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] transition-colors",
                        activeSlug === e.slug
                          ? "bg-active font-medium text-text"
                          : "text-muted hover:bg-hover hover:text-text",
                      )}
                    >
                      <span className={cn("shrink-0 font-mono text-[9px] font-semibold", METHOD_COLOR[e.method] ?? "text-faint")}>
                        {e.method}
                      </span>
                      <span className="min-w-0 flex-1 truncate">{e.name}</span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
