import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { BiostarSidebar } from "@/components/biostar-sidebar";
import { BiostarIndexBody } from "@/components/biostar-doc";
import { getBiostarApi } from "@/lib/biostar-doc";

export const metadata: Metadata = {
  title: "BioStar 2 API Reference | Suprema Developer",
  description: "BioStar 2 REST/JSON API의 전체 endpoint를 그룹별로 정리한 레퍼런스입니다.",
};

const BASE_PATH = "/biostar/2/api-reference";

export default function BioStar2ApiReferencePage() {
  const api = getBiostarApi("bs2");
  const total = api.groups.reduce((sum, g) => sum + g.endpoints.length, 0);
  const tocItems = api.groups.map((g) => ({ id: g.slug, label: g.title }));

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <BiostarSidebar product="bs2" basePath={BASE_PATH} />
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">BioStar 2 API Reference</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-text max-[760px]:text-[32px]">BioStar 2 API</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted">
              BioStar 2 AC 서버에 포함된 REST/JSON API입니다. 로그인 후 <code className="rounded bg-active px-1.5 py-0.5 font-mono text-[14px]">bs-session-id</code> 세션 헤더를 보존하고, 사용자·장치·출입통제·이벤트 리소스를 호출합니다. 아래는 공식 Postman collection 기준 전체 endpoint입니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge>REST / JSON</Badge>
              <Badge>BioStar 2.7.10+</Badge>
              <Badge>bs-session-id</Badge>
              <Badge>{api.groups.length} groups</Badge>
              <Badge>{total} endpoints</Badge>
            </div>
          </section>
          <BiostarIndexBody api={api} basePath={BASE_PATH} />
        </article>
        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
