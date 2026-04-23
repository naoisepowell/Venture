import { useTheme, type Colours, radii, shadows, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

// TripCard component to display a summary of a trip in the trips list, with title, location, dates and optional description
interface TripCardProps {
  title: string;
  countryOrRegion: string;
  startDate: string;
  endDate: string;
  description?: string | null;
  themeColour: string;
  onPress: () => void;
}

//Formats dates for display
function formatDateRange(start: string, end: string): string {
  const fmt = (d: string) => {
    const date = new Date(d);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };
  return `${fmt(start)} — ${fmt(end)}`;
}

//Display card summarising trip details
export function TripCard({
  title,
  countryOrRegion,
  startDate,
  endDate,
  description,
  themeColour,
  onPress,
}: TripCardProps) {
  const { colours } = useTheme();
  const styles = makeStyles(colours);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        pressed && styles.cardPressed,
      ]}
    >
      <View style={[styles.accent, { backgroundColor: themeColour }]} />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Ionicons name="chevron-forward" size={18} color={colours.textTertiary} />
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={14} color={colours.textSecondary} />
          <Text style={styles.location} numberOfLines={1}>
            {countryOrRegion}
          </Text>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={14} color={colours.textSecondary} />
          <Text style={styles.dates}>{formatDateRange(startDate, endDate)}</Text>
        </View>

        {description ? (
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    card: {
      flexDirection: "row",
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      overflow: "hidden",
      ...shadows.sm,
    },
    cardPressed: {
      backgroundColor: c.primaryFaint,
    },
    accent: {
      width: 5,
    },
    content: {
      flex: 1,
      padding: spacing.base,
      gap: spacing.xs,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    title: {
      ...typography.bodyMedium,
      color: c.textPrimary,
      flex: 1,
      marginRight: spacing.sm,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    location: {
      ...typography.caption,
      color: c.textSecondary,
    },
    dateRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    dates: {
      ...typography.small,
      color: c.textTertiary,
    },
    description: {
      ...typography.caption,
      color: c.textSecondary,
      marginTop: spacing.xs,
    },
  });
}
