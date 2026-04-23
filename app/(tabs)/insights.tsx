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

const PERIODS = ["Week", "Month", "Year"] as const;
type Period = typeof PERIODS[number];

interface ActivityRow {
  date: string;
  metricValue: number;
}

// Builds bar chart data grouped by the selected period
function buildBars(rows: ActivityRow[], period: Period, colour: string, dimColour: string) {
  if (period === "Week") {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dateStr = d.toISOString().split("T")[0];
      const count = rows.filter((r) => r.date === dateStr).length;
      return {
        value: count,
        label: d.toLocaleDateString("en-GB", { weekday: "short" }).slice(0, 3),
        frontColor: count > 0 ? colour : dimColour,
      };
    });
  }

  if (period === "Month") {
    return Array.from({ length: 4 }, (_, i) => {
      const end = new Date();
      end.setDate(end.getDate() - i * 7);
      const start = new Date(end);
      start.setDate(start.getDate() - 6);
      return {
        start: start.toISOString().split("T")[0],
        end: end.toISOString().split("T")[0],
        label: `Wk ${4 - i}`,
      };
    })
      .reverse()
      .map((w) => {
        const count = rows.filter((r) => r.date >= w.start && r.date <= w.end).length;
        return { value: count, label: w.label, frontColor: count > 0 ? colour : dimColour };
      });
  }

  // Year: last 6 months
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() - (5 - i));
    const year = d.getFullYear();
    const month = d.getMonth();
    const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
    const end = `${year}-${String(month + 1).padStart(2, "0")}-31`;
    const count = rows.filter((r) => r.date >= start && r.date <= end).length;
    return {
      value: count,
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      frontColor: count > 0 ? colour : dimColour,
    };
  });
}

// Label shown under the hero number
const PERIOD_LABEL: Record<Period, string> = {
  Week: "activities this week",
  Month: "activities this month",
  Year: "activities this year",
};

const CHART_SUBTITLE: Record<Period, string> = {
  Week: "Last 7 days",
  Month: "Last 4 weeks",
  Year: "Last 6 months",
};

export default function InsightsScreen() {
  const { user } = useAuth();
  const { colours } = useTheme();
  const styles = makeStyles(colours);
  const [period, setPeriod] = useState<Period>("Week");
  const [rows, setRows] = useState<ActivityRow[]>([]);

  useFocusEffect(
    useCallback(() => {
      if (!user) return;
      (async () => {
        const data = await db
          .select({ date: activities.date, metricValue: activities.metricValue })
          .from(activities)
          .innerJoin(trips, eq(activities.tripId, trips.id))
          .where(eq(trips.userId, user.id));
        setRows(data);
      })();
    }, [user])
  );

  const barData = buildBars(rows, period, colours.primary, colours.borderLight);
  const periodTotal = barData.reduce((s, b) => s + b.value, 0);
  const chartWidth = Dimensions.get("window").width - spacing.base * 4;

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

          {/* Segmented period control */}
          <View style={styles.segmented}>
            {PERIODS.map((p) => (
              <Pressable
                key={p}
                onPress={() => setPeriod(p)}
                style={[styles.segment, period === p && styles.segmentActive]}
              >
                <Text style={[styles.segmentLabel, period === p && styles.segmentLabelActive]}>
                  {p}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Hero stat */}
          <View style={styles.heroCard}>
            <Text style={styles.heroNumber}>{periodTotal}</Text>
            <Text style={styles.heroLabel}>{PERIOD_LABEL[period]}</Text>
            <Text style={styles.heroSub}>{rows.length} total all time</Text>
          </View>

          {/* Bar chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Activity count</Text>
            <Text style={styles.chartSub}>{CHART_SUBTITLE[period]}</Text>
            <BarChart
              data={barData}
              width={chartWidth}
              barWidth={chartWidth / barData.length - 10}
              spacing={10}
              noOfSections={Math.min(Math.max(...barData.map((b) => b.value), 2), 5)}
              maxValue={Math.max(...barData.map((b) => b.value), 4)}
              hideYAxisText
              hideAxesAndRules={false}
              yAxisColor="transparent"
              xAxisColor={colours.border}
              rulesColor={colours.divider}
              barBorderRadius={6}
              showValuesAsTopLabel
              topLabelTextStyle={{ ...typography.small, color: colours.textSecondary, marginBottom: 4 }}
              xAxisLabelTextStyle={{ ...typography.small, color: colours.textTertiary }}
              isAnimated
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
      gap: spacing.md,
    },
    segmented: {
      flexDirection: "row",
      backgroundColor: c.borderLight,
      borderRadius: radii.full,
      padding: 3,
    },
    segment: {
      flex: 1,
      paddingVertical: spacing.sm,
      borderRadius: radii.full,
      alignItems: "center",
    },
    segmentActive: {
      backgroundColor: c.surface,
      // subtle shadow to lift the active tab
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },
    segmentLabel: {
      ...typography.captionMedium,
      color: c.textTertiary,
    },
    segmentLabelActive: {
      color: c.textPrimary,
    },
    heroCard: {
      backgroundColor: c.primary,
      borderRadius: radii.xl,
      padding: spacing.xl,
      alignItems: "center",
      gap: spacing.xs,
    },
    heroNumber: {
      fontSize: 56,
      fontWeight: "700",
      color: "#FFFFFF",
      lineHeight: 64,
    },
    heroLabel: {
      ...typography.body,
      color: "rgba(255,255,255,0.85)",
    },
    heroSub: {
      ...typography.small,
      color: "rgba(255,255,255,0.55)",
      marginTop: spacing.xs,
    },
    chartCard: {
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      padding: spacing.base,
      gap: spacing.xs,
      overflow: "hidden",
    },
    chartTitle: {
      ...typography.captionMedium,
      color: c.textPrimary,
    },
    chartSub: {
      ...typography.small,
      color: c.textTertiary,
      marginBottom: spacing.sm,
    },
  });
}
