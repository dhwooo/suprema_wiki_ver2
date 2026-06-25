import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { SearchDialog } from "@/components/search-dialog";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

type NavKey = "home" | "api" | "gsdk" | "biostar" | "reference" | "examples";

const navItems: { key: NavKey; label: string; href: string }[] = [
  { key: "home", label: "Home", href: "/" },
];

const gsdkLinks = [
  { label: "Overview", href: "/gsdk", description: "Gateway, gRPC, SDK 구조" },
  { label: "API Reference", href: "/api", description: "서비스·메서드·타입 레퍼런스" },
  { label: "Examples", href: "/examples", description: "Python 단계별 사용 예제" },
];

const biostarLinks = [
  { label: "Overview", href: "/biostar", description: "BioStar 2 / BioStar X 개발 축" },
  { label: "BioStar 2", href: "/biostar/2", description: "BioStar 2 New Local API" },
  { label: "BioStar 2 API Reference", href: "/biostar/2/api-reference", description: "REST/JSON 서버 API 색인" },
  { label: "BioStar 2 Examples", href: "/biostar/2/examples", description: "로그인, 사용자, 이벤트 예제" },
  { label: "BioStar X", href: "/biostar/x", description: "BioStar X REST API" },
  { label: "BioStar X API Reference", href: "/biostar/x/api-reference", description: "장치, 단말, 사용자, 바이오인식 API" },
  { label: "BioStar X Examples", href: "/biostar/x/examples", description: "통합 시나리오와 운영 패턴" },
];

export function SiteHeader({ active, searchSlot }: { active: NavKey; searchSlot?: ReactNode }) {
  return (
    <header className="sticky top-0 z-40 grid h-[74px] grid-cols-[minmax(260px,1fr)_auto_minmax(320px,1fr)] items-center gap-6 border-b border-edge bg-bg/85 px-7 backdrop-blur-xl max-[980px]:grid-cols-[1fr_auto] max-[760px]:static max-[760px]:h-auto max-[760px]:grid-cols-1 max-[760px]:px-5 max-[760px]:py-4">
      <Link href="/" className="flex min-w-0 items-center gap-3">
        <span className="text-[24px] font-[560] tracking-normal text-text">Suprema Developer</span>
        <span className="h-4 w-px bg-raised" />
        <span className="whitespace-nowrap text-sm font-normal text-muted">Docs</span>
      </Link>
      <nav className="flex items-center justify-center gap-1 text-[15px] text-secondary max-[980px]:hidden" aria-label="주요 탐색">
        {navItems.map((item) => (
          <Link
            className={cn(
              "rounded-md px-3 py-2 hover:bg-hover hover:text-text",
              active === item.key && "bg-active text-text",
            )}
            href={item.href}
            key={item.key}
          >
            {item.label}
          </Link>
        ))}
        <ProductMenu active={active === "gsdk" || active === "api" || active === "reference" || active === "examples"} label="GSDK" links={gsdkLinks} />
        <ProductMenu active={active === "biostar"} label="BioStar" links={biostarLinks} />
      </nav>
      <div className="flex items-center justify-end gap-3 max-[760px]:justify-stretch">
        {searchSlot ?? <SearchDialog />}
        {searchSlot ? <SearchDialog showTrigger={false} /> : null}
        <ThemeToggle />
      </div>
    </header>
  );
}

function ProductMenu({
  active,
  label,
  links,
}: {
  active: boolean;
  label: string;
  links: { label: string; href: string; description: string; external?: boolean }[];
}) {
  return (
    <div className="group relative">
      <button
        className={cn(
          "inline-flex items-center gap-1 rounded-md px-3 py-2 text-[15px] hover:bg-hover hover:text-text",
          active && "bg-active text-text",
        )}
        type="button"
      >
        {label}
        <ChevronDown size={14} />
      </button>
      <div className="invisible absolute left-0 top-full z-50 w-[310px] pt-2 opacity-0 transition group-hover:visible group-hover:opacity-100">
        <div className="rounded-lg border border-edge bg-surface p-2 shadow-2xl shadow-black/60">
          {links.map((link) => {
            const content = (
              <>
                <span className="flex items-center justify-between gap-3 text-[15px] font-medium text-text">
                  {link.label}
                </span>
                <span className="mt-1 block text-sm leading-5 text-muted">{link.description}</span>
              </>
            );
            return <Link className="block rounded-md px-3 py-2.5 hover:bg-hover" href={link.href} key={link.href}>{content}</Link>;
          })}
        </div>
      </div>
    </div>
  );
}
