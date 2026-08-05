"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn, type AuthActionState } from "@/app/(auth)/actions";

const initialState: AuthActionState = {};

export default function SignInPage() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/account";

  return (
    <div className="mx-auto max-w-md px-4 py-10 sm:py-14">
      <h1 className="font-display text-3xl font-bold mb-6">Sign in</h1>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="next" value={next} />

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
            autoComplete="current-password"
            className="w-full rounded-xl border-2 border-border bg-surface px-4 py-3 text-lg touch-target"
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
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        Need an account?{" "}
        <Link href="/sign-up" className="font-semibold text-brand hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}
