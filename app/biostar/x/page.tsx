import Link from "next/link";
import { BookOpen, Braces } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { biostarXApiGroups, biostarXFacts } from "@/lib/biostar-reference";

export const metadata = {
  title: "BioStar X | Suprema Developer",
  description: "BioStar X API 문서 허브입니다.",
};

export default function BioStarXPage() {
  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar X</p>
          <h2 className="mb-2 text-[17px] font-medium text-neutral-200">REST API</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-500">BioStar X를 외부 소프트웨어와 통합하는 API 축입니다.</p>
          <nav className="space-y-1 text-[15px]">
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/x/api-reference">API Reference</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/x/examples">Examples</Link>
          </nav>
        </aside>
        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar X API</p>
          <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">BioStar X</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
            BioStar X API는 장치, 단말, 사용자, 바이오인식 제어를 위한 REST/JSON API이며 외부 보안 소프트웨어나 맞춤형 출입통제 시스템과 통합하는 데 사용합니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-[820px]:grid-cols-1">
            <Link className="rounded-lg border border-white/10 bg-neutral-950/70 p-5 hover:bg-white/[0.03]" href="/biostar/x/api-reference">
              <div className="mb-4 flex items-center gap-2 text-neutral-500"><Braces size={18} /><span className="text-sm">API Reference</span></div>
              <p className="text-[17px] font-medium leading-7 text-neutral-200">장치, 사용자, 바이오인식, 출입통제, 모듈형 앱, 원격 서버 API 영역을 봅니다.</p>
            </Link>
            <Link className="rounded-lg border border-white/10 bg-neutral-950/70 p-5 hover:bg-white/[0.03]" href="/biostar/x/examples">
              <div className="mb-4 flex items-center gap-2 text-neutral-500"><BookOpen size={18} /><span className="text-sm">Examples</span></div>
              <p className="text-[17px] font-medium leading-7 text-neutral-200">보안 소프트웨어 통합, 맞춤형 출입통제, 원격 사이트 관리 예제를 봅니다.</p>
            </Link>
          </div>
          <section className="mt-12 rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="mb-4 text-xl font-medium text-neutral-200">핵심 정리</h2>
            <div className="grid grid-cols-2 gap-3 max-[820px]:grid-cols-1">
              {biostarXFacts.map((fact) => (
                <div className="rounded-lg border border-white/8 bg-black p-4 text-[15px] leading-6 text-neutral-300" key={fact}>{fact}</div>
              ))}
            </div>
          </section>
          <section className="mt-12 rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="mb-4 text-xl font-medium text-neutral-200">API 영역</h2>
            <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
              {biostarXApiGroups.map((group) => (
                <Link className="rounded-lg border border-white/8 bg-black p-4 hover:bg-white/[0.03]" href={`/biostar/x/api-reference#${group.slug}`} key={group.slug}>
                  <p className="mb-2 text-[17px] font-medium text-neutral-200">{group.title}</p>
                  <p className="text-sm leading-6 text-neutral-500">{group.description}</p>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
