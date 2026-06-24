import type { ReactNode } from "react";
import Link from "next/link";
import { Braces, Database, ShieldCheck } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { biostar2ApiGroups, biostar2Facts, biostarXApiGroups, biostarXFacts } from "@/lib/biostar-reference";

export const metadata = {
  title: "BioStar | Suprema Developer",
  description: "BioStar 2 / BioStar X API와 서버 연동 문서 허브입니다.",
};

export default function BioStarPage() {
  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar</p>
          <h2 className="mb-2 text-[17px] font-medium text-neutral-200">Server API</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-500">BioStar 서버와 REST/JSON으로 통합하는 개발 축입니다.</p>
          <nav className="space-y-1 text-[15px]">
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/2">BioStar 2</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/2/api-reference">BioStar 2 API Reference</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/2/examples">BioStar 2 Examples</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/x">BioStar X</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/x/api-reference">BioStar X API Reference</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/x/examples">BioStar X Examples</Link>
          </nav>
        </aside>

        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">Server REST API</p>
          <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">BioStar</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
            BioStar API는 BioStar 서버의 사용자, 장치, 출입통제, 이벤트 데이터를 외부 시스템과 연결하는 REST/JSON 기반 API 축입니다.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-[920px]:grid-cols-1">
            <Metric label="API style" value="REST / JSON" />
            <Metric label="BioStar 2 domains" value={`${biostar2ApiGroups.length}`} />
            <Metric label="BioStar X domains" value={`${biostarXApiGroups.length}`} />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
            <HubCard href="/biostar/2" icon={<Braces size={18} />} title="BioStar 2" description="BioStar 2.7.10부터 기본 포함되는 New Local API를 REST/JSON 서버 API로 정리합니다." />
            <HubCard href="/biostar/x" icon={<ShieldCheck size={18} />} title="BioStar X" description="BioStar X를 외부 보안 소프트웨어와 맞춤형 출입통제 시스템에 연결하는 REST API 축입니다." />
          </div>

          <section className="mt-14 grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
            <FactPanel title="BioStar 2 핵심 정리" facts={biostar2Facts} />
            <FactPanel title="BioStar X 핵심 정리" facts={biostarXFacts} />
          </section>
        </section>
      </div>
    </main>
  );
}

function FactPanel({ facts, title }: { facts: string[]; title: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <div className="mb-5 flex items-center gap-2 text-neutral-500">
              <Database size={17} />
        <p className="text-sm">{title}</p>
            </div>
      <div className="grid gap-3">
        {facts.map((fact) => (
                <div className="rounded-lg border border-white/8 bg-black p-4 text-[15px] leading-6 text-neutral-300" key={fact}>{fact}</div>
              ))}
            </div>
          </section>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-neutral-950/70 p-4">
      <p className="mb-2 text-sm text-neutral-500">{label}</p>
      <p className="text-3xl font-[540] text-neutral-100">{value}</p>
    </div>
  );
}

function HubCard({
  description,
  href,
  icon,
  title,
}: {
  description: string;
  href: string;
  icon: ReactNode;
  title: string;
}) {
  const className = "block rounded-lg border border-white/10 bg-neutral-950/70 p-5 transition-colors hover:border-white/20 hover:bg-white/[0.03]";
  const content = (
    <>
      <div className="mb-4 flex items-center gap-2 text-neutral-500">{icon}<span className="text-sm">{title}</span></div>
      <p className="text-[17px] font-medium leading-7 text-neutral-200">{description}</p>
    </>
  );
  return <Link className={className} href={href}>{content}</Link>;
}
