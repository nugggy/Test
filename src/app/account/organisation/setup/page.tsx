"use client";

import { useActionState } from "react";
import { createOrganisation } from "@/app/account/actions";
import type { ActionState } from "@/app/account/actions";

const initialState: ActionState = {};

export default function OrganisationSetupPage() {
  const [state, formAction, pending] = useActionState(
    createOrganisation,
    initialState
  );

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold mb-2">
        Set up your organisation
      </h1>
      <p className="text-muted mb-6">
        This is the name your staff and participants will see. You can add
        staff and participant profiles afterwards.
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block font-semibold mb-1">
            Organisation name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          {state.fieldErrors?.name && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="abn" className="block font-semibold mb-1">
            ABN <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id="abn"
            name="abn"
            type="text"
            inputMode="numeric"
            placeholder="11 digits"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          {state.fieldErrors?.abn && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.abn}</p>
          )}
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
          {pending ? "Setting up…" : "Create organisation"}
        </button>
      </form>
    </div>
  );
}
