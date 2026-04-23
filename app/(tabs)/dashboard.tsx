import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer, SectionTitle } from "@/src/components";
import { ActivityCard } from "@/src/components/ActivityCard";
import { TripCard } from "@/src/components/TripCard";
import { db } from "@/src/db/client";
import { activities, categories, trips } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { desc, eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";

// Defines trip data shwon in upcoming trips section
interface TripRow {
  id: number;
  title: string;
  countryOrRegion: string;
  startDate: string;
  endDate: string;
  description: string | null;
  themeColour: string;
}

// Defines activity data shown in recent activity section
interface RecentActivity {
  id: number;
  title: string;
  date: string;
  metricType: string;
  metricValue: number;
  status: string;
  location: string | null;
  tripTitle: string;
  categoryName: string;
  categoryColour: string;
  categoryIcon: string;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [upcomingTrips, setUpcomingTrips] = useState<TripRow[]>([]);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [totalTrips, setTotalTrips] = useState(0);
  const [totalActivities, setTotalActivities] = useState(0);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        const today = new Date().toISOString().split("T")[0];

        const upTrips = await db
          .select({
            id: trips.id,
            title: trips.title,
            countryOrRegion: trips.countryOrRegion,
            startDate: trips.startDate,
            endDate: trips.endDate,
            description: trips.description,
            themeColour: trips.themeColour,
          })
          .from(trips)
          .where(eq(trips.userId, user.id))
          .orderBy(trips.startDate)
          .limit(3);

        setUpcomingTrips(upTrips.filter((t) => t.endDate >= today));

        const allTrips = await db
          .select({ id: trips.id })
          .from(trips)
          .where(eq(trips.userId, user.id));
        setTotalTrips(allTrips.length);

        const recent = await db
          .select({
            id: activities.id,
            title: activities.title,
            date: activities.date,
            metricType: activities.metricType,
            metricValue: activities.metricValue,
            status: activities.status,
            location: activities.location,
            tripTitle: trips.title,
            categoryName: categories.name,
            categoryColour: categories.colour,
            categoryIcon: categories.icon,
          })
          .from(activities)
          .innerJoin(trips, eq(activities.tripId, trips.id))
          .innerJoin(categories, eq(activities.categoryId, categories.id))
          .where(eq(trips.userId, user.id))
          .orderBy(desc(activities.date))
          .limit(5);

        setRecentActivities(recent);

        const allActs = await db
          .select({ id: activities.id })
          .from(activities)
          .innerJoin(trips, eq(activities.tripId, trips.id))
          .where(eq(trips.userId, user.id));
        setTotalActivities(allActs.length);
      })();
    }, [user])
  );

  return (
    <ScreenContainer>
      <AppHeader title="Dashboard" subtitle="Your travel overview" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalTrips}</Text>
            <Text style={styles.statLabel}>Trips</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{totalActivities}</Text>
            <Text style={styles.statLabel}>Activities</Text>
          </View>
        </View>

        <SectionTitle
          title="Upcoming Trips"
          action={totalTrips > 0 ? "View All" : undefined}
          onAction={() => router.push("/(tabs)/trips")}
        />
        {upcomingTrips.length === 0 ? (
          <View style={styles.emptyCard}>
            <EmptyState
              icon="airplane-outline"
              title="No upcoming trips"
              message="Your next adventure starts here."
              actionLabel="Create Trip"
              onAction={() => router.push("/trip/form")}
            />
          </View>
        ) : (
          <View style={styles.tripList}>
            {upcomingTrips.map((t) => (
              <TripCard
                key={t.id}
                title={t.title}
                countryOrRegion={t.countryOrRegion}
                startDate={t.startDate}
                endDate={t.endDate}
                description={t.description}
                themeColour={t.themeColour}
                onPress={() => router.push({ pathname: '/trip/[id]', params: { id: t.id } })}
              />
            ))}
          </View>
        )}

        <SectionTitle
          title="Recent Activity"
          action={totalActivities > 0 ? "View All" : undefined}
          onAction={() => router.push("/(tabs)/activities")}
          style={styles.section}
        />
        {recentActivities.length === 0 ? (
          <View style={styles.emptyCard}>
            <EmptyState
              icon="time-outline"
              title="No recent activity"
              message="Activities from your trips will appear here."
            />
          </View>
        ) : (
          <View style={styles.activityList}>
            {recentActivities.map((a) => (
              <ActivityCard
                key={a.id}
                title={a.title}
                date={a.date}
                metricType={a.metricType}
                metricValue={a.metricValue}
                status={a.status}
                location={a.location}
                tripTitle={a.tripTitle}
                categoryName={a.categoryName}
                categoryColour={a.categoryColour}
                categoryIcon={a.categoryIcon}
                onPress={() => router.push(`/activity/form?activityId=${a.id}`)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scroll: {
    paddingBottom: spacing["3xl"],
  },
  statsRow: {
    flexDirection: "row",
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    padding: spacing.base,
    alignItems: "center",
    gap: spacing.xs,
  },
  statValue: {
    ...typography.title,
    color: colours.primary,
  },
  statLabel: {
    ...typography.small,
    color: colours.textSecondary,
  },
  emptyCard: {
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    minHeight: 160,
  },
  tripList: {
    gap: spacing.md,
  },
  section: {
    marginTop: spacing.lg,
  },
  activityList: {
    gap: spacing.md,
  },
});