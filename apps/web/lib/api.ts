import type { PublicHomepageData, PublicHomepageResponse } from "@/types/homepage.types";
import type { PublicSeoResponse } from "@/types/seo.types";

const API_URL = process.env.NODE_ENV === "production" ?
  process.env.NEXT_PUBLIC_API_URL : "http://localhost:8000";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "/api/v1"

export async function getPublicSeo(): Promise<PublicSeoResponse | null> {
  try {
    const res = await fetch(`${API_URL}${basePath}/public/seo`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function getPublicHomepage(): Promise<PublicHomepageData | null> {
  try {
    const res = await fetch(`${API_URL}${basePath}/public/homepage`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json: PublicHomepageResponse = await res.json();
    return json.data;
  } catch {
    return null;
  }
}
