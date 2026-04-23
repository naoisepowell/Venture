import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { TargetCard } from "@/src/components/TargetCard";
import { db } from "@/src/db/client";
import { activities, categories, targets, trips } from "@/src/db/schema";
import { useTheme, type Colours, spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { and, eq, gte, sql } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { Alert, FlatList, Pressable, StyleSheet, View } from "react-native";

// Defines shape for each target shown on screen
// Includes saves target data and extra display info + live progress
interface TargetRow {
  id: number;
  periodType: string;
  targetMetricType: string;
  targetValue: number;
  tripId: number | null;
  categoryId: number | null;
  tripTitle: string | null;
  categoryName: string | null;
  categoryColour: string | null;
  currentValue: number;
}

// Gets start date for current week (Monday) in YYYY-MM-DD format
function getWeekStart(): string {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(now.setDate(diff));
  return monday.toISOString().split("T")[0];
}

// Gets start date of current month
function getMonthStart(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
}

export default function TargetsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { colours } = useTheme();
  const styles = makeStyles(colours);
  const [targetList, setTargetList] = useState<TargetRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        const rows = await db
          .select({
            id: targets.id,
            periodType: targets.periodType,
            targetMetricType: targets.targetMetricType,
            targetValue: targets.targetValue,
            tripId: targets.tripId,
            categoryId: targets.categoryId,
          })
          .from(targets)
          .where(eq(targets.userId, user.id));

        const weekStart = getWeekStart();
        const monthStart = getMonthStart();

        // For each target - load any related trip/category info and calculate current progress
        const enriched: TargetRow[] = await Promise.all(
          rows.map(async (t) => {
            let tripTitle: string | null = null;
            let categoryName: string | null = null;
            let categoryColour: string | null = null;

            if (t.tripId) {
              const tripRows = await db
                .select({ title: trips.title })
                .from(trips)
                .where(eq(trips.id, t.tripId))
                .limit(1);
              if (tripRows.length > 0) tripTitle = tripRows[0].title;
            }

            if (t.categoryId) {
              const catRows = await db
                .select({ name: categories.name, colour: categories.colour })
                .from(categories)
                .where(eq(categories.id, t.categoryId))
                .limit(1);
              if (catRows.length > 0) {
                categoryName = catRows[0].name;
                categoryColour = catRows[0].colour;
              }
            }

            const periodStart = t.periodType === "weekly" ? weekStart : monthStart;

            const conditions = [
              gte(activities.date, periodStart),
              eq(activities.metricType, t.targetMetricType),
            ];

            if (t.tripId) {
              conditions.push(eq(activities.tripId, t.tripId));
            }

            if (t.categoryId) {
              conditions.push(eq(activities.categoryId, t.categoryId));
            }

            if (!t.tripId) {
              const userTrips = await db
                .select({ id: trips.id })
                .from(trips)
                .where(eq(trips.userId, user.id));
              const tripIds = userTrips.map((ut) => ut.id);

              if (tripIds.length === 0) {
                return {
                  ...t,
                  tripTitle,
                  categoryName,
                  categoryColour,
                  currentValue: 0,
                };
              }

              const sumRows = await db
                .select({
                  total: sql<number>`coalesce(sum(${activities.metricValue}), 0)`,
                })
                .from(activities)
                .innerJoin(trips, eq(activities.tripId, trips.id))
                .where(
                  and(
                    eq(trips.userId, user.id),
                    gte(activities.date, periodStart),
                    eq(activities.metricType, t.targetMetricType),
                    ...(t.categoryId
                      ? [eq(activities.categoryId, t.categoryId)]
                      : [])
                  )
                );

              return {
                ...t,
                tripTitle,
                categoryName,
                categoryColour,
                currentValue: Number(sumRows[0]?.total ?? 0),
              };
            }

            const sumRows = await db
              .select({
                total: sql<number>`coalesce(sum(${activities.metricValue}), 0)`,
              })
              .from(activities)
              .where(and(...conditions));

            return {
              ...t,
              tripTitle,
              categoryName,
              categoryColour,
              currentValue: Number(sumRows[0]?.total ?? 0),
            };
          })
        );

        setTargetList(enriched); // Saves prepared target list into state
      })();
    }, [user])
  );

  const handleDelete = (item: TargetRow) => {
    Alert.alert(
      "Delete Target",
      "Are you sure you want to delete this target?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await db.delete(targets).where(eq(targets.id, item.id));
            setTargetList((prev) => prev.filter((t) => t.id !== item.id));
          },
        },
      ]
    );
  };

  // Renders list of targets with progress, or empty state if no targets set up yet
  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <Pressable
          onPress={() => router.push("/target/form")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color={colours.primary} />
        </Pressable>
      </View>

      <AppHeader
        title="Targets"
        subtitle="Set goals for your travels"
      />

      {targetList.length === 0 ? (
        <EmptyState
          icon="flag-outline"
          title="No targets yet"
          message="Set travel targets to track your progress and stay motivated."
        />
      ) : (
        <FlatList
          data={targetList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TargetCard
              periodType={item.periodType}
              targetMetricType={item.targetMetricType}
              targetValue={item.targetValue}
              currentValue={item.currentValue}
              tripTitle={item.tripTitle}
              categoryName={item.categoryName}
              categoryColour={item.categoryColour}
              onPress={() => router.push(`/target/form?targetId=${item.id}`)}
              onLongPress={() => handleDelete(item)}
            />
          )}
        />
      )}
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
    addButton: {
      paddingVertical: spacing.xs,
    },
    list: {
      gap: spacing.md,
      paddingBottom: spacing["3xl"],
    },
  });
}
