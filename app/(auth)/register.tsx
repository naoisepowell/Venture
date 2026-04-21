import { useAuth } from "@/src/auth";
import { AppHeader, PrimaryButton, ScreenContainer } from "@/src/components";
import { colours, radii, spacing, typography } from "@/src/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";


// registration screen for new users to create an account and access the app's features
export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // handles registration process and sends user to dashboard
  const handleRegister = async () => {
    setLoading(true);
    setError("");
    try {
      await register(name, email, password);
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // renders the registration form with input fields for name, email, and password, along with a button to submit the form and a link to the login screen for existing users
  return (
    <ScreenContainer>
      <AppHeader
        title="Create Account"
        subtitle="Start planning your next adventure"
      />

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            placeholderTextColor={colours.textTertiary}
            autoCapitalize="words"
            value={name}
            onChangeText={setName}
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
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor={colours.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton
          title="Create Account"
          onPress={handleRegister}
          loading={loading}
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
  error: {
    ...typography.caption,
    color: colours.danger,
    marginBottom: spacing.base,
  },
});
