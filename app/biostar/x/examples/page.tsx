import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { BiostarExamplesView } from "@/components/biostar-examples-view";
import { getExampleScenarios } from "@/lib/biostar-examples";

export const metadata: Metadata = {
  title: "BioStar X Examples | Suprema Developer",
  description: "BioStar X API를 실제로 호출하는 cURL·JavaScript 코드 예제입니다.",
};

const API_BASE = "/biostar/x/api-reference";

export default function BioStarXExamplesPage() {
  const scenarios = getExampleScenarios("bsx");
  const tocItems = [{ id: "overview", label: "개요" }, ...scenarios.map((s) => ({ id: s.slug, label: s.title }))];

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-6 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">BioStar X</p>
          <h2 className="mb-2 text-[17px] font-medium text-secondary">Examples</h2>
          <p className="mb-6 text-sm leading-6 text-muted">실제 호출 흐름을 코드로 봅니다.</p>
          <nav className="space-y-0.5 text-[14px]">
            {scenarios.map((s) => (
              <a
                key={s.slug}
                href={`#${s.slug}`}
                className="block rounded-md px-2 py-1.5 text-muted transition-colors hover:bg-hover hover:text-text"
              >
                {s.title}
              </a>
            ))}
          </nav>
        </aside>
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">BioStar X Examples</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-text max-[760px]:text-[32px]">BioStar X 코드 예제</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted">
              BioStar X API를 실제로 호출하는 코드입니다. 로그인으로 세션을 발급받아 <code className="rounded bg-active px-1.5 py-0.5 font-mono text-[14px]">bs-session-id</code> 헤더로 전달하고, 주요 리소스를 다루는 흐름을 cURL과 JavaScript(fetch)로 정리했습니다. 각 단계는 API Reference의 해당 endpoint로 연결됩니다.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Badge>cURL</Badge>
              <Badge>JavaScript</Badge>
              <Badge>{scenarios.length} scenarios</Badge>
            </div>
          </section>
          <BiostarExamplesView scenarios={scenarios} apiBasePath={API_BASE} />
        </article>
        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
