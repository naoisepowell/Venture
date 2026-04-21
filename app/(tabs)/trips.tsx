import { ScreenContainer, AppHeader, EmptyState } from "@/src/components";

export default function TripsScreen() {
  return (
    <ScreenContainer>
      <AppHeader title="Trips" subtitle="All your travel plans" />
      <EmptyState
        icon="map-outline"
        title="No trips yet"
        message="Create your first trip and start planning your itinerary."
      />
    </ScreenContainer>
  );
}
