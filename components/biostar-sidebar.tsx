import { getBiostarApi, type BiostarProduct } from "@/lib/biostar-doc";
import { BiostarSidebarNav, type NavGroup } from "@/components/biostar-sidebar-nav";

// 상세/인덱스 페이지가 공유하는 좌측 그룹→endpoint 네비. 데이터만 추출해
// client accordion(BiostarSidebarNav)에 넘깁니다.
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
  const groups: NavGroup[] = api.groups.map((g) => ({
    slug: g.slug,
    title: g.title,
    endpoints: g.endpoints.map((e) => ({ slug: e.slug, name: e.name, method: e.method })),
  }));
  const label = product === "bs2" ? "BioStar 2" : "BioStar X";

  return <BiostarSidebarNav groups={groups} basePath={basePath} activeSlug={activeSlug} label={label} />;
}
