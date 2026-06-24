import Link from "next/link";
import { ArrowRight, BookOpen, Code2, GitBranch, Layers2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { apiFunctionGroups, apiGroups, getApiDetail } from "@/lib/api-reference";

export const metadata = {
  title: "API | Suprema G-SDK 문서",
  description: "Suprema G-SDK 실제 API 그룹과 서비스 목록입니다.",
};

export default function ApiPage() {
  const totalApis = apiGroups.reduce((sum, group) => sum + group.items.length, 0);
  const totalMethods = apiGroups.reduce(
    (sum, group) =>
      sum +
      group.items.reduce((itemSum, item) => {
        const detail = getApiDetail(item.slug);
        return itemSum + (detail?.methodGroups?.reduce((methodSum, methodGroup) => methodSum + methodGroup.methods.length, 0) ?? 0);
      }, 0),
    0,
  );

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="api" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <div className="mb-7 max-[820px]:hidden">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">Functional API</p>
            <h2 className="mb-2 text-[17px] font-medium leading-tight text-neutral-200">기능별 G-SDK API</h2>
            <p className="text-sm leading-6 text-neutral-500">목적에 맞는 API 묶음부터 고르고, 세부 서비스로 내려갑니다.</p>
          </div>
          <nav className="space-y-1 max-[820px]:flex max-[820px]:gap-2 max-[820px]:overflow-x-auto max-[820px]:pb-2" aria-label="기능별 API">
            {apiFunctionGroups.map((group) => (
              <a
                className="flex h-8 items-center justify-between rounded-md px-2 text-[15px] text-neutral-400 hover:bg-white/8 hover:text-neutral-100 max-[820px]:shrink-0 max-[820px]:bg-neutral-950 max-[820px]:px-3"
                href={`#feature-${group.slug}`}
                key={group.slug}
              >
                {group.title}
                <span className="ml-4 text-xs text-neutral-600">{group.primaryApis.length}</span>
              </a>
            ))}
          </nav>
        </aside>

        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <header className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">Functional G-SDK API</p>
          <h1 className="mb-4 text-[40px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">G-SDK API</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
            G-SDK API를 기능별 작업 흐름으로 먼저 정리했습니다. 장치 연결, 사용자/인증, 출입정책, 이벤트, 설정, Zone 같은 목적에서 시작한 뒤 실제 서비스와 메서드 색인으로 내려갑니다.
          </p>
        </header>

        <div className="mb-12 grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
          <div className="rounded-lg border border-white/10 bg-neutral-950/70 p-4">
            <p className="mb-2 text-sm text-neutral-500">Function groups</p>
            <p className="text-3xl font-[540] text-neutral-100">{apiFunctionGroups.length}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-neutral-950/70 p-4">
            <p className="mb-2 text-sm text-neutral-500">API services</p>
            <p className="text-3xl font-[540] text-neutral-100">{totalApis}</p>
          </div>
          <div className="rounded-lg border border-white/10 bg-neutral-950/70 p-4">
            <p className="mb-2 text-sm text-neutral-500">Indexed methods</p>
            <p className="text-3xl font-[540] text-neutral-100">{totalMethods}</p>
          </div>
        </div>

        <section className="mb-14">
          <div className="mb-6 flex items-end justify-between gap-4 max-[720px]:block">
            <div>
              <h2 className="mb-2 text-2xl font-medium text-neutral-200">기능별 API 맵</h2>
              <p className="max-w-3xl text-[15px] leading-6 text-neutral-500">
                구현 목적별로 자주 함께 쓰이는 API를 묶었습니다. 각 카드의 순서는 실제 개발 흐름에 가깝게 배치했습니다.
              </p>
            </div>
            <Link className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-neutral-300 hover:text-white" href="/reference">
              <BookOpen size={15} />
              사용 예 보기
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4 max-[1080px]:grid-cols-1">
            {apiFunctionGroups.map((group) => (
              <ApiFunctionCard groupSlug={group.slug} key={group.slug} />
            ))}
          </div>
        </section>

        <section id="service-groups" className="scroll-mt-24">
          <div className="mb-6">
            <h2 className="mb-2 text-2xl font-medium text-neutral-200">서비스 그룹별 전체 색인</h2>
            <p className="max-w-3xl text-[15px] leading-6 text-neutral-500">
              기능 맵에서 목적을 고른 뒤, 아래 색인에서 각 gRPC service와 메서드 그룹을 세부적으로 확인합니다.
            </p>
          </div>
        <div className="grid gap-5">
          {apiGroups.map((group) => (
            <section className="scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id={group.slug} key={group.slug}>
              <div className="mb-5 flex items-start justify-between gap-5 max-[700px]:block">
                <div>
                  <h2 className="mb-2 text-2xl font-medium text-neutral-200">{group.title}</h2>
                  <p className="text-[15px] leading-6 text-neutral-500">{group.description}</p>
                </div>
                <Badge className="mt-1 max-[700px]:mt-3">{group.items.length} APIs</Badge>
              </div>
              <div className="grid grid-cols-3 gap-3 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
                {group.items.map((item) => (
                  <ApiCard itemSlug={item.slug} key={item.slug} />
                ))}
              </div>
            </section>
          ))}
        </div>
        </section>
        </section>
      </div>
    </main>
  );
}

function ApiFunctionCard({ groupSlug }: { groupSlug: string }) {
  const group = apiFunctionGroups.find((item) => item.slug === groupSlug);
  if (!group) return null;

  const primaryApis = group.primaryApis.map((slug) => getApiDetail(slug)).filter((item) => Boolean(item));
  const relatedApis = group.relatedApis.map((slug) => getApiDetail(slug)).filter((item) => Boolean(item));
  const methodCount = [...primaryApis, ...relatedApis].reduce(
    (sum, item) => sum + (item?.methodGroups?.reduce((methodSum, methodGroup) => methodSum + methodGroup.methods.length, 0) ?? 0),
    0,
  );
  const firstApi = primaryApis[0];

  return (
    <section className="scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id={`feature-${group.slug}`}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-neutral-500">
            <Layers2 size={15} />
            <span>{primaryApis.length} primary APIs</span>
            <span className="text-neutral-700">/</span>
            <span>{methodCount} indexed methods</span>
          </div>
          <h3 className="mb-2 text-[21px] font-medium leading-tight text-neutral-100">{group.title}</h3>
          <p className="text-[15px] leading-6 text-neutral-500">{group.summary}</p>
        </div>
        {firstApi ? (
          <Link className="shrink-0 rounded-full border border-white/10 p-2 text-neutral-400 transition-colors hover:border-white/20 hover:text-white" href={`/api/${firstApi.slug}`} aria-label={`${firstApi.name} API로 이동`}>
            <ArrowRight size={17} />
          </Link>
        ) : null}
      </div>

      <div className="mb-5 rounded-md border border-white/8 bg-black p-4">
        <p className="mb-2 text-sm font-medium text-neutral-300">언제 쓰나</p>
        <p className="text-sm leading-6 text-neutral-500">{group.whenToUse}</p>
      </div>

      <div className="mb-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-neutral-300">
          <GitBranch size={15} />
          구현 흐름
        </div>
        <ol className="grid gap-2">
          {group.flow.map((step, index) => (
            <li className="flex gap-3 text-sm leading-6 text-neutral-500" key={step}>
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/8 text-xs font-medium text-neutral-300">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="mb-4">
        <p className="mb-2 text-sm font-medium text-neutral-300">중심 API</p>
        <div className="flex flex-wrap gap-2">
          {primaryApis.map((api) => (
            <Link className="rounded-full border border-white/10 bg-black px-3 py-1.5 text-[13px] font-medium text-neutral-300 transition-colors hover:border-white/20 hover:text-white" href={`/api/${api?.slug}`} key={api?.slug}>
              {api?.name}
            </Link>
          ))}
        </div>
      </div>

      {relatedApis.length > 0 ? (
        <div>
          <p className="mb-2 text-sm font-medium text-neutral-300">함께 확인할 API</p>
          <div className="flex flex-wrap gap-2">
            {relatedApis.map((api) => (
              <Link className="rounded-full bg-white/6 px-3 py-1.5 text-[13px] font-medium text-neutral-500 transition-colors hover:bg-white/10 hover:text-neutral-200" href={`/api/${api?.slug}`} key={api?.slug}>
                {api?.name}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ApiCard({ itemSlug }: { itemSlug: string }) {
  const item = getApiDetail(itemSlug);
  if (!item) return null;

  const methodCount = item.methodGroups?.reduce((sum, group) => sum + group.methods.length, 0) ?? 0;

  return (
    <Link
      className="rounded-lg border border-white/8 bg-black p-4 transition-colors hover:border-white/20 hover:bg-white/[0.03]"
      href={`/api/${item.slug}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[17px] font-medium text-neutral-200">{item.name}</p>
        <Code2 className="mt-0.5 shrink-0 text-neutral-600" size={16} />
      </div>
      <p className="mb-4 text-sm leading-6 text-neutral-500">{item.summary}</p>
      <div className="flex flex-wrap gap-2">
        <Badge className="h-6 px-2 text-xs">{item.gateway}</Badge>
        <Badge className="h-6 px-2 text-xs">{methodCount} methods</Badge>
      </div>
    </Link>
  );
}
