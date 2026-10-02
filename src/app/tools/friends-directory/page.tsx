import type { Metadata } from "next";
import ToolHero from "@/components/ToolHero";
import FriendsDirectory from "@/components/friends-directory/FriendsDirectory";
import MedicalDisclaimerBanner from "@/components/MedicalDisclaimerBanner";
import HowToUse from "@/components/HowToUse";
import PrintHeader from "@/components/PrintHeader";
import AddToHomeScreen from "@/components/AddToHomeScreen";

export const metadata: Metadata = {
  title: "My Friends Directory - My Support Buddy",
  description:
    "Keep family, friends and community contacts in one place, with phone, email and notes for each. Printable.",
};

export default function FriendsDirectoryPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      <PrintHeader title="My Friends Directory" />
      <ToolHero slug="friends-directory" title="My Friends Directory">
        <p>
        Family, friends and community contacts in one place - so you always
        know how to reach the people who matter to you.
        </p>
      </ToolHero>
      <HowToUse
        steps={[
          "Tap '+ Add' under Family, Friends, or Community/Neighbours.",
          "Fill in a name, phone, email and any notes.",
          "Add as many contacts as you like in each category.",
          "Print the whole directory to keep a copy.",
        ]}
      />
      <MedicalDisclaimerBanner />
      <AddToHomeScreen />
      <FriendsDirectory />
    </div>
  );
}
