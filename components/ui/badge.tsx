import * as React from "react";
import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex h-7 items-center rounded-full bg-neutral-900 px-3 text-sm text-neutral-300",
        className,
      )}
      {...props}
    />
  );
}
