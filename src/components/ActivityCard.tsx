import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Defines all data card needs to display an activity
interface ActivityCardProps {
  title: string;
  date: string;
  metricType: string;
  metricValue: number;
  status: string;
  location?: string | null;
  categoryName?: string;
  categoryColour?: string;
  categoryIcon?: string;
  tripTitle?: string;
  onPress: () => void;
  onLongPress?: () => void;
}

// formats date for display
function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

//changes status into a label and colour for better ui
function statusLabel(status: string): { text: string; colour: string } {
  switch (status) {
    case "completed":
      return { text: "Completed", colour: "#16A34A" };
    case "in_progress":
      return { text: "In Progress", colour: "#F59E0B" };
    case "cancelled":
      return { text: "Cancelled", colour: "#9CA3AF" };
    default:
      return { text: "Planned", colour: "#3B82F6" };
  }
}

//Displays activity card with its main details, status and optional category info
export function ActivityCard({
  title,
  date,
  metricType,
  metricValue,
  status,
  location,
  categoryName,
  categoryColour,
  categoryIcon,
  tripTitle,
  onPress,
  onLongPress,
}: ActivityCardProps) {
  const s = statusLabel(status);

  return (
    <Pressable
      onPress={onPress}
      onLongPress={onLongPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text style={styles.title} numberOfLines={1}>{title}</Text>
          {tripTitle ? (
            <Text style={styles.tripLabel} numberOfLines={1}>{tripTitle}</Text>
          ) : null}
        </View>
        <View style={[styles.statusBadge, { backgroundColor: s.colour + "18" }]}>
          <View style={[styles.statusDot, { backgroundColor: s.colour }]} />
          <Text style={[styles.statusText, { color: s.colour }]}>{s.text}</Text>
        </View>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Ionicons name="calendar-outline" size={13} color={colours.textTertiary} />
          <Text style={styles.detailText}>{formatDate(date)}</Text>
        </View>

        <View style={styles.detail}>
          <Ionicons name="speedometer-outline" size={13} color={colours.textTertiary} />
          <Text style={styles.detailText}>
            {metricValue} {metricType}
          </Text>
        </View>

        {location ? (
          <View style={styles.detail}>
            <Ionicons name="location-outline" size={13} color={colours.textTertiary} />
            <Text style={styles.detailText} numberOfLines={1}>{location}</Text>
          </View>
        ) : null}
      </View>

      {categoryName ? (
        <View style={styles.categoryRow}>
          <View style={[styles.categoryDot, { backgroundColor: categoryColour || colours.textTertiary }]} />
          <Ionicons
            name={(categoryIcon as keyof typeof Ionicons.glyphMap) || "pricetag-outline"}
            size={12}
            color={categoryColour || colours.textTertiary}
          />
          <Text style={styles.categoryText}>{categoryName}</Text>
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.base,
    gap: spacing.sm,
  },
  cardPressed: {
    backgroundColor: colours.primaryFaint,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: spacing.sm,
  },
  titleArea: {
    flex: 1,
    gap: 2,
  },
  title: {
    ...typography.bodyMedium,
    color: colours.textPrimary,
  },
  tripLabel: {
    ...typography.small,
    color: colours.textTertiary,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radii.full,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    ...typography.small,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  detail: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  detailText: {
    ...typography.small,
    color: colours.textSecondary,
  },
  categoryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryText: {
    ...typography.small,
    color: colours.textSecondary,
  },
});