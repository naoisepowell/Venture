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
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

// Shape of each activity row from joining activity, trip and category data
interface ActivityRow {
  id: number;
  title: string;
  date: string;
  metricType: string;
  metricValue: number;
  status: string;
  location: string | null;
  notes: string | null;
  tripId: number;
  tripTitle: string;
  categoryId: number;
  categoryName: string;
  categoryColour: string;
  categoryIcon: string;
}

// Trip options for filtering
interface TripOption {
  id: number;
  title: string;
}

// Category options for filtering
interface CategoryOption {
  id: number;
  name: string;
  colour: string;
}

// Status filter options
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
  const [categoryOptions, setCategoryOptions] = useState<CategoryOption[]>([]); // Stores category filter options

  // Search and filter state
  const [searchText, setSearchText] = useState("");
  const [filterTrip, setFilterTrip] = useState<number | null>(null);
  const [filterCategory, setFilterCategory] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");

  // Checks if any filter is currently active
  const hasActiveFilters =
    searchText !== "" ||
    filterTrip !== null ||
    filterCategory !== null ||
    filterStatus !== "all";

  // Resets all filters and search back to defaults
  const clearFilters = () => {
    setSearchText("");
    setFilterTrip(null);
    setFilterCategory(null);
    setFilterStatus("all");
  };

  // Reloads trips, categories and activities
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

        const c = await db // Loads users categories for filtering
          .select({ id: categories.id, name: categories.name, colour: categories.colour })
          .from(categories)
          .where(eq(categories.userId, user.id))
          .orderBy(categories.name);
        setCategoryOptions(c);

        // Loads activities and joins them with trip and category data
        const rows = await db
          .select({
            id: activities.id,
            title: activities.title,
            date: activities.date,
            metricType: activities.metricType,
            metricValue: activities.metricValue,
            status: activities.status,
            location: activities.location,
            notes: activities.notes,
            tripId: activities.tripId,
            tripTitle: trips.title,
            categoryId: activities.categoryId,
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

  // Filters activities based on search text, trip, category and status
  const filtered = activityList.filter((a) => {
    if (filterTrip && a.tripId !== filterTrip) return false;
    if (filterCategory && a.categoryId !== filterCategory) return false;
    if (filterStatus !== "all" && a.status !== filterStatus) return false;

    // Text search matches against title, notes and location
    if (searchText.trim()) {
      const q = searchText.trim().toLowerCase();
      const matchesTitle = a.title.toLowerCase().includes(q);
      const matchesNotes = a.notes?.toLowerCase().includes(q) ?? false;
      const matchesLocation = a.location?.toLowerCase().includes(q) ?? false;
      if (!matchesTitle && !matchesNotes && !matchesLocation) return false;
    }

    return true;
  });

  // Confirmation before deleting an activity
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
            setActivityList((prev) => prev.filter((a) => a.id !== item.id)); // Removes deleted item from local state
          },
        },
      ]
    );
  };

  return (
    <ScreenContainer>
      {/* Title and Add button */}
      <View style={styles.headerRow}>
        <AppHeader title="Activities" subtitle="Things to do on your trips" />
        <Pressable
          onPress={() => router.push("/activity/form")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color={colours.primary} />
        </Pressable>
      </View>

      {/* Search bar */}
      <View style={styles.searchRow}>
        <Ionicons name="search-outline" size={18} color={colours.textTertiary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
          placeholderTextColor={colours.textTertiary}
          value={searchText}
          onChangeText={setSearchText}
          autoCapitalize="none"
        />
        {searchText !== "" ? (
          <Pressable onPress={() => setSearchText("")}>
            <Ionicons name="close-circle" size={18} color={colours.textTertiary} />
          </Pressable>
        ) : null}
      </View>
      <View style={styles.filterSection}>
        // Trip filters 
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilterTrip(null)}
            style={[styles.filterChip, !filterTrip && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, !filterTrip && styles.filterChipTextActive]}>
              All Trips
            </Text>
          </Pressable>
          {tripOptions.map((t) => (
            <Pressable
              key={t.id}
              onPress={() => setFilterTrip(filterTrip === t.id ? null : t.id)}
              style={[styles.filterChip, filterTrip === t.id && styles.filterChipActive]}
            >
              <Text
                style={[styles.filterChipText, filterTrip === t.id && styles.filterChipTextActive]}
                numberOfLines={1}
              >
                {t.title}
              </Text>
            </Pressable>
          ))}
        </View>

        // Category filters
        <View style={styles.filterRow}>
          <Pressable
            onPress={() => setFilterCategory(null)}
            style={[styles.filterChip, !filterCategory && styles.filterChipActive]}
          >
            <Text style={[styles.filterChipText, !filterCategory && styles.filterChipTextActive]}>
              All Categories
            </Text>
          </Pressable>
          {categoryOptions.map((c) => (
            <Pressable
              key={c.id}
              onPress={() => setFilterCategory(filterCategory === c.id ? null : c.id)}
              style={[
                styles.filterChip,
                filterCategory === c.id && {
                  backgroundColor: c.colour + "18",
                  borderColor: c.colour,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterChipText,
                  filterCategory === c.id && { color: c.colour, fontWeight: "600" as const },
                ]}
                numberOfLines={1}
              >
                {c.name}
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
              style={[styles.filterChip, filterStatus === s.value && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, filterStatus === s.value && styles.filterChipTextActive]}>
                {s.label}
              </Text>
            </Pressable>
          ))}
        </View>

        // Clears all filters
        {hasActiveFilters ? (
          <Pressable onPress={clearFilters} style={styles.clearButton}>
            <Ionicons name="refresh-outline" size={14} color={colours.primary} />
            <Text style={styles.clearButtonText}>Clear Filters</Text>
          </Pressable>
        ) : null}
      </View>

      {filtered.length === 0 ? (
        <EmptyState
          icon="footsteps-outline"
          title={activityList.length === 0 ? "No activities yet" : "No matching activities"}
          message={
            activityList.length === 0
              ? "Create your first activity to start tracking."
              : "Try changing the search or filters."
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
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 42,
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    backgroundColor: colours.surface,
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  searchInput: {
    flex: 1,
    ...typography.caption,
    color: colours.textPrimary,
    height: 42,
    padding: 0,
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
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs,
    paddingVertical: spacing.xs,
  },
  clearButtonText: {
    ...typography.small,
    color: colours.primary,
    fontWeight: "500",
  },
  list: {
    gap: spacing.md,
    paddingBottom: spacing["3xl"],
  },
});