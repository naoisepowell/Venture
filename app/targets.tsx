import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { colours, spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

// targets screen for users to set and manage their travel goals and milestones
export default function TargetsScreen() {
  const router = useRouter();

  // Render targets screen with header and empty state
  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
      </Pressable>

      <AppHeader
        title="Targets"
        subtitle="Set goals for your travels"
      />

      <EmptyState
        icon="flag-outline"
        title="No targets yet"
        message="Set travel targets to track your progress and stay motivated."
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  backButton: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xs,
    alignSelf: "flex-start",
  },
});