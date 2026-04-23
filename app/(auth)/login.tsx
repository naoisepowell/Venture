import { useAuth } from "@/src/auth";
import { AppHeader, PrimaryButton, ScreenContainer } from "@/src/components";
import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { useRouter } from "expo-router";
import { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const { colours } = useTheme();
  const styles = makeStyles(colours);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // handles login process and sends user to dashboard
  const handleLogin = async () => {
    setLoading(true);
    setError("");

    try {
      await login(email, password);
      router.replace("/(tabs)/dashboard");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <AppHeader
        title="Welcome Back"
        subtitle="Sign in to continue your adventures"
      />

      <View style={styles.form}>
        {error ? <Text style={styles.error}>{error}</Text> : null}
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
            placeholder="Enter your password"
            placeholderTextColor={colours.textTertiary}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <PrimaryButton
          title="Sign In"
          onPress={handleLogin}
          loading={loading}
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

function makeStyles(c: Colours) {
  return StyleSheet.create({
    form: {
      marginTop: spacing.xl,
      gap: spacing.base,
    },
    inputGroup: {
      gap: spacing.xs,
    },
    label: {
      ...typography.captionMedium,
      color: c.textPrimary,
    },
    input: {
      height: 48,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      paddingHorizontal: spacing.base,
      ...typography.body,
      color: c.textPrimary,
      backgroundColor: c.surface,
    },
    button: {
      marginTop: spacing.sm,
    },
    footerText: {
      ...typography.caption,
      color: c.textSecondary,
      textAlign: "center",
      marginTop: spacing.md,
    },
    link: {
      color: c.primary,
      fontWeight: "600",
    },
    error: {
      ...typography.caption,
      color: c.danger,
      marginBottom: spacing.base,
    },
  });
}
