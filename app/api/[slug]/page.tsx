import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen, Code2, Layers2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { apiGroups, apiItems, getApiDetail, getApiFunctionGroups } from "@/lib/api-reference";
import { tocId } from "@/lib/toc";

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

export default async function ApiDetailPage({ params }: ApiDetailPageProps) {
  const { slug } = await params;
  const item = getApiDetail(slug);
  if (!item) notFound();

  const methodCount = item.methodGroups?.reduce((sum, group) => sum + group.methods.length, 0) ?? 0;
  const functionGroups = getApiFunctionGroups(item.slug);
  const tocItems = [
    { id: "overview", label: "Overview" },
    ...(functionGroups.length > 0 ? [{ id: "function-context", label: "기능 맥락" }] : []),
    { id: "method-groups", label: "메서드 그룹", children: item.methodGroups?.map((group) => ({ id: `method-${tocId(group.title)}`, label: group.title })) },
    { id: "notes", label: "정리 기준" },
  ];

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="api" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-7 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">Actual API</p>
            <h2 className="mb-2 text-[17px] font-medium leading-tight text-neutral-200">{item.group}</h2>
            <p className="text-sm leading-6 text-neutral-500">정리된 API 그룹과 메서드 목차를 빠르게 훑습니다.</p>
          </div>
          <nav className="space-y-1 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2" aria-label="API 그룹">
            {apiGroups.map((group) => (
              <Link
                className="flex h-8 items-center justify-between rounded-md px-2 text-[15px] text-neutral-400 hover:bg-white/8 hover:text-neutral-100 max-[820px]:shrink-0 max-[820px]:bg-neutral-950 max-[820px]:px-3"
                href={`/api#${group.slug}`}
                key={group.slug}
              >
                {group.title}
                <span className="ml-4 text-xs text-neutral-600">{group.items.length}</span>
              </Link>
            ))}
          </nav>
        </aside>

      <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <section className="scroll-mt-24" id="overview">
        <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">{item.group}</p>
        <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">{item.name}</h1>
        <p className="mb-7 max-w-3xl text-[18px] leading-8 text-neutral-400">{item.summary}</p>
        <div className="mb-10 flex flex-wrap gap-2">
          <Badge>Actual API</Badge>
          <Badge>{item.group}</Badge>
          <Badge>{item.gateway}</Badge>
          <Badge>{methodCount} methods</Badge>
        </div>
        <div className="mb-10 grid grid-cols-[1.1fr_0.9fr] gap-4 max-[860px]:grid-cols-1">
          <section className="rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <div className="mb-4 flex items-center gap-2 text-neutral-500">
              <Layers2 size={16} />
              <p className="text-sm">API scope</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
              <div>
                <dt className="mb-1 text-sm text-neutral-600">Gateway</dt>
                <dd className="text-[17px] font-medium text-neutral-200">{item.gateway}</dd>
              </div>
              <div>
                <dt className="mb-1 text-sm text-neutral-600">Group</dt>
                <dd className="text-[17px] font-medium text-neutral-200">{item.group}</dd>
              </div>
            </dl>
          </section>
          <Link
            href="/reference"
            className="group rounded-lg border border-white/10 bg-neutral-950/70 p-5 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
          >
            <div className="mb-4 flex items-center gap-2 text-neutral-500">
              <BookOpen size={16} />
              <p className="text-sm">Usage Reference</p>
            </div>
            <p className="text-[17px] font-medium text-neutral-200 group-hover:text-white">이 API를 언제 어떤 순서로 쓰는지는 Reference 사용 예에서 확인합니다.</p>
          </Link>
        </div>
        </section>

        {functionGroups.length > 0 ? (
          <section className="mb-10 scroll-mt-24" id="function-context">
            <div className="mb-5">
              <h2 className="mb-2 text-2xl font-medium text-neutral-200">기능 맥락</h2>
              <p className="text-[15px] leading-6 text-neutral-500">이 API가 실제 구현 흐름에서 어느 기능 묶음에 들어가는지 정리합니다.</p>
            </div>
            <div className="grid gap-3">
              {functionGroups.map((group) => {
                const isPrimary = group.primaryApis.includes(item.slug);
                return (
                  <section className="rounded-lg border border-white/10 bg-neutral-950/70 p-5" key={group.slug}>
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <Badge className="h-6 px-2 text-xs">{isPrimary ? "Primary API" : "Related API"}</Badge>
                      <Badge className="h-6 px-2 text-xs">{group.primaryApis.length} primary</Badge>
                    </div>
                    <h3 className="mb-2 text-[19px] font-medium text-neutral-200">{group.title}</h3>
                    <p className="mb-4 text-[15px] leading-6 text-neutral-500">{group.whenToUse}</p>
                    <ol className="grid gap-2">
                      {group.flow.map((step, index) => (
                        <li className="flex gap-3 text-sm leading-6 text-neutral-500" key={step}>
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-medium text-neutral-300">{index + 1}</span>
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

        <section className="scroll-mt-24" id="method-groups">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-neutral-200">메서드 그룹</h2>
              <p className="text-[15px] leading-6 text-neutral-500">G-SDK API 목차 기준으로 묶은 실제 메서드 색인입니다.</p>
            </div>
            <Code2 className="shrink-0 text-neutral-700" size={21} />
          </div>
          <div className="grid gap-3">
            {item.methodGroups?.map((methodGroup) => (
              <section className="scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id={`method-${tocId(methodGroup.title)}`} key={methodGroup.title}>
                <div className="mb-4 flex items-start justify-between gap-4 max-[640px]:block">
                  <div>
                    <h3 className="mb-2 text-[19px] font-medium text-neutral-200">{methodGroup.title}</h3>
                    <p className="text-[15px] leading-6 text-neutral-500">{methodGroup.description}</p>
                  </div>
                  <Badge className="mt-1 h-6 px-2 text-xs max-[640px]:mt-3">{methodGroup.methods.length} methods</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {methodGroup.methods.map((method) => (
                    <span
                      className="rounded-full border border-white/10 bg-black px-3 py-1.5 text-[13px] font-medium text-neutral-300"
                      key={method}
                    >
                      {method}
                    </span>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        <section className="mt-10 scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id="notes">
          <h2 className="mb-3 text-xl font-medium text-neutral-200">정리 기준</h2>
          <p className="text-[15px] leading-7 text-neutral-500">
            이 페이지는 G-SDK API 항목을 한국어 개발자 문서로 옮긴 내부 색인입니다. request, response, message field, generated client 세부 사항은 이후 각 메서드별 섹션으로 확장합니다.
          </p>
        </section>
      </article>
      <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
