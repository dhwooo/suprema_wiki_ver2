import { Suspense } from "react";
import { HomeClient } from "@/components/home-client";

export default function Home() {
  return (
    <Suspense>
      <HomeClient />
    </Suspense>
  );
}
