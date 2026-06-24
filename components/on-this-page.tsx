"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Copy, FileDown } from "lucide-react";
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

    const tick = () => {
      if (window.scrollY !== lastScrollY) {
        lastScrollY = window.scrollY;
        updateActiveId();
      }
      frame = requestAnimationFrame(tick);
    };

    updateActiveId();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", updateActiveId);

    return () => {
      cancelAnimationFrame(frame);
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
        <span className="absolute bottom-0 left-0 top-0 w-px bg-white/18" aria-hidden="true" />
        <span
          className="absolute left-0 w-[3px] rounded-full bg-white transition-[transform,height,opacity] duration-300 ease-out"
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
                  isActive ? "font-medium text-neutral-100" : "text-neutral-500 hover:text-neutral-200",
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

      <div className="mt-8 inline-flex h-12 overflow-hidden rounded-[18px] border border-white/30 bg-neutral-900/80 text-[15px] font-medium text-neutral-100 shadow-2xl shadow-black/40">
        <button className="inline-flex items-center gap-2 px-4 transition-colors hover:bg-white/8" onClick={copyPage} type="button">
          <Copy size={19} />
          {copied ? "Copied" : "Copy page"}
        </button>
        <button className="inline-flex items-center gap-2 border-l border-white/25 px-4 transition-colors hover:bg-white/8" onClick={exportPdf} type="button">
          <FileDown size={18} />
          Export as PDF
        </button>
      </div>
    </aside>
  );
}
