import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { TripCard } from "@/src/components/TripCard";
import { db } from "@/src/db/client";
import { trips } from "@/src/db/schema";
import { colours, spacing } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { desc, eq } from "drizzle-orm";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { FlatList, Pressable, StyleSheet, View } from "react-native";

// Stores trip details
interface Trip {
  id: number;
  title: string;
  countryOrRegion: string;
  startDate: string;
  endDate: string;
  description: string | null;
  themeColour: string;
}

export default function TripsScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [tripList, setTripList] = useState<Trip[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        const rows = await db
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
          .orderBy(desc(trips.startDate));

        setTripList(rows);
      })();
    }, [user])
  );

  return (
    <ScreenContainer>
      <View style={styles.headerRow}>
        <AppHeader title="Trips" subtitle="All your travel plans" />
        <Pressable
          onPress={() => router.push("/trip/form")}
          style={styles.addButton}
        >
          <Ionicons name="add-circle" size={32} color={colours.primary} />
        </Pressable>
      </View>

      {tripList.length === 0 ? (
        <EmptyState
          icon="map-outline"
          title="No trips yet"
          message="Create your first trip and start planning your itinerary."
          actionLabel="Create Trip"
          onAction={() => router.push("/trip/form")}
        />
      ) : (
        <FlatList
          data={tripList}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TripCard
              title={item.title}
              countryOrRegion={item.countryOrRegion}
              startDate={item.startDate}
              endDate={item.endDate}
              description={item.description}
              themeColour={item.themeColour}
              onPress={() => router.push({
                pathname: "/trip/[id]",
                params: { id: item.id }
              })}
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
  list: {
    gap: spacing.md,
    paddingBottom: spacing["3xl"],
  },
});