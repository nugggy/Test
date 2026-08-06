"use server";

import { createClient } from "@/lib/supabase/server";
import { providerListingSchema } from "@/lib/validation";
import type { ProviderCategory, ProviderListing } from "@/lib/provider-directory-data";

export interface ProviderListingActionState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function submitProviderListing(
  _prevState: ProviderListingActionState,
  formData: FormData
): Promise<ProviderListingActionState> {
  const parsed = providerListingSchema.safeParse({
    category: formData.get("category"),
    businessName: formData.get("businessName"),
    contactName: formData.get("contactName") ?? "",
    phone: formData.get("phone") ?? "",
    email: formData.get("email") ?? "",
    website: formData.get("website") ?? "",
    state: formData.get("state"),
    serviceArea: formData.get("serviceArea"),
    specialties: formData.getAll("specialties"),
    description: formData.get("description") ?? "",
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      fieldErrors[String(issue.path[0])] = issue.message;
    }
    return { error: "Please fix the highlighted fields.", fieldErrors };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("provider_listings").insert({
    category: parsed.data.category,
    business_name: parsed.data.businessName,
    contact_name: parsed.data.contactName || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    website: parsed.data.website || null,
    state: parsed.data.state,
    service_area: parsed.data.serviceArea,
    specialties: parsed.data.specialties ?? [],
    description: parsed.data.description || null,
  });

  if (error) {
    return { error: "Something went wrong submitting your listing. Please try again." };
  }

  return { success: true };
}

export interface ProviderSearchFilters {
  category: ProviderCategory;
  state?: string;
  query?: string;
  specialty?: string;
}

/**
 * Only ever returns 'approved' listings - enforced by RLS regardless of
 * what this function does, but filtered explicitly here too for clarity.
 * Returns an empty list (rather than throwing) if Supabase isn't
 * configured/reachable, so search pages can show "no results" instead of
 * a broken page.
 */
export async function searchProviderListings(
  filters: ProviderSearchFilters
): Promise<ProviderListing[]> {
  try {
    const supabase = await createClient();
    let query = supabase
      .from("provider_listings")
      .select(
        "id, category, business_name, contact_name, phone, email, website, state, service_area, specialties, description"
      )
      .eq("category", filters.category)
      .eq("status", "approved")
      .order("created_at", { ascending: false })
      .limit(100);

    if (filters.state) {
      query = query.eq("state", filters.state);
    }
    if (filters.specialty) {
      query = query.contains("specialties", [filters.specialty]);
    }
    if (filters.query) {
      const like = `%${filters.query}%`;
      query = query.or(`business_name.ilike.${like},service_area.ilike.${like}`);
    }

    const { data, error } = await query;
    if (error || !data) return [];

    return data.map((row) => ({
      id: row.id,
      category: row.category,
      businessName: row.business_name,
      contactName: row.contact_name,
      phone: row.phone,
      email: row.email,
      website: row.website,
      state: row.state,
      serviceArea: row.service_area,
      specialties: row.specialties ?? [],
      description: row.description,
    }));
  } catch {
    return [];
  }
}
