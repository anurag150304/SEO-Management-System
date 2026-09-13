import { getPublicHomepage } from "@/lib/api";
import { HomeView } from "@/components/HomeView";

// Ensuring instant reflection of dashboard changes on every request.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const data = await getPublicHomepage();

  return <HomeView data={data} />;
}
