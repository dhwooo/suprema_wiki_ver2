"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import { CornerDownLeft, Search } from "lucide-react";
import { getSearchEntries, searchEntries, type SearchEntry } from "@/lib/search";
import { cn } from "@/lib/utils";

export function SearchDialog({ showTrigger = true }: { showTrigger?: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);

  const entries = useMemo(() => getSearchEntries(), []);
  const results = useMemo(() => searchEntries(entries, query).slice(0, 24), [entries, query]);

  // cmd+K / ctrl+K 전역 단축키
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onOpenChange = useCallback((next: boolean) => {
    setOpen(next);
    if (next) {
      setQuery("");
      setActive(0);
    }
  }, []);

  const onQueryChange = useCallback((value: string) => {
    setQuery(value);
    setActive(0);
  }, []);

  const go = useCallback(
    (entry: SearchEntry) => {
      setOpen(false);
      router.push(entry.href);
    },
    [router],
  );

  function onInputKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {showTrigger ? (
        <Dialog.Trigger asChild>
          <button
            className="flex h-10 w-[250px] items-center gap-2 rounded-full border border-edge bg-surface px-4 text-muted transition-colors hover:border-edge-strong max-[760px]:w-full"
            type="button"
          >
            <Search size={16} />
            <span className="text-[15px]">문서 검색</span>
            <kbd className="ml-auto hidden rounded border border-edge-strong px-1.5 py-0.5 text-[11px] text-muted sm:inline">⌘K</kbd>
          </button>
        </Dialog.Trigger>
      ) : null}

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/70 backdrop-blur-sm" />
        <Dialog.Content
          className="fixed left-1/2 top-[12vh] z-50 w-[640px] max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-xl border border-edge bg-surface shadow-2xl shadow-black/60"
          onOpenAutoFocus={(e) => {
            // 기본 포커스 대신 input에 포커스
            e.preventDefault();
            (e.currentTarget as HTMLElement).querySelector("input")?.focus();
          }}
        >
          <Dialog.Title className="sr-only">문서 검색</Dialog.Title>
          <Dialog.Description className="sr-only">API, Collection, Reference, BioStar 문서를 검색합니다.</Dialog.Description>

          <div className="flex items-center gap-3 border-b border-edge px-4">
            <Search size={18} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onKeyDown={onInputKeyDown}
              placeholder="API, 메서드, Collection, BioStar 검색…"
              className="h-12 w-full bg-transparent text-[15px] text-text placeholder:text-faint focus:outline-none"
            />
          </div>

          <div ref={listRef} className="max-h-[60vh] overflow-y-auto p-2">
            {query.trim() === "" ? (
              <p className="px-3 py-8 text-center text-sm text-faint">서비스 이름, 메서드(예: Scan), Collection을 검색하세요.</p>
            ) : results.length === 0 ? (
              <p className="px-3 py-8 text-center text-sm text-faint">&ldquo;{query}&rdquo;에 대한 결과가 없습니다.</p>
            ) : (
              results.map((entry, idx) => (
                <button
                  key={`${entry.href}-${idx}`}
                  data-idx={idx}
                  onMouseEnter={() => setActive(idx)}
                  onClick={() => go(entry)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
                    idx === active ? "bg-active" : "hover:bg-hover",
                  )}
                  type="button"
                >
                  <span className="shrink-0 rounded border border-edge bg-bg px-1.5 py-0.5 text-[11px] font-medium text-muted">{entry.group}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-medium text-text">{entry.title}</span>
                    <span className="block truncate text-[12px] text-muted">{entry.subtitle}</span>
                  </span>
                  {idx === active ? <CornerDownLeft size={14} className="shrink-0 text-muted" /> : null}
                </button>
              ))
            )}
          </div>

          <div className="flex items-center gap-4 border-t border-edge px-4 py-2 text-[11px] text-faint">
            <span><kbd className="rounded border border-edge-strong px-1">↑</kbd> <kbd className="rounded border border-edge-strong px-1">↓</kbd> 이동</span>
            <span><kbd className="rounded border border-edge-strong px-1">↵</kbd> 열기</span>
            <span><kbd className="rounded border border-edge-strong px-1">esc</kbd> 닫기</span>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
