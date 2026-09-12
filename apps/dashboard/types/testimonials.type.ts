import type { TestimonialRecord } from "@repo/db-config";

export interface TestimonialsListResponse {
  message: string;
  count: number;
  testimonials: TestimonialRecord[];
}

export interface TestimonialSingleResponse {
  message: string;
  testimonial: TestimonialRecord;
}

export interface TestimonialDeleteResponse {
  message: string;
  testimonialId: number;
}

export interface TestimonialReorderResponse {
  message: string;
  testimonial?: TestimonialRecord;
  testimonials?: TestimonialRecord[];
}
