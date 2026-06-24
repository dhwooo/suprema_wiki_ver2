import Link from "next/link";
import { BookOpen, Braces } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { biostar2ApiGroups, biostar2Facts } from "@/lib/biostar-reference";

export const metadata = {
  title: "BioStar 2 | Suprema Developer",
  description: "BioStar 2 New Local API 문서 허브입니다.",
};

export default function BioStar2Page() {
  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar 2</p>
          <h2 className="mb-2 text-[17px] font-medium text-neutral-200">New Local API</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-500">BioStar 2 AC 서버에 포함되는 REST/JSON API입니다.</p>
          <nav className="space-y-1 text-[15px]">
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/2/api-reference">API Reference</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/biostar/2/examples">Examples</Link>
          </nav>
        </aside>
        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">BioStar 2 API</p>
          <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">BioStar 2</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
            BioStar 2 New Local API는 BioStar 2.7.10부터 별도 API 서버 설치 없이 사용할 수 있는 서버 레벨 REST/JSON API입니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 max-[820px]:grid-cols-1">
            <Link className="rounded-lg border border-white/10 bg-neutral-950/70 p-5 hover:bg-white/[0.03]" href="/biostar/2/api-reference">
              <div className="mb-4 flex items-center gap-2 text-neutral-500"><Braces size={18} /><span className="text-sm">API Reference</span></div>
              <p className="text-[17px] font-medium leading-7 text-neutral-200">인증, 사용자, 장치, 출입통제, 이벤트, 인증정보 API 영역을 봅니다.</p>
            </Link>
            <Link className="rounded-lg border border-white/10 bg-neutral-950/70 p-5 hover:bg-white/[0.03]" href="/biostar/2/examples">
              <div className="mb-4 flex items-center gap-2 text-neutral-500"><BookOpen size={18} /><span className="text-sm">Examples</span></div>
              <p className="text-[17px] font-medium leading-7 text-neutral-200">로그인 세션 저장, 사용자 생성, 이벤트 수집 같은 사용 예를 봅니다.</p>
            </Link>
          </div>
          <section className="mt-12 rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="mb-4 text-xl font-medium text-neutral-200">핵심 정리</h2>
            <div className="grid grid-cols-2 gap-3 max-[820px]:grid-cols-1">
              {biostar2Facts.map((fact) => (
                <div className="rounded-lg border border-white/8 bg-black p-4 text-[15px] leading-6 text-neutral-300" key={fact}>{fact}</div>
              ))}
            </div>
          </section>
          <section className="mt-12 rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <h2 className="mb-4 text-xl font-medium text-neutral-200">API 영역</h2>
            <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
              {biostar2ApiGroups.map((group) => (
                <Link className="rounded-lg border border-white/8 bg-black p-4 hover:bg-white/[0.03]" href={`/biostar/2/api-reference#${group.slug}`} key={group.slug}>
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
