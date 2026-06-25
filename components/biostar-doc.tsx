import Link from "next/link";
import { CodeBlock } from "@/components/code-block";
import type { BiostarApi, BiostarEndpoint, BiostarGroup, KeyValDesc } from "@/lib/biostar-doc";

const METHOD_STYLES: Record<string, string> = {
  GET: "text-emerald-300 border-emerald-400/30 bg-emerald-400/10",
  POST: "text-sky-300 border-sky-400/30 bg-sky-400/10",
  PUT: "text-amber-300 border-amber-400/30 bg-amber-400/10",
  PATCH: "text-violet-300 border-violet-400/30 bg-violet-400/10",
  DELETE: "text-rose-300 border-rose-400/30 bg-rose-400/10",
};

export function MethodBadge({ method }: { method: string }) {
  const cls = METHOD_STYLES[method] ?? "text-secondary border-edge-strong bg-active";
  return (
    <span className={`inline-flex h-6 shrink-0 items-center rounded-md border px-2 font-mono text-[11px] font-semibold tracking-wide ${cls}`}>
      {method}
    </span>
  );
}

function ParamTable({ title, rows }: { title: string; rows: KeyValDesc[] }) {
  if (rows.length === 0) return null;
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-secondary">{title}</p>
      <div className="overflow-x-auto rounded-lg border border-edge bg-bg">
        <table className="w-full border-collapse text-left text-[13px]">
          <thead>
            <tr className="border-b border-edge text-muted">
              <th className="px-4 py-2 font-medium">이름</th>
              <th className="px-4 py-2 font-medium">예시 값</th>
              <th className="px-4 py-2 font-medium">설명</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.key} className="border-b border-edge align-top last:border-0">
                <td className="px-4 py-2 font-mono text-secondary">{r.key}</td>
                <td className="px-4 py-2 font-mono text-[12px] text-muted">{r.value || "-"}</td>
                <td className="px-4 py-2 text-muted">{r.desc || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// endpoint 상세 본문 (상세 페이지에서 사용)
export function BiostarEndpointBody({ endpoint }: { endpoint: BiostarEndpoint }) {
  const e = endpoint;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-edge bg-surface/60 px-4 py-3">
        <MethodBadge method={e.method} />
        <code className="break-all font-mono text-[15px] text-secondary">{e.path}</code>
      </div>

      {e.descHtml ? (
        <div className="bs-prose text-[15px] leading-7 text-muted" dangerouslySetInnerHTML={{ __html: e.descHtml }} />
      ) : null}

      <section id="parameters" className="scroll-mt-24 space-y-5">
        <ParamTable title="Path 파라미터" rows={e.pathParams} />
        <ParamTable title="Query 파라미터" rows={e.queryParams} />
        {e.headers.length > 0 ? <ParamTable title="헤더" rows={e.headers} /> : null}
        {e.pathParams.length === 0 && e.queryParams.length === 0 && e.headers.length === 0 ? (
          <p className="text-sm text-faint">경로/쿼리 파라미터 없음</p>
        ) : null}
      </section>

      {e.body ? (
        <section id="request" className="scroll-mt-24">
          <h2 className="mb-3 text-[20px] font-medium text-secondary">Request body</h2>
          <CodeBlock code={e.body} lang={e.bodyLang ?? "json"} label={`${e.bodyLang ?? "json"} · request`} />
        </section>
      ) : null}

      {e.responses.length > 0 ? (
        <section id="responses" className="scroll-mt-24 space-y-4">
          <h2 className="text-[20px] font-medium text-secondary">Responses</h2>
          {e.responses.map((r, i) => (
            <div key={r.name + i} className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                {r.code != null ? (
                  <span className="inline-flex h-6 items-center rounded-md border border-edge-strong bg-hover px-2 font-mono text-xs text-secondary">
                    {r.code} {r.status}
                  </span>
                ) : null}
                <span className="text-sm text-muted">{r.name}</span>
              </div>
              <CodeBlock code={r.body} lang={r.lang} label={`${r.lang} · ${r.code ?? ""} ${r.status ?? ""}`.trim()} />
            </div>
          ))}
        </section>
      ) : null}
    </div>
  );
}

// 인덱스 페이지 본문: 그룹별 endpoint 목록 (각 endpoint는 상세로 링크)
export function BiostarIndexBody({ api, basePath }: { api: BiostarApi; basePath: string }) {
  return (
    <section className="mt-12 space-y-10">
      {api.groups.map((group) => (
        <BiostarGroupCard key={group.slug} group={group} basePath={basePath} />
      ))}
    </section>
  );
}

function BiostarGroupCard({ group, basePath }: { group: BiostarGroup; basePath: string }) {
  return (
    <section id={group.slug} className="scroll-mt-24">
      <div className="mb-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[24px] font-medium text-text">{group.title}</h2>
          <span className="shrink-0 text-sm text-faint">{group.endpoints.length} endpoints</span>
        </div>
        {group.descHtml ? (
          <div className="bs-prose mt-2 text-[14px] leading-6 text-muted" dangerouslySetInnerHTML={{ __html: group.descHtml }} />
        ) : null}
      </div>
      <div className="divide-y divide-edge rounded-lg border border-edge bg-surface/40">
        {group.endpoints.map((e) => (
          <Link
            key={e.slug}
            href={`${basePath}/${e.slug}`}
            className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-hover"
          >
            <MethodBadge method={e.method} />
            <span className="min-w-0 flex-1 truncate text-[14px] text-secondary">{e.name}</span>
            <code className="hidden truncate font-mono text-[12px] text-muted md:block md:max-w-[46%]">{e.path}</code>
          </Link>
        ))}
      </div>
    </section>
  );
}
