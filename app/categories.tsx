import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { colours, spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, StyleSheet } from "react-native";

export default function CategoriesScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
      </Pressable>

      <AppHeader
        title="Categories"
        subtitle="Organise your activities by type"
      />

      <EmptyState
        icon="pricetags-outline"
        title="No categories yet"
        message="Categories will help you organise and filter your travel activities."
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
