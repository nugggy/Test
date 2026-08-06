"use client";

import { useActionState } from "react";
import Link from "next/link";
import { submitToolSuggestion, type SuggestionActionState } from "./actions";

const initialState: SuggestionActionState = {};

export default function SuggestionsPage() {
  const [state, formAction, pending] = useActionState(submitToolSuggestion, initialState);

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:py-14">
      <nav className="mb-4 text-sm">
        <Link href="/" className="font-semibold text-brand hover:underline">
          ← All tools
        </Link>
      </nav>
      <h1 className="font-display mb-2 text-3xl font-bold">Suggest a tool</h1>
      <p className="mb-6 text-muted">
        Is there a tool that would make your life, or the life of someone you
        support, easier? Tell us about it - every suggestion is read by a
        real person, and this list directly shapes what gets built next.
      </p>

      {state.success ? (
        <div
          role="status"
          className="rounded-2xl border-2 border-brand bg-brand/10 p-4"
        >
          <p className="font-semibold">Thanks - your suggestion has been sent!</p>
          <p className="mt-1 text-sm text-muted">
            If you left an email address, we&apos;ll try to let you know if
            we&apos;re able to build it. That said, replying isn&apos;t
            automatic - it depends on someone here following up by hand.
          </p>
          <Link
            href="/suggestions"
            className="mt-3 inline-block font-semibold text-brand hover:underline"
          >
            Suggest another tool
          </Link>
        </div>
      ) : (
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="message" className="mb-1 block font-semibold">
              What tool would help you?
            </label>
            <p className="mb-2 text-sm text-muted">
              Describe what it would do and who it&apos;s for - as much or as
              little detail as you like.
            </p>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              maxLength={2000}
              placeholder="e.g. Something to help plan a trip on public transport, step by step, with pictures."
              className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-base touch-target"
            />
            {state.fieldErrors?.message && (
              <p className="mt-1 text-sm text-red-700">{state.fieldErrors.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contactEmail" className="mb-1 block font-semibold">
              Your email (optional)
            </label>
            <p className="mb-2 text-sm text-muted">
              Only if you&apos;d like to hear back if we&apos;re able to build
              it. We&apos;ll never use this for anything else.
            </p>
            <input
              id="contactEmail"
              name="contactEmail"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-base touch-target"
            />
            {state.fieldErrors?.contactEmail && (
              <p className="mt-1 text-sm text-red-700">{state.fieldErrors.contactEmail}</p>
            )}
          </div>

          {state.error && (
            <p role="alert" className="rounded-xl border-2 border-red-200 bg-red-50 p-3 text-red-800">
              {state.error}
            </p>
          )}

          <button
            type="submit"
            disabled={pending}
            className="touch-target w-full rounded-xl border-2 border-brand bg-brand font-semibold text-brand-ink disabled:opacity-60"
          >
            {pending ? "Sending…" : "Send suggestion"}
          </button>
        </form>
      )}
    </div>
  );
}
