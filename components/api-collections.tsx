import Link from "next/link";
import { Activity, Boxes, Cpu, DoorOpen, Network, ServerCog, SlidersHorizontal, Users } from "lucide-react";
import { apiCollections, getCollectionApis, type ApiCollectionIcon } from "@/lib/api-reference";

export const collectionIconMap: Record<ApiCollectionIcon, React.ElementType> = {
  network: Network,
  device: Cpu,
  identity: Users,
  access: DoorOpen,
  events: Activity,
  zones: Boxes,
  config: SlidersHorizontal,
  server: ServerCog,
};

export function ApiCollectionsGrid() {
  return (
    <div className="grid grid-cols-2 gap-x-10 gap-y-7 max-[820px]:grid-cols-1 max-[820px]:gap-y-5">
      {apiCollections.map((collection) => {
        const Icon = collectionIconMap[collection.icon];
        const apis = getCollectionApis(collection);
        return (
          <Link key={collection.slug} href={`#coll-${collection.slug}`} className="group flex gap-4">
            <span className={`coll-icon collection-icon-${collection.accent}`}>
              <Icon size={22} />
            </span>
            <div className="min-w-0">
              <p className="text-[17px] font-medium text-text transition-colors group-hover:text-text">{collection.title}</p>
              <p className="mt-1 text-[14px] leading-6 text-muted">{collection.description}</p>
              <p className="mt-1.5 text-[12px] text-faint">{apis.length} APIs</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
