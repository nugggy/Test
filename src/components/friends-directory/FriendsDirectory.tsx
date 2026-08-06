"use client";

import { FRIENDS_DIRECTORY_CATEGORIES, useFriendsDirectory } from "@/lib/friends-directory-storage";
import ContactDirectory from "@/components/contacts/ContactDirectory";

export default function FriendsDirectory() {
  const directory = useFriendsDirectory();

  return (
    <ContactDirectory
      directory={directory}
      categories={FRIENDS_DIRECTORY_CATEGORIES}
      clearLabel="Clear the whole friends & family directory"
    />
  );
}
