import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Code2, Layers2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { ApiDocBody } from "@/components/api-doc";
import { ApiSidebar } from "@/components/api-sidebar";
import { apiItems, getApiDetail, getApiFunctionGroups } from "@/lib/api-reference";
import { getTutorialsForApi } from "@/lib/tutorials";
import { getApiDoc, type ApiDoc } from "@/lib/gsdk-doc";
import { tocId } from "@/lib/toc";
import type { TocItem } from "@/lib/toc";

type ApiDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return apiItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const item = getApiDetail(slug);
  if (!item) return {};

  return {
    title: `${item.name} API | Suprema G-SDK 문서`,
    description: item.summary,
  };
}

function buildToc(apiDoc: ApiDoc | null, hasFunctionContext: boolean, hasFallback: boolean, fallbackGroups?: { title: string }[]): TocItem[] {
  const items: TocItem[] = [{ id: "overview", label: "Overview" }];
  if (hasFunctionContext) items.push({ id: "function-context", label: "기능 맥락" });

  if (apiDoc) {
    let currentSection: TocItem | null = null;
    for (const b of apiDoc.blocks) {
      if (b.kind === "section") {
        // 첫 Overview 섹션은 상단 고정 Overview 항목과 중복되므로 건너뜀
        if (b.anchor === "overview") {
          currentSection = items[0];
          continue;
        }
        currentSection = { id: `s-${b.anchor}`, label: b.title, children: [] };
        items.push(currentSection);
      } else if (b.kind === "subsection" && b.isMethod) {
        const entry: TocItem = { id: b.anchor, label: b.title };
        if (currentSection?.children) currentSection.children.push(entry);
        else items.push(entry);
      }
    }
  } else if (hasFallback && fallbackGroups) {
    items.push({
      id: "method-groups",
      label: "메서드 그룹",
      children: fallbackGroups.map((group) => ({ id: `method-${tocId(group.title)}`, label: group.title })),
    });
    items.push({ id: "notes", label: "정리 기준" });
  }
  return items;
}

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const item = getApiDetail(slug);
  if (!item) notFound();

  const apiDoc = getApiDoc(slug);
  const methodCount = apiDoc
    ? apiDoc.methodNames.length
    : (item.methodGroups?.reduce((sum, group) => sum + group.methods.length, 0) ?? 0);
  const typeCount = apiDoc?.typeNames.length ?? 0;
  const functionGroups = getApiFunctionGroups(item.slug);
  const relatedTutorials = getTutorialsForApi(item.slug);
  const tocItems = buildToc(apiDoc, functionGroups.length > 0, !apiDoc, item.methodGroups);

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="api" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <ApiSidebar activeSlug={item.slug} />

      <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <section className="scroll-mt-24" id="overview">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">{item.group}</p>
        <h1 className="mb-4 text-[42px] font-[560] leading-tight text-text max-[760px]:text-[32px]">{item.name}</h1>
        <p className="mb-7 max-w-3xl text-[18px] leading-8 text-muted">{item.summary}</p>
        <div className="mb-10 flex flex-wrap gap-2">
          <Badge>Actual API</Badge>
          <Badge>{item.group}</Badge>
          <Badge>{item.gateway}</Badge>
          <Badge>{methodCount} methods</Badge>
          {typeCount > 0 ? <Badge>{typeCount} types</Badge> : null}
        </div>
        <div className="mb-10 grid grid-cols-[1.1fr_0.9fr] gap-4 max-[860px]:grid-cols-1">
          <section className="rounded-lg border border-edge bg-surface p-5">
            <div className="mb-4 flex items-center gap-2 text-muted">
              <Layers2 size={16} />
              <p className="text-sm">API scope</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
              <div>
                <dt className="mb-1 text-sm text-faint">Gateway</dt>
                <dd className="text-[17px] font-medium text-secondary">{item.gateway}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm text-faint">Group</dt>
                <dd className="text-[17px] font-medium text-secondary">{item.group}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-lg border border-edge bg-surface p-5">
            <div className="mb-4 flex items-center gap-2 text-muted">
              <BookOpen size={16} />
              <p className="text-sm">관련 예제</p>
            </div>
            {relatedTutorials.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {relatedTutorials.map((tutorial) => (
                  <Link
                    key={tutorial.slug}
                    href={`/examples/${tutorial.slug}`}
                    className="rounded-full border border-edge bg-bg px-3 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:border-edge-strong hover:text-text"
                  >
                    {tutorial.title}
                  </Link>
                ))}
              </div>
            ) : (
              <Link href="/examples" className="text-[15px] font-medium text-secondary hover:text-text">
                Python 예제 전체 보기 →
              </Link>
            )}
          </section>
        </div>
        </section>

        {functionGroups.length > 0 ? (
          <section className="mb-10 scroll-mt-24" id="function-context">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-medium text-secondary">기능 맥락</h2>
              <p className="text-[15px] leading-6 text-muted">이 API가 실제 구현 흐름에서 어느 기능 묶음에 들어가는지 정리합니다.</p>
            </div>
            <div className="grid gap-3">
              {functionGroups.map((group) => {
                const isPrimary = group.primaryApis.includes(item.slug);
                return (
                  <section className="rounded-lg border border-edge bg-surface p-5" key={group.slug}>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="h-6 px-2 text-xs">{isPrimary ? "Primary API" : "Related API"}</Badge>
                      <Badge className="h-6 px-2 text-xs">{group.primaryApis.length} primary</Badge>
                    </div>
                    <h3 className="mb-2 text-[19px] font-medium text-secondary">{group.title}</h3>
                    <p className="mb-4 text-[15px] leading-6 text-muted">{group.whenToUse}</p>
                    <ol className="grid gap-2">
                      {group.flow.map((step, index) => (
                        <li className="flex gap-3 text-sm leading-6 text-muted" key={step}>
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hover text-xs font-medium text-secondary">{index + 1}</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </section>
                );
              })}
            </div>
          </section>
        ) : null}

        {apiDoc ? (
          <section className="scroll-mt-24" id="reference-body">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="mb-2 text-2xl font-medium text-secondary">API 레퍼런스</h2>
                <p className="text-[15px] leading-6 text-muted">메시지, enum, 메서드별 request/response를 G-SDK 공식 정의 기준으로 정리했습니다.</p>
              </div>
              <Code2 className="shrink-0 text-faint" size={21} />
            </div>
            <ApiDocBody doc={apiDoc} />
          </section>
        ) : (
          <>
            <section className="scroll-mt-24" id="method-groups">
              <div className="mb-5 flex items-end justify-between gap-4">
                <div>
                  <h2 className="mb-2 text-2xl font-medium text-secondary">메서드 그룹</h2>
                  <p className="text-[15px] leading-6 text-muted">G-SDK API 목차 기준으로 묶은 실제 메서드 색인입니다.</p>
                </div>
                <Code2 className="shrink-0 text-faint" size={21} />
              </div>
              <div className="grid gap-3">
                {item.methodGroups?.map((methodGroup) => (
                  <section className="scroll-mt-24 rounded-lg border border-edge bg-surface p-5" id={`method-${tocId(methodGroup.title)}`} key={methodGroup.title}>
                    <div className="mb-4 flex items-start justify-between gap-4 max-[640px]:block">
                      <div>
                        <h3 className="mb-2 text-[19px] font-medium text-secondary">{methodGroup.title}</h3>
                        <p className="text-[15px] leading-6 text-muted">{methodGroup.description}</p>
                      </div>
                      <Badge className="mt-1 h-6 px-2 text-xs max-[640px]:mt-3">{methodGroup.methods.length} methods</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {methodGroup.methods.map((method) => (
                        <span className="rounded-full border border-edge bg-bg px-3 py-1.5 text-[13px] font-medium text-secondary" key={method}>
                          {method}
                        </span>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>

            <section className="mt-10 scroll-mt-24 rounded-lg border border-edge bg-surface p-5" id="notes">
              <h2 className="mb-3 text-xl font-medium text-secondary">정리 기준</h2>
              <p className="text-[15px] leading-7 text-muted">
                이 항목은 개념/색인 정의입니다. 메서드별 request/response와 message field는 실제 API 항목 페이지에서 확장됩니다.
              </p>
            </section>
          </>
        )}
      </article>
      <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
