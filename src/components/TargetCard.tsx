import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

// Defines info needed to display one target card
interface TargetCardProps {
  periodType: string;
  targetMetricType: string;
  targetValue: number;
  currentValue: number;
  tripTitle?: string | null;
  categoryName?: string | null;
  categoryColour?: string | null;
  onPress: () => void;
  onLongPress?: () => void;
}

// Works out current target status based on progress
function getStatus(current: number, target: number): {
  label: string;
  colour: string;
  icon: keyof typeof Ionicons.glyphMap;
} {
  const ratio = target > 0 ? current / target : 0;
  if (ratio >= 1.2) {
    return { label: "Exceeded", colour: "#7C3AED", icon: "trophy" };
  }
  if (ratio >= 1) {
    return { label: "Met", colour: "#16A34A", icon: "checkmark-circle" };
  }
  if (ratio >= 0.5) {
    return { label: "In Progress", colour: "#F59E0B", icon: "time" };
  }
  return { label: "Unmet", colour: "#DC2626", icon: "alert-circle" };
}

// Displays a card showing target, progress and the linked trip or category
export function TargetCard({
  periodType,
  targetMetricType,
  targetValue,
  currentValue,
  tripTitle,
  categoryName,
  categoryColour,
  onPress,
  onLongPress,
}: TargetCardProps) {
  const { colours } = useTheme();
  const styles = makeStyles(colours);
  const remaining = Math.max(0, targetValue - currentValue); // How much is left to get target
  const progress = targetValue > 0 ? Math.min(currentValue / targetValue, 1) : 0; // Progress as value between 0 and 1
  const status = getStatus(currentValue, targetValue); // Current status details for the target

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
          <Text style={styles.metricLabel}>
            {targetValue} {targetMetricType}
          </Text>
          <Text style={styles.periodLabel}>
            {periodType === "weekly" ? "Per Week" : "Per Month"}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.colour + "18" }]}>
          <Ionicons name={status.icon} size={14} color={status.colour} />
          <Text style={[styles.statusText, { color: status.colour }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${Math.round(progress * 100)}%`,
              backgroundColor: status.colour,
            },
          ]}
        />
      </View>

      <View style={styles.statsRow}>
        <Text style={styles.statText}>
          {currentValue} / {targetValue} {targetMetricType}
        </Text>
        {remaining > 0 ? (
          <Text style={styles.remainingText}>
            {remaining} remaining
          </Text>
        ) : (
          <Text style={[styles.remainingText, { color: status.colour }]}>
            Target reached
          </Text>
        )}
      </View>

      {(tripTitle || categoryName) ? (
        <View style={styles.tagsRow}>
          {tripTitle ? (
            <View style={styles.tag}>
              <Ionicons name="airplane-outline" size={12} color={colours.textTertiary} />
              <Text style={styles.tagText}>{tripTitle}</Text>
            </View>
          ) : null}
          {categoryName ? (
            <View style={styles.tag}>
              <View style={[styles.catDot, { backgroundColor: categoryColour || colours.textTertiary }]} />
              <Text style={styles.tagText}>{categoryName}</Text>
            </View>
          ) : null}
        </View>
      ) : null}
    </Pressable>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      gap: spacing.sm,
    },
    cardPressed: {
      backgroundColor: c.primaryFaint,
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
    metricLabel: {
      ...typography.bodyMedium,
      color: c.textPrimary,
    },
    periodLabel: {
      ...typography.small,
      color: c.textTertiary,
    },
    statusBadge: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: 3,
      borderRadius: radii.full,
    },
    statusText: {
      ...typography.small,
      fontWeight: "600",
    },
    progressBarBg: {
      height: 6,
      borderRadius: 3,
      backgroundColor: c.borderLight,
      overflow: "hidden",
    },
    progressBarFill: {
      height: 6,
      borderRadius: 3,
    },
    statsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    statText: {
      ...typography.small,
      color: c.textSecondary,
    },
    remainingText: {
      ...typography.small,
      color: c.textTertiary,
    },
    tagsRow: {
      flexDirection: "row",
      gap: spacing.md,
    },
    tag: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    tagText: {
      ...typography.small,
      color: c.textTertiary,
    },
    catDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
    },
  });
}
