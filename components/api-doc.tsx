import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/code-block";
import type { ApiDoc, DocBlock } from "@/lib/gsdk-doc";

type SubGroup = { type: "sub"; head: Extract<DocBlock, { kind: "subsection" }>; children: DocBlock[] };
type Group =
  | { type: "section"; block: Extract<DocBlock, { kind: "section" }> }
  | { type: "loose"; block: DocBlock }
  | SubGroup;

function groupBlocks(blocks: DocBlock[]): Group[] {
  const groups: Group[] = [];
  let current: SubGroup | null = null;
  for (const b of blocks) {
    if (b.kind === "section") {
      current = null;
      groups.push({ type: "section", block: b });
    } else if (b.kind === "subsection") {
      current = { type: "sub", head: b, children: [] };
      groups.push(current);
    } else if (current) {
      current.children.push(b);
    } else {
      groups.push({ type: "loose", block: b });
    }
  }
  return groups;
}

function TypeRef({ typeRef, label }: { typeRef?: string; label: string }) {
  if (typeRef && (typeRef.startsWith("#") || typeRef.startsWith("/"))) {
    return (
      <a className="text-sky-300/90 hover:text-sky-200 hover:underline" href={typeRef}>
        {label}
      </a>
    );
  }
  return <span className="text-secondary">{label}</span>;
}

function Prose({ html }: { html: string }) {
  return <div className="gsdk-prose text-[15px] leading-7 text-muted" dangerouslySetInnerHTML={{ __html: html }} />;
}

function ProtoCard({ block }: { block: Extract<DocBlock, { kind: "proto" }> }) {
  const isEnum = block.defKind === "enum";
  const described = block.fields.filter((f) => f.desc || f.version);
  return (
    <section id={block.anchor} className="scroll-mt-24 rounded-lg border border-edge bg-surface/60">
      <div className="flex items-center gap-2 border-b border-edge px-4 py-3">
        <Badge className="h-6 px-2 text-xs">{isEnum ? "enum" : block.defKind === "message" ? "message" : block.defKind}</Badge>
        <span className="font-mono text-[15px] text-secondary">{block.name}</span>
      </div>
      <div className="space-y-4 p-4">
        <CodeBlock code={block.code} />
        {described.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-[13px]">
              <thead>
                <tr className="border-b border-edge text-muted">
                  <th className="py-2 pr-4 font-medium">{isEnum ? "값" : "필드"}</th>
                  {!isEnum ? <th className="py-2 pr-4 font-medium">타입</th> : null}
                  <th className="py-2 font-medium">설명</th>
                </tr>
              </thead>
              <tbody>
                {block.fields.map((f) => (
                  <tr key={f.name} className="border-b border-edge align-top last:border-0">
                    <td className="py-2 pr-4 font-mono text-secondary">
                      {f.name}
                      {f.version ? <span className="ml-2 rounded bg-emerald-500/15 px-1.5 py-0.5 text-[11px] text-emerald-300">+{f.version}</span> : null}
                    </td>
                    {!isEnum ? (
                      <td className="py-2 pr-4 font-mono text-[12px] text-muted">
                        {f.repeated ? "repeated " : ""}
                        <TypeRef typeRef={f.typeRef} label={f.fieldType ?? "-"} />
                      </td>
                    ) : null}
                    <td className="py-2 text-muted">
                      {isEnum && f.fieldType ? <span className="mr-2 font-mono text-[12px] text-muted">= {f.fieldType}</span> : null}
                      <span dangerouslySetInnerHTML={{ __html: f.desc }} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function IoTable({ block }: { block: Extract<DocBlock, { kind: "io" }> }) {
  return (
    <div>
      <p className="mb-2 text-sm font-medium text-secondary">{block.label}</p>
      {block.rows.length === 0 ? (
        <p className="text-sm text-faint">{block.label === "Request" ? "파라미터 없음" : "응답 본문 없음"}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-edge bg-bg">
          <table className="w-full border-collapse text-left text-[13px]">
            <thead>
              <tr className="border-b border-edge text-muted">
                <th className="px-4 py-2 font-medium">파라미터</th>
                <th className="px-4 py-2 font-medium">타입</th>
                <th className="px-4 py-2 font-medium">설명</th>
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r) => (
                <tr key={r.param + r.type} className="border-b border-edge align-top last:border-0">
                  <td className="px-4 py-2 font-mono text-secondary">{r.param}</td>
                  <td className="px-4 py-2 font-mono text-[12px] text-muted">
                    <TypeRef typeRef={r.typeRef} label={r.type} />
                  </td>
                  <td className="px-4 py-2 text-muted">
                    <span dangerouslySetInnerHTML={{ __html: r.desc }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function GenericTable({ block }: { block: Extract<DocBlock, { kind: "table" }> }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-edge">
      <table className="w-full border-collapse text-left text-[13px]">
        {block.headers.length > 0 ? (
          <thead>
            <tr className="border-b border-edge text-muted">
              {block.headers.map((h) => (
                <th key={h} className="px-4 py-2 font-medium">{h}</th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {block.rows.map((row, ri) => (
            <tr key={ri} className="border-b border-edge last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-4 py-2 text-muted" dangerouslySetInnerHTML={{ __html: cell }} />
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Child({ block }: { block: DocBlock }) {
  if (block.kind === "prose") return <Prose html={block.html} />;
  if (block.kind === "proto") return <ProtoCard block={block} />;
  if (block.kind === "io") return <IoTable block={block} />;
  if (block.kind === "table") return <GenericTable block={block} />;
  return null;
}

export function ApiDocBody({ doc }: { doc: ApiDoc }) {
  const groups = groupBlocks(doc.blocks);
  return (
    <div className="space-y-8">
      {groups.map((g, gi) => {
        if (g.type === "section") {
          return (
            <h2 key={gi} id={`s-${g.block.anchor}`} className="scroll-mt-24 border-b border-edge pb-2 pt-4 text-[26px] font-medium text-text">
              {g.block.title}
            </h2>
          );
        }
        if (g.type === "loose") {
          return <Child key={gi} block={g.block} />;
        }
        // subsection 그룹
        if (g.head.isMethod) {
          return (
            <section key={gi} id={g.head.anchor} className="scroll-mt-24 rounded-xl border border-edge bg-surface/40 p-5">
              <div className="mb-4 flex items-center gap-3">
                <h3 className="font-mono text-[19px] text-text">{g.head.title}</h3>
                <Badge className="h-6 px-2 text-xs">method</Badge>
              </div>
              <div className="space-y-4">
                {g.children.map((c, ci) => (
                  <Child key={ci} block={c} />
                ))}
              </div>
            </section>
          );
        }
        return (
          <section key={gi} id={g.head.anchor} className="scroll-mt-24">
            <h3 className="mb-3 text-[20px] font-medium text-secondary">{g.head.title}</h3>
            <div className="space-y-4">
              {g.children.map((c, ci) => (
                <Child key={ci} block={c} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
