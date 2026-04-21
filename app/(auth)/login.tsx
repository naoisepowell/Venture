import { StyleSheet, Text, TextInput, View } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer, AppHeader, PrimaryButton } from "@/src/components";
import { colours, typography, spacing, radii } from "@/src/theme";

export default function LoginScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <AppHeader
        title="Welcome Back"
        subtitle="Sign in to continue your adventures"
      />

      <View style={styles.form}>
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
            placeholder="Enter your password"
            placeholderTextColor={colours.textTertiary}
            secureTextEntry
          />
        </View>

        <PrimaryButton
          title="Sign In"
          onPress={() => router.replace("/(tabs)/dashboard")}
          style={styles.button}
        />

        <Text style={styles.footerText}>
          Don&apos;t have an account?{" "}
          <Text
            style={styles.link}
            onPress={() => router.push("/(auth)/register")}
          >
            Register
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
