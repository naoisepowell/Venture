import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ScreenContainer, PrimaryButton } from "@/src/components";
import { useTheme, type Colours, typography, spacing } from "@/src/theme";

export default function WelcomeScreen() {
  const router = useRouter();
  const { colours } = useTheme();
  const styles = makeStyles(colours);

  return (
    <ScreenContainer>
      <View style={styles.content}>
        <View style={styles.brandArea}>
          <View style={styles.iconCircle}>
            <Ionicons name="compass" size={40} color={colours.textInverse} />
          </View>
          <Text style={styles.appName}>Venture</Text>
          <Text style={styles.tagline}>
            Plan trips, track activities, and discover insights about the way
            you travel.
          </Text>
        </View>

        <View style={styles.actions}>
          <PrimaryButton
            title="Get Started"
            onPress={() => router.push("/(auth)/register")}
          />
          <PrimaryButton
            title="I Already Have an Account"
            variant="outline"
            onPress={() => router.push("/(auth)/login")}
            style={styles.secondaryButton}
          />
        </View>
      </View>
    </ScreenContainer>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    content: {
      flex: 1,
      justifyContent: "space-between",
      paddingBottom: spacing["2xl"],
    },
    brandArea: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    iconCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.primary,
      alignItems: "center",
      justifyContent: "center",
      marginBottom: spacing.xl,
    },
    appName: {
      ...typography.largeTitle,
      fontSize: 34,
      color: c.textPrimary,
      marginBottom: spacing.md,
    },
    tagline: {
      ...typography.body,
      color: c.textSecondary,
      textAlign: "center",
      paddingHorizontal: spacing["2xl"],
      lineHeight: 24,
    },
    actions: {
      gap: spacing.md,
    },
    secondaryButton: {
      marginTop: 0,
    },
  });
}
