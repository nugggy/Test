"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { createParticipant } from "@/app/account/actions";
import type { ActionState } from "@/app/account/actions";

const initialState: ActionState = {};

export default function NewParticipantPage() {
  const [state, formAction, pending] = useActionState(
    createParticipant,
    initialState
  );
  const searchParams = useSearchParams();
  const orgId = searchParams.get("org") ?? "";

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Add a participant</h1>
      <p className="text-muted mb-6">
        This creates a profile so you can use tools like behaviour tracking
        or social stories for them over time. They don&apos;t need their own
        login — {orgId ? "your organisation" : "you"} will manage their
        information.
      </p>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="organisationId" value={orgId} />

        <div>
          <label htmlFor="displayName" className="block font-semibold mb-1">
            Name
          </label>
          <input
            id="displayName"
            name="displayName"
            type="text"
            required
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          {state.fieldErrors?.displayName && (
            <p className="mt-1 text-sm text-red-700">
              {state.fieldErrors.displayName}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="dateOfBirth" className="block font-semibold mb-1">
            Date of birth <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block font-semibold mb-1">
            Notes <span className="font-normal text-muted">(optional)</span>
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={4}
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg"
          />
        </div>

        {state.error && (
          <p role="alert" className="rounded-xl bg-red-50 border-2 border-red-200 p-3 text-red-800">
            {state.error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-60"
        >
          {pending ? "Saving…" : "Add participant"}
        </button>
      </form>
    </div>
  );
}
