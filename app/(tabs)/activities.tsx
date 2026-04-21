import { ScreenContainer, AppHeader, EmptyState } from "@/src/components";

export default function ActivitiesScreen() {
  return (
    <ScreenContainer>
      <AppHeader title="Activities" subtitle="Things to do on your trips" />
      <EmptyState
        icon="footsteps-outline"
        title="No activities yet"
        message="Activities you add to your trips will be listed here."
      />
    </ScreenContainer>
  );
}
