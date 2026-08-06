"use client";

import { useActionState } from "react";
import {
  ALLIED_HEALTH_SPECIALTIES,
  AU_STATES,
  type ProviderCategoryInfo,
} from "@/lib/provider-directory-data";
import {
  submitProviderListing,
  type ProviderListingActionState,
} from "@/app/actions/provider-directory";

interface ProviderSubmissionFormProps {
  categoryInfo: ProviderCategoryInfo;
}

const initialState: ProviderListingActionState = {};

export default function ProviderSubmissionForm({ categoryInfo }: ProviderSubmissionFormProps) {
  const [state, formAction, pending] = useActionState(submitProviderListing, initialState);

  if (state.success) {
    return (
      <div role="status" className="rounded-2xl border-2 border-brand bg-brand/10 p-4">
        <p className="font-semibold">Thanks - your listing has been submitted!</p>
        <p className="mt-1 text-sm text-muted">
          It will appear in search results once it&apos;s been reviewed and
          approved. This is done by hand, so it may take a little while.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="category" value={categoryInfo.category} />

      <p className="rounded-xl border-2 border-accent bg-accent/10 px-4 py-3 text-sm">
        Listings are submitted directly by providers and are{" "}
        <strong>not verified or vetted</strong> by this Toolkit. Only submit
        accurate information about a real, currently operating service.
      </p>

      <div>
        <label htmlFor="businessName" className="mb-1 block font-semibold">
          Business or practice name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          required
          maxLength={160}
          className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
        />
        {state.fieldErrors?.businessName && (
          <p className="mt-1 text-sm text-red-700">{state.fieldErrors.businessName}</p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="contactName" className="mb-1 block font-semibold">
            Contact name (optional)
          </label>
          <input
            id="contactName"
            name="contactName"
            type="text"
            maxLength={160}
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1 block font-semibold">
            Phone (optional)
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            maxLength={40}
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          />
        </div>
        <div>
          <label htmlFor="email" className="mb-1 block font-semibold">
            Email (optional)
          </label>
          <input
            id="email"
            name="email"
            type="email"
            maxLength={254}
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.email}</p>
          )}
        </div>
        <div>
          <label htmlFor="website" className="mb-1 block font-semibold">
            Website (optional)
          </label>
          <input
            id="website"
            name="website"
            type="text"
            maxLength={300}
            placeholder="e.g. yourbusiness.com.au"
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          />
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="state" className="mb-1 block font-semibold">
            State
          </label>
          <select
            id="state"
            name="state"
            required
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          >
            {AU_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="serviceArea" className="mb-1 block font-semibold">
            Service area
          </label>
          <input
            id="serviceArea"
            name="serviceArea"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. Greater Melbourne, or statewide"
            className="w-full touch-target rounded-xl border-2 border-border bg-surface px-4 py-3 text-base"
          />
          {state.fieldErrors?.serviceArea && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.serviceArea}</p>
          )}
        </div>
      </div>

      {categoryInfo.category === "allied-health" && (
        <fieldset>
          <legend className="mb-2 block font-semibold">Specialty areas</legend>
          <div className="flex flex-wrap gap-2">
            {ALLIED_HEALTH_SPECIALTIES.map((specialty) => (
              <label
                key={specialty}
                className="touch-target flex cursor-pointer items-center gap-2 rounded-xl border-2 border-border bg-surface px-3 text-sm font-semibold has-[:checked]:border-brand has-[:checked]:bg-brand/10"
              >
                <input type="checkbox" name="specialties" value={specialty} className="h-5 w-5" />
                {specialty}
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div>
        <label htmlFor="description" className="mb-1 block font-semibold">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          maxLength={1000}
          placeholder="A short description of your service"
          className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-base touch-target"
        />
      </div>

      {state.error && (
        <p role="alert" className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-red-800">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-60 sm:w-auto sm:px-8"
      >
        {pending ? "Submitting…" : "Submit listing"}
      </button>
    </form>
  );
}
