import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

export default function SignInScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Welcome to Venture</ThemedText>
      <ThemedText>Sign-in UI goes here.</ThemedText>
      <ThemedText type="defaultSemiBold" style={styles.hint}>
        Stub: set session to a non-null value in hooks/use-session.ts to skip this screen.
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 32,
  },
  hint: {
    textAlign: 'center',
    opacity: 0.5,
    fontSize: 13,
  },
});
