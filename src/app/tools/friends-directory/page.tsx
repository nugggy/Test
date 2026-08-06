import type { Metadata } from "next";
import Link from "next/link";
import FriendsDirectory from "@/components/friends-directory/FriendsDirectory";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import AlliedHealthCallout from "@/components/AlliedHealthCallout";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import FavouriteToggleButton from "@/components/FavouriteToggleButton";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "My Friends Directory — Toolkit",
  description:
    "Keep family, friends and community contacts in one place, with phone, email and notes for each. Printable.",
};

export default function FriendsDirectoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <nav className="no-print mb-4">
        <Link
          href="/"
          className="touch-target inline-flex items-center gap-1.5 rounded-xl border-2 border-border bg-surface px-4 text-base font-semibold text-brand hover:border-brand"
        >
          ← All tools
        </Link>
      </nav>
      <PrintHeader title="My Friends Directory" />
      <h1 className="font-display mb-1 text-2xl sm:text-3xl font-bold">
        My Friends Directory
      </h1>
      <FavouriteToggleButton slug="friends-directory" />
      <p className="no-print mb-6 max-w-2xl text-muted">
        Family, friends and community contacts in one place — so you always
        know how to reach the people who matter to you.
      </p>
      <HowToUse
        steps={[
          "Tap '+ Add' under Family, Friends, or Community/Neighbours.",
          "Fill in a name, phone, email and any notes.",
          "Add as many contacts as you like in each category.",
          "Print the whole directory to keep a copy.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AlliedHealthCallout />
      <AddToHomeScreen />
      <FriendsDirectory />
    </div>
  );
}
