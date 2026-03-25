/**
 * Stub session hook.
 * Set `session` to a non-null string to simulate an authenticated user,
 * or leave it as `null` to test the unauthenticated (auth stack) flow.
 *
 * Replace this with a real auth implementation (e.g. expo-secure-store +
 * an API call) when building out the auth feature.
 */
export function useSession() {
  const session: string | null = null;
  return { session };
}
