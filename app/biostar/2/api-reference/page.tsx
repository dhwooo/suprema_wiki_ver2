import { Braces } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { biostar2ApiGroups } from "@/lib/biostar-reference";

export const metadata = {
  title: "BioStar 2 API Reference | Suprema Developer",
  description: "BioStar 2 New Local API 영역과 REST 리소스 색인입니다.",
};

export default function BioStar2ApiReferencePage() {
  const tocItems = [{ id: "overview", label: "Overview" }, ...biostar2ApiGroups.map((group) => ({ id: group.slug, label: group.title })), { id: "notes", label: "정리 기준" }];

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar 2</p>
          <h2 className="mb-2 text-[17px] font-medium text-neutral-200">API Reference</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-500">New Local API의 REST/JSON 리소스 색인입니다.</p>
          <nav className="space-y-1 text-[15px]">
            {biostar2ApiGroups.map((group) => (
              <a className="flex h-8 items-center justify-between rounded-md px-2 text-neutral-400 hover:bg-white/8 hover:text-neutral-100" href={`#${group.slug}`} key={group.slug}>
                {group.title}
                <span className="ml-4 text-xs text-neutral-600">{group.endpoints.length}</span>
              </a>
            ))}
          </nav>
        </aside>
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar 2 API Reference</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">BioStar 2 API</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
              BioStar 2 API는 BioStar 2 AC 서버에 포함된 REST/JSON API입니다. 로그인 후 세션 헤더를 보존하고, 사용자·장치·출입통제·이벤트 리소스를 호출합니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge>REST / JSON</Badge>
              <Badge>BioStar 2.7.10+</Badge>
              <Badge>bs-session-id</Badge>
              <Badge>{biostar2ApiGroups.length} domains</Badge>
            </div>
          </section>
          <section className="mt-12 grid gap-3">
            {biostar2ApiGroups.map((group) => (
              <section className="scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id={group.slug} key={group.slug}>
                <div className="mb-4 flex items-start justify-between gap-4 max-[640px]:block">
                  <div>
                    <div className="mb-3 flex items-center gap-2 text-neutral-500"><Braces size={16} /><p className="text-sm">{group.protocol}</p></div>
                    <h2 className="mb-2 text-[21px] font-medium text-neutral-200">{group.title}</h2>
                    <p className="text-[15px] leading-6 text-neutral-500">{group.description}</p>
                  </div>
                  <Badge className="mt-1 h-6 px-2 text-xs max-[640px]:mt-3">{group.endpoints.length} items</Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.endpoints.map((endpoint) => (
                    <span className="rounded-full border border-white/10 bg-black px-3 py-1.5 text-[13px] font-medium text-neutral-300" key={endpoint}>{endpoint}</span>
                  ))}
                </div>
              </section>
            ))}
          </section>
          <section className="mt-10 scroll-mt-24 rounded-lg border border-white/10 bg-neutral-950/70 p-5" id="notes">
            <h2 className="mb-3 text-xl font-medium text-neutral-200">정리 기준</h2>
            <p className="text-[15px] leading-7 text-neutral-500">이 페이지는 BioStar 2 API 문서의 핵심 내용을 한국어로 재구성한 내부 색인입니다. 실제 구현에서는 로그인 세션, 권한, 오류 응답, pagination 정책을 함께 설계합니다.</p>
          </section>
        </article>
        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
