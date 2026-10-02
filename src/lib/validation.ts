import { z } from "zod";

export const toolSuggestionSchema = z.object({
  message: z.string().trim().min(1, "Tell us a bit about what you'd like").max(2000),
  contactEmail: z.string().trim().email("Enter a valid email address").max(254).optional().or(z.literal("")),
});

export const recordFavouriteSchema = z.object({
  toolSlug: z.string().trim().min(1).max(80),
  deviceId: z.string().uuid(),
});

