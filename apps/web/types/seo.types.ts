export interface SeoMetadataPayload {
    id?: number;
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
}

export interface PublicSeoResponse {
    message: string;
    seo: SeoMetadataPayload | null;
    schemas: any[];
    jsonLd: Array<Record<string, any>>;
}