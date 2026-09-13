export interface VehicleItem {
    id: number;
    title: string;
    seatingCapacity: number | null;
    description: string | null;
    image: string | null;
    features: string[] | null;
    displayOrder: number;
}

export interface OccasionItem {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    displayOrder: number;
}

export interface TestimonialItem {
    id: number;
    customerName: string;
    rating: number;
    review: string;
    image: string | null;
    displayOrder: number;
}

export interface GalleryItem {
    id: number;
    image: string;
    altText: string;
    displayOrder: number;
}

export interface ContactSettings {
    id?: number;
    phone: string | null;
    email: string | null;
    address: string | null;
    mapEmbed: string | null;
}