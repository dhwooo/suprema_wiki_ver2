import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { TutorialBody } from "@/components/tutorial-doc";
import { getTutorial } from "@/lib/gsdk-tutorial";
import { getTutorialMeta, tutorials } from "@/lib/tutorials";
import { getApiItem } from "@/lib/api-reference";
import { cn } from "@/lib/utils";
import type { TocItem } from "@/lib/toc";

type ExampleDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return tutorials.map((tutorial) => ({ slug: tutorial.slug }));
}

export async function generateMetadata({ params }: ExampleDetailPageProps) {
  const { slug } = await params;
  const meta = getTutorialMeta(slug);
  if (!meta) return {};
  return { title: `${meta.title} 예제 | Suprema G-SDK 문서`, description: meta.description };
}

export default async function ExampleDetailPage({ params }: ExampleDetailPageProps) {
  const { slug } = await params;
  const meta = getTutorialMeta(slug);
  const tutorial = getTutorial(slug);
  if (!meta || !tutorial) notFound();

  const relatedApis = meta.apis.map((apiSlug) => getApiItem(apiSlug)).filter((api) => Boolean(api));
  const tocItems: TocItem[] = [
    { id: "overview", label: "개요" },
    ...tutorial.steps.map((step) => ({ id: step.anchor, label: step.num ? `${step.num}. ${step.title}` : step.title })),
  ];

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="examples" />
      <div className="grid grid-cols-[240px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[240px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-6 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-5 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Examples</p>
            <p className="text-sm leading-6 text-muted">Python 단계별 사용 예제</p>
          </div>
          <nav className="space-y-0.5 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2" aria-label="예제 목록">
            {tutorials.map((t) => (
              <Link
                key={t.slug}
                href={`/examples/${t.slug}`}
                className={cn(
                  "block rounded-md px-2 py-1.5 text-[14px] transition-colors max-[820px]:whitespace-nowrap",
                  t.slug === slug ? "bg-active font-medium text-text" : "text-muted hover:bg-hover hover:text-text",
                )}
              >
                {t.title}
              </Link>
            ))}
          </nav>
        </aside>

        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">Python Example</p>
            <h1 className="mb-4 text-[40px] font-[560] leading-tight text-text max-[760px]:text-[30px]">{meta.title}</h1>
            <p className="mb-6 max-w-3xl text-[17px] leading-8 text-muted">{meta.description}</p>
            {relatedApis.length > 0 ? (
              <div className="mb-8">
                <p className="mb-2 text-sm text-muted">관련 API Reference</p>
                <div className="flex flex-wrap gap-2">
                  {relatedApis.map((api) => (
                    <Link
                      key={api!.slug}
                      href={`/api/${api!.slug}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-surface px-3 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:border-edge-strong hover:text-text"
                    >
                      {api!.name}
                      <ArrowUpRight size={13} />
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>

          <TutorialBody tutorial={tutorial} />
        </article>

        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
