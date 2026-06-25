import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { OnThisPage } from "@/components/on-this-page";
import { SiteHeader } from "@/components/site-header";
import { BiostarSidebar } from "@/components/biostar-sidebar";
import { BiostarEndpointBody } from "@/components/biostar-doc";
import { getBiostarEndpoint, getBiostarParams } from "@/lib/biostar-doc";
import type { TocItem } from "@/lib/toc";

const PRODUCT = "bsx" as const;
const BASE_PATH = "/biostar/x/api-reference";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getBiostarParams(PRODUCT);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const found = getBiostarEndpoint(PRODUCT, slug);
  if (!found) return {};
  return {
    title: `${found.endpoint.name} | BioStar X API`,
    description: `${found.endpoint.method} ${found.endpoint.path}`,
  };
}

export default async function BioStarXEndpointPage({ params }: PageProps) {
  const { slug } = await params;
  const found = getBiostarEndpoint(PRODUCT, slug);
  if (!found) notFound();
  const { endpoint, group } = found;

  const tocItems: TocItem[] = [{ id: "overview", label: "개요" }, { id: "code", label: "코드 예제" }, { id: "parameters", label: "파라미터" }];
  if (endpoint.body) tocItems.push({ id: "request", label: "요청 본문" });
  if (endpoint.responses.length > 0) tocItems.push({ id: "responses", label: "응답" });

  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="biostar" />
      <div className="grid grid-cols-[250px_minmax(0,1fr)_250px] max-[1180px]:grid-cols-[250px_minmax(0,1fr)] max-[820px]:block">
        <BiostarSidebar product={PRODUCT} basePath={BASE_PATH} activeSlug={endpoint.slug} />
        <article className="w-full max-w-[1180px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
          <section className="scroll-mt-24" id="overview">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">
              <Link href={BASE_PATH} className="hover:text-secondary">BioStar X API</Link>
              <span className="mx-1.5 text-faint">/</span>
              <Link href={`${BASE_PATH}#${group.slug}`} className="hover:text-secondary">{group.title}</Link>
            </p>
            <h1 className="mb-6 text-[36px] font-[560] leading-tight text-text max-[760px]:text-[28px]">{endpoint.name}</h1>
          </section>
          <BiostarEndpointBody endpoint={endpoint} />
        </article>
        <OnThisPage items={tocItems} />
      </div>
    </main>
  );
}
