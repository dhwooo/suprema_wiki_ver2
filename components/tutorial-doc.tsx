import { CodeBlock } from "@/components/code-block";
import type { Tutorial, TutorialBlock } from "@/lib/gsdk-tutorial";

function Block({ block }: { block: TutorialBlock }) {
  if (block.kind === "step") {
    return (
      <h2 id={block.anchor} className="scroll-mt-24 flex items-center gap-3 border-b border-edge pb-2 pt-6 text-[22px] font-medium text-text">
        {block.num ? (
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-active text-sm font-semibold text-secondary">{block.num}</span>
        ) : null}
        {block.title}
      </h2>
    );
  }
  if (block.kind === "prose") {
    return <div className="gsdk-prose text-[15px] leading-7 text-muted" dangerouslySetInnerHTML={{ __html: block.html }} />;
  }
  // code
  return <CodeBlock code={block.code} lang={block.lang} label={block.lang} />;
}

export function TutorialBody({ tutorial }: { tutorial: Tutorial }) {
  return (
    <div className="space-y-4">
      {tutorial.blocks.map((block, i) => (
        <Block key={i} block={block} />
      ))}
    </div>
  );
}
