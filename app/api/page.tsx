import Link from "next/link";
import { BookOpen, Code2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { ApiSidebar } from "@/components/api-sidebar";
import { ApiCollectionsGrid, collectionIconMap } from "@/components/api-collections";
import { apiBasics, apiCollections, getApiDetail, getApiItem, getCollectionApis } from "@/lib/api-reference";

export const metadata = {
  title: "API | Suprema G-SDK 문서",
  description: "Suprema G-SDK 실제 API를 기능 묶음별로 정리한 색인입니다.",
};

export default function ApiPage() {
  const totalApis = apiCollections.reduce((sum, c) => sum + c.apis.length, 0);
  const basics = apiBasics.map((slug) => getApiItem(slug)).filter((item) => Boolean(item));

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="api" />
      <div className="grid grid-cols-[260px_minmax(0,1fr)] max-[820px]:block">
        <ApiSidebar />

        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
          <header className="mb-10">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">G-SDK API</p>
            <h1 className="mb-4 text-[40px] font-[560] leading-tight text-text max-[760px]:text-[32px]">G-SDK API</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted">
              gRPC 기반 G-SDK API를 실제 작업 흐름에 맞춰 8개 묶음으로 정리했습니다. 목적에 맞는 Collection을 고르고 각 서비스의 메서드·메시지·enum 레퍼런스로 내려갑니다.
            </p>
          </header>

          <div className="mb-12 grid grid-cols-3 gap-3 max-[860px]:grid-cols-1">
            <Stat label="Collections" value={apiCollections.length} />
            <Stat label="API services" value={totalApis} />
            <Stat label="기초 개념" value={basics.length} />
          </div>

          <section className="mb-14">
            <div className="mb-6 flex items-end justify-between gap-4 max-[720px]:block">
              <div>
                <h2 className="mb-2 text-2xl font-medium text-secondary">Collections</h2>
                <p className="max-w-3xl text-[15px] leading-6 text-muted">목적별로 자주 함께 쓰이는 API 묶음입니다. 카드를 누르면 해당 묶음의 전체 색인으로 이동합니다.</p>
              </div>
              <Link className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-secondary hover:text-text" href="/examples">
                <BookOpen size={15} />
                예제 보기
              </Link>
            </div>
            <ApiCollectionsGrid />
          </section>

          <section id="service-index" className="scroll-mt-24">
            <div className="mb-6">
              <h2 className="mb-2 text-2xl font-medium text-secondary">전체 색인</h2>
              <p className="max-w-3xl text-[15px] leading-6 text-muted">Collection별로 실제 G-SDK 서비스와 진입점을 확인합니다.</p>
            </div>

            <div className="space-y-10">
              {apiCollections.map((collection) => {
                const Icon = collectionIconMap[collection.icon];
                const apis = getCollectionApis(collection);
                return (
                  <section className="scroll-mt-24" id={`coll-${collection.slug}`} key={collection.slug}>
                    <div className="mb-4 flex items-center gap-3">
                      <span className={`coll-icon collection-icon-${collection.accent}`}>
                        <Icon size={20} />
                      </span>
                      <div>
                        <h3 className="text-[19px] font-medium text-secondary">{collection.title}</h3>
                        <p className="text-sm text-muted">{collection.description}</p>
                      </div>
                      <Badge className="ml-auto h-6 px-2 text-xs">{apis.length} APIs</Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
                      {apis.map((item) => (
                        <ApiCard key={item.slug} itemSlug={item.slug} />
                      ))}
                    </div>
                  </section>
                );
              })}

              {basics.length > 0 ? (
                <section className="scroll-mt-24" id="basics">
                  <div className="mb-4">
                    <h3 className="text-[19px] font-medium text-secondary">기초 개념</h3>
                    <p className="text-sm text-muted">모든 API에 공통으로 적용되는 gRPC·Gateway 모델·Multi command 개념입니다.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 max-[1000px]:grid-cols-2 max-[640px]:grid-cols-1">
                    {basics.map((item) => (
                      <ApiCard key={item!.slug} itemSlug={item!.slug} />
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-edge bg-surface p-4">
      <p className="mb-2 text-sm text-muted">{label}</p>
      <p className="text-3xl font-[540] text-text">{value}</p>
    </div>
  );
}

function ApiCard({ itemSlug }: { itemSlug: string }) {
  const item = getApiDetail(itemSlug);
  if (!item) return null;
  const methodCount = item.methodGroups?.reduce((sum, group) => sum + group.methods.length, 0) ?? 0;

  return (
    <Link
      className="rounded-lg border border-edge bg-bg p-4 transition-colors hover:border-edge-strong hover:bg-hover"
      href={`/api/${item.slug}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p className="text-[17px] font-medium text-secondary">{item.name}</p>
        <Code2 className="mt-0.5 shrink-0 text-faint" size={16} />
      </div>
      <p className="mb-4 text-sm leading-6 text-muted">{item.summary}</p>
      <div className="flex flex-wrap gap-2">
        <Badge className="h-6 px-2 text-xs">{item.gateway}</Badge>
        <Badge className="h-6 px-2 text-xs">{methodCount} methods</Badge>
      </div>
    </Link>
  );
}
