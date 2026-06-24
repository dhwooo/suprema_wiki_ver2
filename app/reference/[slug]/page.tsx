import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DocThumbnail } from "@/components/doc-thumbnail";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { categories, docs, getDocBySlug, workflows } from "@/lib/docs";
import { tocId } from "@/lib/toc";

type ReferenceDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return docs.map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: ReferenceDetailPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) return {};

  return {
    title: `${doc.title} | Suprema G-SDK Reference`,
    description: doc.description,
  };
}

export default async function ReferenceDetailPage({ params }: ReferenceDetailPageProps) {
  const { slug } = await params;
  const doc = getDocBySlug(slug);
  if (!doc) notFound();

  const tocItems = [
    { id: "overview", label: "Overview" },
    ...doc.sections.map((section) => ({ id: `section-${tocId(section.title)}`, label: section.title })),
    { id: "reference-info", label: "Reference 정보" },
  ];

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="reference" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-7 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">Usage Reference</p>
            <h2 className="mb-2 text-[17px] font-medium leading-tight text-neutral-200">{doc.category}</h2>
            <p className="text-sm leading-6 text-neutral-500">API를 조합하는 실제 순서와 운영 맥락을 봅니다.</p>
          </div>
          <RailGroup title="Category" values={categories} />
          <RailGroup title="Workflows" values={workflows} />
        </aside>

      <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <div className="mb-8">
          <Link className="inline-flex h-9 items-center gap-2 rounded-full border border-white/10 bg-neutral-900 px-3 text-sm font-medium text-neutral-300 hover:bg-white/8 hover:text-white" href="/api">
            API 색인 <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_340px] gap-10 max-[960px]:grid-cols-1">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">
              {doc.category} · {doc.type} · {doc.level}
            </p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">{doc.title}</h1>
            <p className="mb-6 text-[18px] leading-8 text-neutral-400">{doc.description}</p>
            <div className="mb-10 flex flex-wrap gap-2">
              {doc.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <div className="space-y-9">
              {doc.sections.map((section) => (
                <section className="scroll-mt-24" id={`section-${tocId(section.title)}`} key={section.title}>
                  <h2 className="mb-3 text-2xl font-medium text-neutral-200">{section.title}</h2>
                  <p className="text-[17px] leading-8 text-neutral-400">{section.body}</p>
                </section>
              ))}
            </div>
          </section>

          <aside className="max-[860px]:order-first">
            <DocThumbnail type={doc.thumbnail} accent={doc.accent} className="mb-5" />
            <div className="scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950 p-5" id="reference-info">
              <h2 className="mb-4 text-sm font-medium text-neutral-300">Reference 정보</h2>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">플랫폼</dt>
                  <dd className="text-neutral-300">{doc.platform}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">워크플로</dt>
                  <dd className="text-neutral-300">{doc.workflow}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-neutral-500">소요 시간</dt>
                  <dd className="text-neutral-300">{doc.time}</dd>
                </div>
              </dl>
            </div>
          </aside>
        </div>
      </article>
      <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}

function RailGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <section className="mb-7 max-[820px]:mb-3 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2">
      <p className="mb-2 text-sm font-medium text-neutral-500 max-[820px]:mb-0 max-[820px]:mt-1.5 max-[820px]:shrink-0">{title}</p>
      {values.map((value) => (
        <a
          className="flex h-8 w-full items-center rounded-md px-2 text-left text-[15px] font-normal text-neutral-400 hover:bg-white/8 hover:text-neutral-100 max-[820px]:w-auto max-[820px]:shrink-0 max-[820px]:bg-neutral-950 max-[820px]:px-3"
          href={value === "전체" ? "/reference" : `/?${title === "Category" ? "category" : "workflow"}=${encodeURIComponent(value)}`}
          key={value}
        >
          {value}
        </a>
      ))}
    </section>
  );
}
