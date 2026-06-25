"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, Copy, FileDown } from "lucide-react";
import type { TocItem } from "@/lib/toc";
import { cn } from "@/lib/utils";

type FlatTocItem = {
  id: string;
  label: string;
  depth: number;
};

function flattenItems(items: TocItem[], depth = 0): FlatTocItem[] {
  return items.flatMap((item) => [
    { id: item.id, label: item.label, depth },
    ...(item.children ? flattenItems(item.children, depth + 1) : []),
  ]);
}

export function OnThisPage({ items }: { items: TocItem[] }) {
  const flatItems = useMemo(() => flattenItems(items), [items]);
  const [activeId, setActiveId] = useState(flatItems[0]?.id ?? "");
  const [copied, setCopied] = useState(false);
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [indicator, setIndicator] = useState({ height: 0, top: 0, visible: false });

  useEffect(() => {
    if (flatItems.length === 0) return;

    let frame = 0;
    let lastScrollY = -1;
    const updateActiveId = () => {
      const offset = 130;
      const current = flatItems.reduce((active, item) => {
        const section = document.getElementById(item.id);
        if (!section) return active;
        const top = section.getBoundingClientRect().top;
        return top <= offset ? item.id : active;
      }, flatItems[0].id);
      setActiveId((previous) => (previous === current ? previous : current));
    };

    let ticking = false;
    const onScroll = () => {
      if (window.scrollY === lastScrollY) return;
      lastScrollY = window.scrollY;
      if (ticking) return;
      ticking = true;
      frame = requestAnimationFrame(() => {
        updateActiveId();
        ticking = false;
      });
    };

    updateActiveId();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateActiveId);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateActiveId);
    };
  }, [flatItems]);

  useEffect(() => {
    const activeLink = linkRefs.current[activeId];
    if (!activeLink) return;
    setIndicator({
      height: activeLink.offsetHeight,
      top: activeLink.offsetTop,
      visible: true,
    });
  }, [activeId]);

  async function copyPage() {
    const text = `${document.title}\n${window.location.href}`;
    await navigator.clipboard?.writeText(text);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  function exportPdf() {
    window.print();
  }

  if (flatItems.length === 0) return null;

  return (
    <aside className="sticky top-[98px] h-[calc(100vh-98px)] overflow-auto px-7 py-8 max-[1180px]:hidden">
      <p className="sr-only">On this page</p>
      <nav className="relative pl-6" aria-label="현재 페이지 목차">
        <span className="absolute bottom-0 left-0 top-0 w-px bg-active" aria-hidden="true" />
        <span
          className="absolute left-0 w-[3px] rounded-full bg-text transition-[transform,height,opacity] duration-300 ease-out"
          aria-hidden="true"
          style={{
            height: indicator.height,
            opacity: indicator.visible ? 1 : 0,
            transform: `translateY(${indicator.top}px)`,
          }}
        />
        <div className="space-y-1">
          {flatItems.map((item) => {
            const isActive = item.id === activeId;
            return (
              <a
                aria-current={isActive ? "true" : undefined}
                className={cn(
                  "block py-1.5 transition-colors duration-200",
                  item.depth === 0 ? "text-[15px]" : "text-[13px]",
                  item.depth > 0 && "pl-3",
                  isActive ? "font-medium text-text" : "text-muted hover:text-secondary",
                )}
                href={`#${item.id}`}
                key={`${item.depth}-${item.id}`}
                ref={(node) => {
                  linkRefs.current[item.id] = node;
                }}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      <div className="mt-7 flex flex-col gap-0.5 border-t border-edge pt-4">
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted transition-colors hover:bg-hover hover:text-secondary" onClick={copyPage} type="button">
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "링크 복사됨" : "페이지 링크 복사"}
        </button>
        <button className="flex items-center gap-2 rounded-md px-2 py-1.5 text-[13px] text-muted transition-colors hover:bg-hover hover:text-secondary" onClick={exportPdf} type="button">
          <FileDown size={14} />
          PDF로 내보내기
        </button>
      </div>
    </aside>
  );
}
