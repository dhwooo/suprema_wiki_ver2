import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocThumbnail } from "@/components/doc-thumbnail";
import { SiteHeader } from "@/components/site-header";
import { categories, docs, docTypes, workflows } from "@/lib/docs";

export const metadata = {
  title: "Reference | Suprema G-SDK 문서",
  description: "Suprema G-SDK 사용 예와 구현 가이드 모음입니다.",
};

export default function ReferencePage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="reference" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-7 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Usage Reference</p>
            <h2 className="mb-2 text-[17px] font-medium leading-tight text-secondary">사용 예제</h2>
            <p className="text-sm leading-6 text-muted">API를 조합하는 실제 순서와 운영 맥락을 봅니다.</p>
          </div>
          <RailGroup title="Category" values={categories} />
          <RailGroup title="Workflows" values={workflows} />
          <RailGroup title="Task type" values={docTypes} />
        </aside>

        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <header className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">Usage Reference</p>
          <h1 className="mb-4 text-[40px] font-[560] leading-tight text-text max-[760px]:text-[32px]">G-SDK 사용 예</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-muted">
            실제 API를 어떤 순서와 운영 맥락에서 사용하는지 정리한 Reference입니다. API 상세는 메서드 색인이고, 이 영역은 구현 흐름과 판단 기준을 다룹니다.
          </p>
          <Link
            className="mt-6 inline-flex h-9 items-center gap-2 rounded-full border border-edge bg-surface px-3 text-sm font-medium text-secondary hover:bg-hover hover:text-text"
            href="/api"
          >
            API 색인 보기 <ArrowUpRight size={14} />
          </Link>
        </header>
        <div className="grid grid-cols-4 gap-x-5 gap-y-11 max-[1380px]:grid-cols-3 max-[1020px]:grid-cols-2 max-[700px]:grid-cols-1">
          {docs.map((doc) => (
            <Link href={`/reference/${doc.slug}`} className="group block" key={doc.slug}>
              <DocThumbnail type={doc.thumbnail} accent={doc.accent} />
              <div className="pt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">{doc.category} · {doc.type} · {doc.time}</p>
                <h2 className="mb-2 text-xl font-medium text-secondary group-hover:text-text">{doc.title}</h2>
                <p className="text-[15px] leading-6 text-muted">{doc.description}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {doc.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
        </section>
      </div>
    </main>
  );
}

function RailGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="mb-7 max-[820px]:mb-3 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2">
      <p className="mb-2 text-sm font-medium text-muted max-[820px]:mb-0 max-[820px]:mt-1.5 max-[820px]:shrink-0">{title}</p>
      {values.map((value) => (
        <a
          className="flex h-8 w-full items-center rounded-md px-2 text-left text-[15px] font-normal text-muted hover:bg-hover hover:text-text max-[820px]:w-auto max-[820px]:shrink-0 max-[820px]:bg-surface max-[820px]:px-3"
          href={value === "전체" ? "/reference" : `/?${title === "Category" ? "category" : title === "Workflows" ? "workflow" : "type"}=${encodeURIComponent(value)}`}
          key={value}
        >
          {value}
        </a>
      ))}
    </section>
  );
}
