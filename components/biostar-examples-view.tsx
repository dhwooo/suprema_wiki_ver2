import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import { MethodBadge } from "@/components/biostar-doc";
import type { ExampleScenario } from "@/lib/biostar-examples";

// Postman collection 기반 시나리오(인증 + 그룹별 CRUD 흐름)를 단계별 코드로 렌더합니다.
export function BiostarExamplesView({ scenarios, apiBasePath }: { scenarios: ExampleScenario[]; apiBasePath: string }) {
  return (
    <div className="mt-12 space-y-14">
      {scenarios.map((s) => (
        <section key={s.slug} id={s.slug} className="scroll-mt-24">
          <h2 className="text-[24px] font-medium text-text">{s.title}</h2>
          <p className="mt-2 max-w-3xl text-[15px] leading-7 text-muted">{s.description}</p>
          <div className="mt-6 space-y-7">
            {s.steps.map((step, i) => (
              <div key={step.endpointSlug} className="space-y-2.5">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-hover text-[11px] font-medium text-secondary">
                    {i + 1}
                  </span>
                  <MethodBadge method={step.method} />
                  <Link href={`${apiBasePath}/${step.endpointSlug}`} className="text-[15px] font-medium text-secondary hover:text-text">
                    {step.title}
                  </Link>
                  <code className="font-mono text-[12px] text-faint">{step.path}</code>
                </div>
                <CodeBlock code={step.curl} lang="bash" label="cURL" />
                <CodeBlock code={step.fetch} lang="javascript" label="JavaScript (fetch)" />
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
