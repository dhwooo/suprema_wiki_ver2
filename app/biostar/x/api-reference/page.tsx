import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { BiostarSidebar } from "@/components/biostar-sidebar";
import { BiostarIndexBody } from "@/components/biostar-doc";
import { getBiostarApi } from "@/lib/biostar-doc";

export const metadata: Metadata = {
  title: "BioStar X API Reference | Suprema Developer",
  description: "BioStar X REST/JSON API의 전체 endpoint를 그룹별로 정리한 레퍼런스입니다.",
};

const BASE_PATH = "/biostar/x/api-reference";

export default function BioStarXApiReferencePage() {
  const api = getBiostarApi("bsx");
  const total = api.groups.reduce((sum, g) => sum + g.endpoints.length, 0);
  const tocItems = api.groups.map((g) => ({ id: g.slug, label: g.title }));

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <BiostarSidebar product="bsx" basePath={BASE_PATH} />
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">BioStar X API Reference</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-text max-[760px]:text-[32px]">BioStar X API</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted">
              BioStar X를 외부 소프트웨어와 통합하기 위한 REST/JSON API입니다. 장치·단말·사용자·바이오인식·출입통제 리소스를 다루며, 아래는 공식 Postman collection 기준 전체 endpoint입니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge>REST / JSON</Badge>
              <Badge>BioStar X</Badge>
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
