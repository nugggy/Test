import { z } from "zod";

// A deliberately readable password rule rather than an arbitrary complexity
// regex: length is the strongest practical signal, and this is far easier
// for users with cognitive or literacy differences to satisfy correctly.
const password = z
  .string()
  .min(10, "Password must be at least 10 characters")
  .max(128, "Password is too long");

export const signUpSchema = z.object({
  fullName: z.string().trim().min(1, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email address").max(254),
  password,
  accountType: z.enum(["individual", "organisation"]),
  organisationName: z.string().trim().max(160).optional(),
});

export const signInSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").max(254),
  password: z.string().min(1, "Password is required").max(128),
});

export const createOrganisationSchema = z.object({
  name: z.string().trim().min(1, "Organisation name is required").max(160),
  abn: z
    .string()
    .trim()
    .regex(/^\d{11}$/, "ABN should be 11 digits")
    .optional()
    .or(z.literal("")),
});

export const toolSuggestionSchema = z.object({
  message: z.string().trim().min(1, "Tell us a bit about what you'd like").max(2000),
  contactEmail: z.string().trim().email("Enter a valid email address").max(254).optional().or(z.literal("")),
});

export const providerListingSchema = z.object({
  category: z.enum(["support-coordinator", "plan-manager", "support-provider", "allied-health"]),
  businessName: z.string().trim().min(1, "Business or practice name is required").max(160),
  contactName: z.string().trim().max(160).optional().or(z.literal("")),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  email: z.string().trim().email("Enter a valid email address").max(254).optional().or(z.literal("")),
  website: z.string().trim().max(300).optional().or(z.literal("")),
  state: z.enum(["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"]),
  serviceArea: z.string().trim().min(1, "Tell us where you provide services").max(200),
  specialties: z.array(z.string().trim().max(60)).max(10).optional().default([]),
  description: z.string().trim().max(1000).optional().or(z.literal("")),
});

export const recordFavouriteSchema = z.object({
  toolSlug: z.string().trim().min(1).max(80),
  deviceId: z.string().uuid(),
});

export const createParticipantSchema = z.object({
  displayName: z.string().trim().min(1, "Name is required").max(120),
  dateOfBirth: z.string().trim().max(10).optional().or(z.literal("")),
  notes: z.string().trim().max(2000).optional().or(z.literal("")),
  organisationId: z.string().uuid().optional().or(z.literal("")),
});
