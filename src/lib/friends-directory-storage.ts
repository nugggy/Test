import { createContactDirectoryStorage } from "@/lib/contact-directory-storage";

export const FRIENDS_DIRECTORY_CATEGORIES = ["Family", "Friends", "Community / Neighbours"];

export const useFriendsDirectory = createContactDirectoryStorage("dt:friends-directory:v1");
