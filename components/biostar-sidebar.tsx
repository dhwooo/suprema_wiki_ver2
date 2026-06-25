import Link from "next/link";
import { cn } from "@/lib/utils";
import { getBiostarApi, type BiostarProduct } from "@/lib/biostar-doc";

// 상세 페이지(/biostar/{2,x}/api-reference/[slug])가 공유하는 좌측 그룹→endpoint 네비.
export function BiostarSidebar({
  product,
  basePath,
  activeSlug,
}: {
  product: BiostarProduct;
  basePath: string;
  activeSlug?: string;
}) {
  const api = getBiostarApi(product);
  const label = product === "bs2" ? "BioStar 2" : "BioStar X";
  return (
    <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-6 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
      <div className="mb-5 max-[820px]:hidden">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">{label} API</p>
        <Link href={basePath} className="text-sm text-muted hover:text-text">
          전체 endpoint 색인 →
        </Link>
      </div>
      <nav className="space-y-5 max-[820px]:flex max-[820px]:gap-4 max-[820px]:space-y-0 max-[820px]:overflow-x-auto max-[820px]:pb-2" aria-label="API 메뉴">
        {api.groups.map((group) => (
          <div key={group.slug} className="max-[820px]:shrink-0">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-faint">{group.title}</p>
            <div className="space-y-0.5">
              {group.endpoints.map((e) => (
                <Link
                  key={e.slug}
                  href={`${basePath}/${e.slug}`}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-[13px] transition-colors max-[820px]:whitespace-nowrap",
                    activeSlug === e.slug
                      ? "bg-active font-medium text-text"
                      : "text-muted hover:bg-hover hover:text-text",
                  )}
                >
                  {e.name}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}
