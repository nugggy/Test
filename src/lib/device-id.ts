const STORAGE_KEY = "dt:device-id:v1";

/**
 * A random id stored only in this browser's localStorage - not linked to
 * any account or personal information. Its only purpose is to stop a single
 * browser inflating a tool's public favourite count by favouriting it
 * repeatedly; see supabase/migrations/0003_tool_favourites.sql.
 */
export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  try {
    let id = window.localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = crypto.randomUUID();
      window.localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return "";
  }
}
