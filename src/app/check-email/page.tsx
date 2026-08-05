import Link from "next/link";

export default function CheckEmailPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-14 text-center">
      <span aria-hidden="true" className="text-5xl">📧</span>
      <h1 className="font-display mt-4 text-2xl font-bold">Check your email</h1>
      <p className="mt-2 text-muted">
        We&apos;ve sent a confirmation link to your email address. Click it to
        finish setting up your account, then come back and sign in.
      </p>
      <Link
        href="/sign-in"
        className="mt-6 inline-block font-semibold text-brand hover:underline"
      >
        Go to sign in
      </Link>
    </div>
  );
}
