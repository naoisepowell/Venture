import { ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { trips } from "@/src/db/schema";
import { useTheme, type Colours, radii, shadows, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

// Display details of a specific trip
interface TripDetail {
  id: number;
  title: string;
  countryOrRegion: string;
  startDate: string;
  endDate: string;
  description: string | null;
  themeColour: string;
}

function formatDate(d: string): string {
  const date = new Date(d);
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colours } = useTheme();
  const styles = makeStyles(colours);
  const [trip, setTrip] = useState<TripDetail | null>(null);

  useFocusEffect(
    useCallback(() => {
      if (!id) return;

      (async () => {
        const rows = await db
          .select()
          .from(trips)
          .where(eq(trips.id, parseInt(id, 10)))
          .limit(1);

        if (rows.length > 0) {
          setTrip(rows[0]);
        }
      })();
    }, [id])
  );

  // Delete trip
  const handleDelete = () => {
    if (!trip) return;
    Alert.alert(
      "Delete Trip",
      `Are you sure you want to delete "${trip.title}"? This will also remove all activities linked to this trip.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.delete(trips).where(eq(trips.id, trip.id));
            router.back();
          },
        },
      ]
    );
  };

  if (!trip) {
    return (
      <ScreenContainer>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <Text style={styles.loadingText}>Loading...</Text>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <View style={styles.topBarActions}>
          <Pressable
            onPress={() => router.push(`/trip/form?tripId=${trip.id}`)}
            style={styles.iconButton}
          >
            <Ionicons name="create-outline" size={22} color={colours.textPrimary} />
          </Pressable>
          <Pressable onPress={handleDelete} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={22} color={colours.danger} />
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={[styles.colourBanner, { backgroundColor: trip.themeColour }]}>
          <Text style={styles.bannerTitle}>{trip.title}</Text>
          <View style={styles.bannerLocation}>
            <Ionicons name="location" size={16} color="rgba(255,255,255,0.85)" />
            <Text style={styles.bannerLocationText}>{trip.countryOrRegion}</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colours.textSecondary} />
            <View>
              <Text style={styles.infoLabel}>Start</Text>
              <Text style={styles.infoValue}>{formatDate(trip.startDate)}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={colours.textSecondary} />
            <View>
              <Text style={styles.infoLabel}>End</Text>
              <Text style={styles.infoValue}>{formatDate(trip.endDate)}</Text>
            </View>
          </View>
        </View>

        {trip.description ? (
          <View style={styles.descriptionCard}>
            <Text style={styles.descriptionLabel}>Notes</Text>
            <Text style={styles.descriptionText}>{trip.description}</Text>
          </View>
        ) : null}
      </ScrollView>
    </ScreenContainer>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
    },
    backButton: {
      paddingVertical: spacing.xs,
    },
    topBarActions: {
      flexDirection: "row",
      gap: spacing.base,
    },
    iconButton: {
      padding: spacing.xs,
    },
    loadingText: {
      ...typography.body,
      color: c.textSecondary,
      textAlign: "center",
      marginTop: spacing["2xl"],
    },
    scrollContent: {
      paddingBottom: spacing["3xl"],
    },
    colourBanner: {
      borderRadius: radii.lg,
      padding: spacing.xl,
      marginTop: spacing.sm,
      gap: spacing.sm,
    },
    bannerTitle: {
      ...typography.title,
      color: "#FFFFFF",
    },
    bannerLocation: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.xs,
    },
    bannerLocationText: {
      ...typography.captionMedium,
      color: "rgba(255,255,255,0.85)",
    },
    infoCard: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      marginTop: spacing.base,
      ...shadows.sm,
    },
    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
      paddingVertical: spacing.xs,
    },
    infoLabel: {
      ...typography.small,
      color: c.textTertiary,
    },
    infoValue: {
      ...typography.captionMedium,
      color: c.textPrimary,
    },
    divider: {
      height: 1,
      backgroundColor: c.divider,
      marginVertical: spacing.sm,
    },
    descriptionCard: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      marginTop: spacing.md,
      ...shadows.sm,
    },
    descriptionLabel: {
      ...typography.captionMedium,
      color: c.textSecondary,
      marginBottom: spacing.xs,
    },
    descriptionText: {
      ...typography.body,
      color: c.textPrimary,
      lineHeight: 24,
    },
  });
}
