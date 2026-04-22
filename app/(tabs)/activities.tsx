import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { ActivityCard } from "@/src/components/ActivityCard";
import { db } from "@/src/db/client";
import { activities, categories, trips } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { desc, eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";

// Shape of each activity row from joining activity, trip and category data
interface ActivityRow {
  id: number;
  title: string;
  date: string;
  metricType: string;
  metricValue: number;
  status: string;
  location: string | null;
  tripId: number;
  tripTitle: string;
  categoryName: string;
  categoryColour: string;
  categoryIcon: string;
}

// Trip options for filtering
interface TripOption {
  id: number;
  title: string;
}

// status filter options
const STATUS_FILTERS = [
  { value: "all", label: "All" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// 
export default function ActivitiesScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activityList, setActivityList] = useState<ActivityRow[]>([]); // Stores activities
  const [tripOptions, setTripOptions] = useState<TripOption[]>([]); // Stores trip filter options
  const [filterTrip, setFilterTrip] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Reloads trips and activities
  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        const t = await db // Loads users trips for filtering
          .select({ id: trips.id, title: trips.title })
          .from(trips)
          .where(eq(trips.userId, user.id))
          .orderBy(trips.title);
        setTripOptions(t);

        // loads activities and join them with trip and category data
        const rows = await db
          .select({
            id: activities.id,
            title: activities.title,
            date: activities.date,
            metricType: activities.metricType,
            metricValue: activities.metricValue,
            status: activities.status,
            location: activities.location,
            tripId: activities.tripId,
            tripTitle: trips.title,
            categoryName: categories.name,
            categoryColour: categories.colour,
            categoryIcon: categories.icon,
          })
          .from(activities)
          .innerJoin(trips, eq(activities.tripId, trips.id))
          .innerJoin(categories, eq(activities.categoryId, categories.id))
          .where(eq(trips.userId, user.id))
          .orderBy(desc(activities.date));

        setActivityList(rows);
      })();
    }, [user])
  );

  // Filters activities based on selected trip and status filters
  const filtered = activityList.filter((a) => {
    if (filterTrip && a.tripId !== filterTrip) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    return true;
  });

  // Confirmatio before deleting an activity
  const handleDelete = (item: ActivityRow) => {
    Alert.alert(
      "Delete Activity",
      `Are you sure you want to delete "${item.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.delete(activities).where(eq(activities.id, item.id));
            setActivityList((prev) => prev.filter((a)  => a.id !== item.id)); // Removes deleted item from local state
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      // Title and Add button
      <View style={styles.headerRow}>
        <AppHeader title="Activities" subtitle="Things to do on your trips" />
        <Pressable
          onPress={() => router.push("/activity/form")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color={colours.primary} />
        </Pressable>
      </View>

      // Filter section
      <View style={styles.filterSection}>
        // Trip filters
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilterTrip(null)}
            style={[
              styles.filterChip,
              !filterTrip && styles.filterChipActive,
            ]}
          >
            <Text
              style={[
                styles.filterChipText,
                !filterTrip && styles.filterChipTextActive,
              ]}
            >
              All Trips
            </Text>
          </Pressable>
          {tripOptions.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setFilterTrip(filterTrip === t.id ? null : t.id)}
              style={[
                styles.filterChip,
                filterTrip === t.id && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterTrip === t.id && styles.filterChipTextActive,
                ]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
            </Pressable>
          ))}
        </View>

        // Status filters
        <View style={styles.filterRow}>
          {STATUS_FILTERS.map((s) => (
            <Pressable
              key={s.value}
              onPress={() => setFilterStatus(s.value)}
              style={[
                styles.filterChip,
                filterStatus === s.value && styles.filterChipActive,
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterStatus === s.value && styles.filterChipTextActive,
                ]}
              >
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      // Empty state if no activities, or nor matches after filtering
      {filtered.length === 0 ? (
        <EmptyState
          icon="footsteps-outline"
          title={activityList.length === 0 ? "No activities yet" : "No matching activities"}
          message={
            activityList.length === 0
              ? "Create your first activity to start tracking."
              : "Try changing the filters above."
          }
        />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <ActivityCard
              title={item.title}
              date={item.date}
              metricType={item.metricType}
              metricValue={item.metricValue}
              status={item.status}
              location={item.location}
              tripTitle={item.tripTitle}
              categoryName={item.categoryName}
              categoryColour={item.categoryColour}
              categoryIcon={item.categoryIcon}
              onPress={() => router.push(`/activity/form?activityId=${item.id}`)}
              onLongPress={() => handleDelete(item)}
            />
          )}
        />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  addButton: {
    paddingTop: spacing.lg,
  },
  filterSection: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  filterChip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colours.border,
    backgroundColor: colours.surface,
  },
  filterChipActive: {
    backgroundColor: colours.primaryFaint,
    borderColor: colours.primary,
  },
  filterChipText: {
    ...typography.small,
    color: colours.textSecondary,
  },
  filterChipTextActive: {
    color: colours.primary,
    fontWeight: "600",
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing["3xl"],
  },
});