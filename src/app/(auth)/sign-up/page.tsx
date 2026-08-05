"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { signUp, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function SignUpPage() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  const [accountType, setAccountType] = useState<"individual" | "organisation">(
    "individual"
  );

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold mb-2">Create an account</h1>
      <p className="text-muted mb-6">
        Accounts are only needed for tools that save information over time,
        like behaviour tracking or social stories. Most tools stay free to
        use with no account at all.
      </p>

      <form action={formAction} className="space-y-4">
        <fieldset>
          <legend className="font-semibold mb-2">This account is for</legend>
          <div className="grid grid-cols-2 gap-2">
            <label
              className={`touch-target flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 text-center font-semibold ${
                accountType === "individual"
                  ? "border-brand bg-brand/10"
                  : "border-border bg-surface"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value="individual"
                checked={accountType === "individual"}
                onChange={() => setAccountType("individual")}
                className="sr-only"
              />
              Myself / my family
            </label>
            <label
              className={`touch-target flex cursor-pointer items-center justify-center rounded-xl border-2 px-3 text-center font-semibold ${
                accountType === "organisation"
                  ? "border-brand bg-brand/10"
                  : "border-border bg-surface"
              }`}
            >
              <input
                type="radio"
                name="accountType"
                value="organisation"
                checked={accountType === "organisation"}
                onChange={() => setAccountType("organisation")}
                className="sr-only"
              />
              An organisation / provider
            </label>
          </div>
        </fieldset>

        <div>
          <label htmlFor="fullName" className="block font-semibold mb-1">
            Your name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            required
            autoComplete="name"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          {state.fieldErrors?.fullName && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.fullName}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block font-semibold mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          {state.fieldErrors?.email && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block font-semibold mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
          />
          <p className="mt-1 text-sm text-muted">At least 10 characters.</p>
          {state.fieldErrors?.password && (
            <p className="mt-1 text-sm text-red-700">{state.fieldErrors.password}</p>
          )}
        </div>

        {accountType === "organisation" && (
          <p className="rounded-xl border-2 border-border bg-surface p-3 text-sm text-muted">
            After you confirm your email you&apos;ll be asked to name your
            organisation and can then add staff and set up participant
            profiles.
          </p>
        )}

        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" required className="mt-1 h-5 w-5 shrink-0" />
          <span>
            I agree to the{" "}
            <Link href="/privacy" className="font-semibold text-brand hover:underline">
              Privacy Policy
            </Link>{" "}
            and understand these tools are not medical advice (see the{" "}
            <Link href="/disclaimer" className="font-semibold text-brand hover:underline">
              disclaimer
            </Link>
            ). If I add profiles for other people (like a participant I
            support), I confirm I&apos;m authorised to do so.
          </span>
        </label>

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
          {pending ? "Creating account…" : "Create account"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Already have an account?{" "}
        <Link href="/sign-in" className="font-semibold text-brand hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
