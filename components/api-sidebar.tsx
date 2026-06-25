import Link from "next/link";
import { apiBasics, apiCollections, getApiItem, getCollectionApis } from "@/lib/api-reference";
import { cn } from "@/lib/utils";

// /api 와 /api/[slug] 가 공유하는 좌측 메뉴. 8개 Collection을 그룹으로 펼칩니다.
export function ApiSidebar({ activeSlug }: { activeSlug?: string }) {
  const basics = apiBasics.map((slug) => getApiItem(slug)).filter((item) => Boolean(item));
  return (
    <aside className="sticky top-[74px] h-[calc(100vh-74px)] overflow-auto px-6 py-6 max-[820px]:static max-[820px]:h-auto max-[820px]:px-5 max-[820px]:py-3">
      <div className="mb-6 max-[820px]:hidden">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">G-SDK API</p>
        <p className="text-sm leading-6 text-muted">기능 묶음별로 정리한 실제 API 목록입니다.</p>
      </div>

      <nav className="space-y-5 max-[820px]:flex max-[820px]:gap-4 max-[820px]:space-y-0 max-[820px]:overflow-x-auto max-[820px]:pb-2" aria-label="API 메뉴">
        {basics.length > 0 ? (
          <div className="max-[820px]:shrink-0">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-faint">기초 개념</p>
            <div className="space-y-0.5">
              {basics.map((api) => (
                <SidebarLink key={api!.slug} slug={api!.slug} name={api!.name} active={activeSlug === api!.slug} />
              ))}
            </div>
          </div>
        ) : null}

        {apiCollections.map((collection) => (
          <div key={collection.slug} className="max-[820px]:shrink-0">
            <p className="mb-1.5 px-2 text-[11px] font-medium uppercase tracking-wide text-faint">{collection.title}</p>
            <div className="space-y-0.5">
              {getCollectionApis(collection).map((api) => (
                <SidebarLink key={api.slug} slug={api.slug} name={api.name} active={activeSlug === api.slug} />
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  );
}

function SidebarLink({ slug, name, active }: { slug: string; name: string; active: boolean }) {
  return (
    <Link
      href={`/api/${slug}`}
      className={cn(
        "block rounded-md px-2 py-1.5 text-[14px] transition-colors max-[820px]:whitespace-nowrap",
        active ? "bg-active font-medium text-text" : "text-muted hover:bg-hover hover:text-text",
      )}
    >
      {name}
    </Link>
  );
}
