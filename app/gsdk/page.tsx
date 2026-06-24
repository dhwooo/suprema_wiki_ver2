import type { ReactNode } from "react";
import Link from "next/link";
import { BookOpen, Code2, Network } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { apiGroups, apiItems, getApiDetail } from "@/lib/api-reference";

export const metadata = {
  title: "GSDK | Suprema Developer",
  description: "Suprema G-SDK의 Gateway, gRPC API, 사용 예제 문서 허브입니다.",
};

export default function GsdkPage() {
  const methodCount = apiItems.reduce((sum, item) => {
    const detail = getApiDetail(item.slug);
    return sum + (detail?.methodGroups?.reduce((methodSum, group) => methodSum + group.methods.length, 0) ?? 0);
  }, 0);

  return (
    <main className="min-h-screen bg-black text-neutral-100">
      <SiteHeader active="gsdk" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-7 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-neutral-600">GSDK</p>
          <h2 className="mb-2 text-[17px] font-medium text-neutral-200">Gateway SDK</h2>
          <p className="mb-6 text-sm leading-6 text-neutral-500">gRPC Gateway를 통해 BioStar 장치와 통신하는 개발 축입니다.</p>
          <nav className="space-y-1 text-[15px]">
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/api">API Reference</Link>
            <Link className="block rounded-md px-2 py-1.5 text-neutral-300 hover:bg-white/8" href="/reference">Examples</Link>
          </nav>
        </aside>
        <section className="w-full max-w-[1540px] px-9 pb-20 pt-8 max-[820px]:px-5">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-neutral-600">Gateway SDK</p>
          <h1 className="mb-4 text-[42px] font-[560] leading-tight text-neutral-100 max-[760px]:text-[32px]">GSDK</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-neutral-400">
            G-SDK는 애플리케이션이 gRPC 클라이언트로 Gateway에 요청하고, Gateway가 BioStar 장치와 통신하는 API 계층입니다.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3 max-[920px]:grid-cols-1">
            <Metric label="API services" value={`${apiItems.length}`} />
            <Metric label="Indexed methods" value={`${methodCount}`} />
            <Metric label="Gateway model" value="Device / Master" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-4 max-[980px]:grid-cols-1">
            <HubCard href="/api" icon={<Code2 size={18} />} title="API Reference" description="Connect, Device, User, Access 같은 실제 G-SDK API와 메서드 그룹을 봅니다." />
            <HubCard href="/reference" icon={<BookOpen size={18} />} title="Examples" description="장치 연결, 사용자 동기화, 이벤트 수집처럼 API를 조합하는 흐름을 봅니다." />
          </div>

          <section className="mt-14 rounded-lg border border-white/10 bg-neutral-950/70 p-5">
            <div className="mb-5 flex items-center gap-2 text-neutral-500">
              <Network size={17} />
              <p className="text-sm">API groups</p>
            </div>
            <div className="grid grid-cols-3 gap-3 max-[980px]:grid-cols-2 max-[640px]:grid-cols-1">
              {apiGroups.map((group) => (
                <Link className="rounded-lg border border-white/8 bg-black p-4 hover:border-white/20 hover:bg-white/[0.03]" href={`/api#${group.slug}`} key={group.slug}>
                  <p className="mb-2 text-[17px] font-medium text-neutral-200">{group.title}</p>
                  <p className="text-sm leading-6 text-neutral-500">{group.description}</p>
                  <Badge className="mt-4 h-6 px-2 text-xs">{group.items.length} APIs</Badge>
                </Link>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
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
