import type { ContactSettings, GalleryItem, OccasionItem, TestimonialItem, VehicleItem } from "./entity.types";
import type { SeoMetadataPayload } from "./seo.types";

export interface HomepageContent {
    id?: number;
    heroHeading: string | null;
    heroSubheading: string | null;
    heroImage: string | null;
    heroCtaText: string | null;
    heroCtaUrl: string | null;
    aboutTitle: string | null;
    aboutDescription: string | null;
    aboutImage: string | null;
}

export interface PublicHomepageData {
    seo: SeoMetadataPayload | null;
    schemas: any[];
    jsonLd: Array<Record<string, any>>;
    homepage: HomepageContent | null;
    vehicles: VehicleItem[];
    occasions: OccasionItem[];
    testimonials: TestimonialItem[];
    gallery: GalleryItem[];
    contact: ContactSettings | null;
}

export interface PublicHomepageResponse {
    message: string;
    data: PublicHomepageData;
}