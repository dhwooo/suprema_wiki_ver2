import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SiteHeader } from "@/components/site-header";
import { DocThumbnail } from "@/components/doc-thumbnail";
import { tutorials } from "@/lib/tutorials";
import { getApiItem } from "@/lib/api-reference";

export const metadata = {
  title: "Examples | Suprema G-SDK 문서",
  description: "G-SDK Python 단계별 사용 예제입니다.",
};

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-bg text-text">
      <SiteHeader active="examples" />
      <section className="mx-auto w-full max-w-[1320px] px-9 pb-20 pt-8 max-[820px]:px-5 max-[820px]:pt-7">
        <header className="mb-12">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-faint">Examples</p>
          <h1 className="mb-4 text-[40px] font-[560] leading-tight text-text max-[760px]:text-[32px]">Python 사용 예제</h1>
          <p className="max-w-3xl text-[17px] leading-8 text-muted">
            G-SDK Python 클라이언트로 장치 연결부터 사용자 관리, 이벤트 수집까지 단계별 코드로 따라갑니다. 각 예제는 실제 호출 흐름을 그대로 담고 있어 복사해 바로 응용할 수 있습니다.
          </p>
        </header>

        <div className="grid grid-cols-3 gap-x-5 gap-y-10 max-[1100px]:grid-cols-2 max-[680px]:grid-cols-1">
          {tutorials.map((tutorial) => (
            <Link key={tutorial.slug} href={`/examples/${tutorial.slug}`} className="group block min-w-0">
              <DocThumbnail type={tutorial.thumbnail} accent={tutorial.accent} />
              <div className="pt-4">
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint">Python Example</p>
                <h2 className="mb-2 text-[19px] font-medium leading-tight text-text group-hover:text-text">{tutorial.title}</h2>
                <p className="mb-3 min-h-[48px] text-[14px] leading-6 text-muted">{tutorial.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  {tutorial.apis.slice(0, 4).map((apiSlug) => {
                    const api = getApiItem(apiSlug);
                    if (!api) return null;
                    return <Badge key={apiSlug} className="h-6 px-2 text-xs">{api.name}</Badge>;
                  })}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
