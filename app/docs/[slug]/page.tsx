import { redirect } from "next/navigation";

type LegacyDocPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LegacyDocPage({ params }: LegacyDocPageProps) {
  const { slug } = await params;
  redirect(`/reference/${slug}`);
}
