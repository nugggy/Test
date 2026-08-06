import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "@/app/(auth)/actions";
import type {
  Organisation,
  OrganisationMember,
  Participant,
  Profile,
} from "@/lib/types/database";

export default async function AccountPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const [{ data: profile }, { data: memberships }, { data: participants }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).single<Profile>(),
      supabase
        .from("organisation_members")
        .select("*, organisations(*)")
        .eq("profile_id", user.id) as unknown as Promise<{
        data: (OrganisationMember & { organisations: Organisation })[] | null;
      }>,
      supabase
        .from("participants")
        .select("*")
        .order("created_at", { ascending: false }) as unknown as Promise<{
        data: Participant[] | null;
      }>,
    ]);

  const needsOrgSetup =
    profile?.account_type === "organisation" &&
    (!memberships || memberships.length === 0);

  if (needsOrgSetup) {
    redirect("/account/organisation/setup");
  }

  const primaryOrgId = memberships?.[0]?.organisation_id ?? "";

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold">
            Hi {profile?.full_name ?? "there"}
          </h1>
          <p className="text-muted">{user.email}</p>
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="touch-target rounded-xl border-2 border-border bg-surface px-4 font-semibold hover:border-brand"
          >
            Sign out
          </button>
        </form>
      </div>

      {memberships && memberships.length > 0 && (
        <section className="mb-8">
          <h2 className="font-display text-xl font-bold mb-3">
            Your organisation{memberships.length > 1 ? "s" : ""}
          </h2>
          <ul className="space-y-2">
            {memberships.map((m) => (
              <li
                key={m.id}
                className="rounded-xl border-2 border-border bg-surface p-4"
              >
                <p className="font-semibold">{m.organisations.name}</p>
                <p className="text-sm text-muted capitalize">
                  Your role: {m.role}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Participants</h2>
          <Link
            href={
              primaryOrgId
                ? `/account/participants/new?org=${primaryOrgId}`
                : "/account/participants/new"
            }
            className="touch-target flex items-center gap-2 rounded-xl border-2 border-brand bg-brand px-4 font-semibold text-brand-ink"
          >
            ➕ Add participant
          </Link>
        </div>

        {!participants || participants.length === 0 ? (
          <p className="rounded-xl border-2 border-dashed border-border p-6 text-center text-muted">
            No participant profiles yet. Add one to start using tools like
            behaviour tracking or social stories for them.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {participants.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border-2 border-border bg-surface p-4"
              >
                <p className="font-semibold">{p.display_name}</p>
                {p.date_of_birth && (
                  <p className="text-sm text-muted">DOB: {p.date_of_birth}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
