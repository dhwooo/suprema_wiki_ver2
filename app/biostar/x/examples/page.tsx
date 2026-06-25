import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { biostarXExamples } from "@/lib/biostar-reference";

export const metadata = {
  title: "BioStar X Examples | Suprema Developer",
  description: "BioStar X API 사용 예제입니다.",
};

export default function BioStarXExamplesPage() {
  const tocItems = [{ id: "overview", label: "Overview" }, ...biostarXExamples.map((example) => ({ id: example.slug, label: example.title }))];

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">BioStar X</p>
          <h2 className="mb-2 text-[17px] font-medium text-secondary">Examples</h2>
          <p className="mb-6 text-sm leading-6 text-muted">외부 보안 소프트웨어와 맞춤형 출입통제 예제입니다.</p>
        </aside>
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">BioStar X Examples</p>
            <h1 className="mb-4 text-[42px] font-[560] leading-tight text-text max-[760px]:text-[32px]">BioStar X 사용 예</h1>
            <p className="max-w-3xl text-[17px] leading-8 text-muted">BioStar X API를 기존 시스템 통합, 맞춤형 출입통제, 원격 사이트 운영 흐름으로 정리합니다.</p>
          </section>
          <div className="mt-12 grid gap-4">
            {biostarXExamples.map((example) => (
              <section className="scroll-mt-24 rounded-lg border border-edge bg-surface/70 p-5" id={example.slug} key={example.slug}>
                <div className="mb-4 flex items-center gap-2 text-muted"><BookOpen size={16} /><p className="text-sm">Example</p></div>
                <h2 className="mb-2 text-[22px] font-medium text-secondary">{example.title}</h2>
                <p className="mb-5 text-[15px] leading-6 text-muted">{example.description}</p>
                <ol className="grid gap-2">
                  {example.steps.map((step, index) => (
                    <li className="rounded-lg border border-edge bg-bg p-4 text-[15px] leading-6 text-secondary" key={step}>
                      <span className="mr-3 text-faint">{String(index + 1).padStart(2, "0")}</span>{step}
                    </li>
                  ))}
                </ol>
                <div className="mt-5 flex flex-wrap gap-2">{example.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>
              </section>
            ))}
          </div>
        </article>
        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
