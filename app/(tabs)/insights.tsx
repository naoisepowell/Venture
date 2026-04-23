import { useAuth } from "@/src/auth";
import { AppHeader, EmptyState, ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { activities, trips } from "@/src/db/schema";
import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { eq } from "drizzle-orm";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { Dimensions, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

// Time period options for the chart toggle
const PERIODS = ["Week", "Month", "Year"] as const;
type Period = typeof PERIODS[number];

interface ActivityRow {
  date: string;
  metricValue: number;
}

// Groups activities into labelled buckets depending on the selected period
function buildBars(rows: ActivityRow[], period: Period, colour: string) {
  if (period === "Week") {
    // Last 7 days, one bar per day
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      return {
        value: rows.filter((r) => r.date === dateStr).length,
        label: d.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3),
        frontColor: colour,
      };
    });
  }

  if (period === "Month") {
    // Last 4 weeks, one bar per week
    return Array.from({ length: 4 }, (_, i) => {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
        label: `Wk${4 - i}`,
      };
    })
      .reverse()
      .map((w) => ({
        value: rows.filter((r) => r.date >= w.start && r.date <= w.end).length,
        label: w.label,
        frontColor: colour,
      }));
  }

  // Year: last 6 months, one bar per month
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-31`;
    return {
      value: rows.filter((r) => r.date >= start && r.date <= end).length,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      frontColor: colour,
    };
  });
}

export default function InsightsScreen() {
  const { user } = useAuth();
  const { colours, theme } = useTheme();
  const styles = makeStyles(colours);
  const [period, setPeriod] = useState<Period>("Week");
  const [rows, setRows] = useState<ActivityRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;

      (async () => {
        // Loads all user's activities for aggregation
        const data = await db
          .select({ date: activities.date, metricValue: activities.metricValue })
          .from(activities)
          .innerJoin(trips, eq(activities.tripId, trips.id))
          .where(eq(trips.userId, user.id));

        setRows(data);
      })();
    }, [user])
  );

  const barData = buildBars(rows, period, colours.primary);
  const totalActivities = rows.length;
  const chartWidth = Dimensions.get("window").width - spacing.base * 2 - 16;
  const labelColour = colours.textTertiary;
  const isDark = theme === "dark";

  return (
    <ScreenContainer>
      <AppHeader title="Insights" subtitle="Your travel at a glance" />

      {rows.length === 0 ? (
        <EmptyState
          icon="analytics-outline"
          title="No data yet"
          message="Once you have some trips and activities, your insights will appear here."
        />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

          {/* Summary stats */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{totalActivities}</Text>
              <Text style={styles.statLabel}>Total Activities</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {barData.reduce((s, b) => s + b.value, 0)}
              </Text>
              <Text style={styles.statLabel}>This {period}</Text>
            </View>
          </View>

          {/* Period toggle */}
          <View style={styles.toggleRow}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.toggleChip, period === p && styles.toggleChipActive]}
              >
                <Text style={[styles.toggleLabel, period === p && styles.toggleLabelActive]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Activity count bar chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Activities per {period === "Week" ? "day" : period === "Month" ? "week" : "month"}</Text>
            <BarChart
              data={barData}
              width={chartWidth}
              barWidth={chartWidth / barData.length - 12}
              spacing={12}
              noOfSections={4}
              maxValue={Math.max(...barData.map((b) => b.value), 4)}
              yAxisTextStyle={{ color: labelColour, fontSize: 11 }}
              xAxisLabelTextStyle={{ color: labelColour, fontSize: 11 }}
              yAxisColor={colours.border}
              xAxisColor={colours.border}
              rulesColor={colours.divider}
              hideRules={false}
              barBorderRadius={4}
              isAnimated
              backgroundColor={isDark ? colours.surface : colours.surface}
            />
          </View>

        </ScrollView>
      )}
    </ScreenContainer>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    scroll: {
      paddingBottom: spacing["3xl"],
    },
    statsRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      alignItems: "center",
      gap: spacing.xs,
    },
    statValue: {
      ...typography.title,
      color: c.primary,
    },
    statLabel: {
      ...typography.small,
      color: c.textSecondary,
    },
    toggleRow: {
      flexDirection: "row",
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    toggleChip: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
      borderRadius: radii.full,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    toggleChipActive: {
      backgroundColor: c.primaryFaint,
      borderColor: c.primary,
    },
    toggleLabel: {
      ...typography.captionMedium,
      color: c.textSecondary,
    },
    toggleLabelActive: {
      color: c.primary,
    },
    chartCard: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      gap: spacing.md,
    },
    chartTitle: {
      ...typography.captionMedium,
      color: c.textSecondary,
    },
  });
}
