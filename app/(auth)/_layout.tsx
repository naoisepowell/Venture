import { Redirect, Stack } from 'expo-router';

import { useSession } from '@/hooks/use-session';

export default function AuthLayout() {
  const { session } = useSession();

  if (session) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="sign-in" />
    </Stack>
  );
}
