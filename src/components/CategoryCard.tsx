import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Defines the info needed to show each category card
interface CategoryCardProps {
  name: string;
  colour: string;
  icon: string;
  onPress: () => void;
  onLongPress?: () => void;
}

// Displays single category with icon, name and press actions
export function CategoryCard({ name, colour, icon, onPress, onLongPress }: CategoryCardProps) {
  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: colour }]}>
        <Ionicons
          name={(icon as keyof typeof Ionicons.glyphMap) || "pricetag"}
          size={20}
          color="#FFFFFF"
        />
      </View>
      <Text style={styles.name} numberOfLines={1}>{name}</Text>
      <Ionicons name="chevron-forward" size={18} color={colours.textTertiary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  cardPressed: {
    backgroundColor: colours.primaryFaint,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    ...typography.bodyMedium,
    color: colours.textPrimary,
    flex: 1,
  },
});