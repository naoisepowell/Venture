import { StyleSheet, View } from "react-native";
import { ScreenContainer, AppHeader, EmptyState, SectionTitle } from "@/src/components";
import { colours, spacing, radii } from "@/src/theme";

export default function DashboardScreen() {
  return (
    <ScreenContainer>
      <AppHeader title="Dashboard" subtitle="Your travel overview" />

      <SectionTitle title="Upcoming Trips" action="View All" />
      <View style={styles.card}>
        <EmptyState
          icon="airplane-outline"
          title="No upcoming trips"
          message="Your next adventure starts here. Create a trip to get going."
        />
      </View>

      <SectionTitle title="Recent Activity" style={styles.section} />
      <View style={styles.card}>
        <EmptyState
          icon="time-outline"
          title="No recent activity"
          message="Activities from your trips will appear here."
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    minHeight: 160,
  },
  section: {
    marginTop: spacing.lg,
  },
});
