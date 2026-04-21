import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, AppHeader, PrimaryButton } from "@/src/components";
import { colours, typography, spacing, radii } from "@/src/theme";

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <AppHeader
        title="Create Account"
        subtitle="Start planning your next adventure"
      />

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colours.textTertiary}
            autoCapitalize="words"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="you@example.com"
            placeholderTextColor={colours.textTertiary}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colours.textTertiary}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title="Create Account"
          onPress={() => router.replace("/(tabs)/dashboard")}
          style={styles.button}
        />

        <Text style={styles.footerText}>
          Already have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/login")}
          >
            Sign In
          </Text>
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: spacing.xl,
    gap: spacing.base,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.captionMedium,
    color: colours.textPrimary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colours.textPrimary,
    backgroundColor: colours.surface,
  },
  button: {
    marginTop: spacing.sm,
  },
  footerText: {
    ...typography.caption,
    color: colours.textSecondary,
    textAlign: "center",
    marginTop: spacing.md,
  },
  link: {
    color: colours.primary,
    fontWeight: "600",
  },
});
