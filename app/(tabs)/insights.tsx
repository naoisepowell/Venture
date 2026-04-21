import { ScreenContainer, AppHeader, EmptyState } from "@/src/components";

export default function InsightsScreen() {
  return (
    <ScreenContainer>
      <AppHeader title="Insights" subtitle="Travel patterns and statistics" />
      <EmptyState
        icon="analytics-outline"
        title="No insights yet"
        message="Once you have some trips and activities, your travel insights will appear here."
      />
    </ScreenContainer>
  );
}
