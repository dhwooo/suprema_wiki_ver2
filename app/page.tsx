import Link from "next/link";
import { ArrowRight, BookOpen, Boxes, Code2, Network, Play, Server, Terminal } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

export const metadata = {
  title: "Suprema Developer 문서",
  description: "Suprema G-SDK와 BioStar API 개발자 문서 허브입니다.",
};

type ProductLink = { label: string; href: string };
type Product = {
  name: string;
  tag: string;
  description: string;
  accent: "cyan" | "blue";
  icon: React.ElementType;
  href: string;
  links: ProductLink[];
};

const products: Product[] = [
  {
    name: "G-SDK",
    tag: "gRPC · Gateway",
    description: "gRPC 기반 Gateway를 통해 BioStar 장치를 직접 연결하고 사용자·출입·이벤트를 제어하는 SDK입니다.",
    accent: "cyan",
    icon: Network,
    href: "/gsdk",
    links: [
      { label: "Guides", href: "/gsdk" },
      { label: "API Reference", href: "/api" },
      { label: "Examples", href: "/examples" },
    ],
  },
  {
    name: "BioStar",
    tag: "REST · JSON",
    description: "BioStar 2 / BioStar X 서버의 사용자·장치·출입통제·이벤트 데이터를 REST/JSON으로 연동하는 서버 API입니다.",
    accent: "blue",
    icon: Server,
    href: "/biostar",
    links: [
      { label: "BioStar 2", href: "/biostar/2" },
      { label: "API Reference", href: "/biostar/2/api-reference" },
      { label: "BioStar X", href: "/biostar/x" },
    ],
  },
];

const quickStarts = [
  { title: "G-SDK 빠른 시작", description: "Gateway 연결부터 첫 사용자 인증까지 최소 흐름을 따라갑니다.", href: "/examples/quick", icon: Play },
  { title: "첫 장치 연결", description: "Device Gateway로 장치를 검색하고 연결해 Device ID를 얻습니다.", href: "/examples/connect", icon: Terminal },
  { title: "API Reference 둘러보기", description: "기능 묶음별로 정리한 G-SDK 서비스·메서드·타입을 봅니다.", href: "/api", icon: Code2 },
  { title: "BioStar 2 시작", description: "BioStar 2 New Local API로 서버와 REST 연동을 시작합니다.", href: "/biostar/2", icon: Boxes },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="home" />

      <section className="mx-auto w-full max-w-[1100px] px-9 pb-24 pt-16 max-[820px]:px-5 max-[820px]:pt-12">
        <header className="mb-16 max-w-[760px]">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">Developer documentation</p>
          <h1 className="mb-5 text-[46px] font-[560] leading-[1.08] tracking-tight text-text max-[820px]:text-[34px]">Suprema 개발자 문서</h1>
          <p className="text-[18px] leading-8 text-muted">
            슈프리마 출입통제 장치를 연동하는 두 가지 길 — 장치를 직접 제어하는 <span className="text-secondary">G-SDK</span>와 서버와 통신하는 <span className="text-secondary">BioStar API</span> 중 필요한 쪽에서 시작하세요. 상단 검색(⌘K)으로 모든 API·예제를 찾을 수 있습니다.
          </p>
        </header>

        <section className="mb-16">
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted">제품 선택</h2>
          <div className="grid grid-cols-2 gap-5 max-[820px]:grid-cols-1">
            {products.map((product) => {
              const Icon = product.icon;
              return (
                <div key={product.name} className="rounded-2xl border border-edge bg-surface/60 p-6">
                  <div className="mb-5 flex items-center gap-4">
                    <span className={`coll-icon collection-icon-${product.accent}`}>
                      <Icon size={24} />
                    </span>
                    <div>
                      <Link href={product.href} className="text-[22px] font-medium text-text hover:text-text">{product.name}</Link>
                      <p className="text-xs font-medium uppercase tracking-wide text-faint">{product.tag}</p>
                    </div>
                  </div>
                  <p className="mb-5 text-[15px] leading-7 text-muted">{product.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {product.links.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="inline-flex items-center gap-1.5 rounded-full border border-edge bg-bg px-3 py-1.5 text-[13px] font-medium text-secondary transition-colors hover:border-edge-strong hover:text-text"
                      >
                        {link.label}
                        <ArrowRight size={13} />
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="mb-5 text-sm font-medium uppercase tracking-wide text-muted">처음이라면</h2>
          <div className="grid grid-cols-2 gap-3 max-[820px]:grid-cols-1">
            {quickStarts.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-start gap-4 rounded-lg border border-edge bg-surface/40 p-4 transition-colors hover:border-edge-strong hover:bg-hover"
                >
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-edge bg-hover text-muted group-hover:text-secondary">
                    <Icon size={17} />
                  </span>
                  <span>
                    <span className="mb-1 flex items-center gap-1.5 text-[15px] font-medium text-text group-hover:text-text">
                      {item.title}
                    </span>
                    <span className="block text-[13px] leading-6 text-muted">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-muted">
            <BookOpen size={15} />
            더 깊은 개념은 <Link href="/gsdk" className="text-secondary hover:text-text">G-SDK Guides</Link>에서 확인하세요.
          </p>
        </section>
      </section>
    </main>
  );
}
