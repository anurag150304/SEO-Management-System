import type {
  CreateContactSettingsInput,
  UpdateContactSettingsInput,
} from "@repo/zod-validations";
import type { ContactResponse } from "@/types";
import { apiClient, handleAxiosError } from "./api/client";

export * from "@/types/contact.type";

export const contactClient = {
  getContact: async (id?: number): Promise<ContactResponse> => {
    try {
      const url = id ? `/contact/${id}` : "/contact";
      const res = await apiClient.get<ContactResponse>(url);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  createContact: async (
    payload: CreateContactSettingsInput,
  ): Promise<ContactResponse> => {
    try {
      const res = await apiClient.post<ContactResponse>("/contact", payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },

  updateContact: async (
    payload: UpdateContactSettingsInput,
    id?: number,
  ): Promise<ContactResponse> => {
    try {
      const url = id ? `/contact/${id}` : "/contact";
      const res = await apiClient.put<ContactResponse>(url, payload);
      return res.data;
    } catch (err) {
      throw handleAxiosError(err);
    }
  },
};
