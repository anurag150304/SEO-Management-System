import type {
  createSeoSchemaType,
  updateSeoSchemaType,
} from "@repo/zod-validations";

export interface SeoRecord {
  id: number;
  metaTitle: string | null;
  metaDescription: string | null;
  focusKeywords: string[] | null;
  canonicalUrl: string | null;
  robotsIndex: boolean | null;
  robotsFollow: boolean | null;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  twitterTitle: string | null;
  twitterDescription: string | null;
  twitterImage: string | null;
  createdAt: string | Date | null;
  updatedAt: string | Date | null;
}

export interface SeoResponse {
  message: string;
  seo: SeoRecord;
  seoId?: number;
}

export type CreateSeoPayload = createSeoSchemaType | FormData;
export type UpdateSeoPayload = updateSeoSchemaType | FormData;
