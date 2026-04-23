import { useAuth } from "@/src/auth";
import { PrimaryButton, ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { categories, targets, trips } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

// Available time periods for tatgets
const PERIOD_OPTIONS = [
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
];

//Available metrics
const METRIC_TYPES = [
  "hours",
  "km",
  "miles",
  "steps",
  "calories",
  "units",
  "minutes",
  "activities",
];

// Used for trips and categpories dropdowns
interface PickerItem {
  id: number;
  label: string;
  colour?: string;
}

// Form screen for creating or editing targets, with options to link to a specific trip or category
export default function TargetFormScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { targetId } = useLocalSearchParams<{ targetId?: string }>();
  const isEditing = !!targetId;
  // Stores available trips and categories for selection
  const [tripList, setTripList] = useState<PickerItem[]>([]);
  const [categoryList, setCategoryList] = useState<PickerItem[]>([]);
  // Stores form values and screen state
  const [periodType, setPeriodType] = useState("weekly");
  const [targetMetricType, setTargetMetricType] = useState("hours");
  const [targetValue, setTargetValue] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;

    (async () => {
      const t = await db
        .select({ id: trips.id, label: trips.title })
        .from(trips)
        .where(eq(trips.userId, user.id))
        .orderBy(trips.title);
      setTripList(t);

      const c = await db
        .select({ id: categories.id, label: categories.name, colour: categories.colour })
        .from(categories)
        .where(eq(categories.userId, user.id))
        .orderBy(categories.name);
      setCategoryList(c);
    })();
  }, [user]);

  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      const rows = await db
        .select()
        .from(targets)
        .where(eq(targets.id, parseInt(targetId!, 10)))
        .limit(1);

      if (rows.length > 0) {
        const t = rows[0];
        setPeriodType(t.periodType);
        setTargetMetricType(t.targetMetricType);
        setTargetValue(t.targetValue.toString());
        setSelectedTripId(t.tripId);
        setSelectedCategoryId(t.categoryId);
      }
    })();
  }, [targetId]);

  const handleSave = async () => {
    if (!targetValue.trim() || isNaN(parseFloat(targetValue)) || parseFloat(targetValue) <= 0) {
      setError("Target value must be a positive number.");
      return;
    }

    if (!user) return;
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await db
          .update(targets)
          .set({
            periodType,
            targetMetricType,
            targetValue: parseFloat(targetValue),
            tripId: selectedTripId,
            categoryId: selectedCategoryId,
          })
          .where(eq(targets.id, parseInt(targetId!, 10)));
      } else {
        await db.insert(targets).values({
          userId: user.id,
          periodType,
          targetMetricType,
          targetValue: parseFloat(targetValue),
          tripId: selectedTripId,
          categoryId: selectedCategoryId,
          createdAt: Date.now(),
        });
      }

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save target.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <Text style={styles.screenTitle}>
          {isEditing ? "Edit Target" : "New Target"}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.field}>
          <Text style={styles.label}>Period</Text>
          <View style={styles.chipRow}>
            {PERIOD_OPTIONS.map((p) => (
              <Pressable
                key={p.value}
                onPress={() => setPeriodType(p.value)}
                style={[
                  styles.chip,
                  periodType === p.value && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    periodType === p.value && styles.chipTextSelected,
                  ]}
                >
                  {p.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Target Value</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 10"
              placeholderTextColor={colours.textTertiary}
              keyboardType="decimal-pad"
              value={targetValue}
              onChangeText={setTargetValue}
            />
          </View>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Metric</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipRow}
            >
              {METRIC_TYPES.map((m) => (
                <Pressable
                  key={m}
                  onPress={() => setTargetMetricType(m)}
                  style={[
                    styles.chipSmall,
                    targetMetricType === m && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipTextSmall,
                      targetMetricType === m && styles.chipTextSelected,
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Trip (optional)</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setSelectedTripId(null)}
              style={[
                styles.chip,
                !selectedTripId && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  !selectedTripId && styles.chipTextSelected,
                ]}
              >
                All Trips
              </Text>
            </Pressable>
            {tripList.map((t) => (
              <Pressable
                key={t.id}
                onPress={() => setSelectedTripId(t.id)}
                style={[
                  styles.chip,
                  selectedTripId === t.id && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedTripId === t.id && styles.chipTextSelected,
                  ]}
                  numberOfLines={1}
                >
                  {t.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category (optional)</Text>
          <View style={styles.chipRow}>
            <Pressable
              onPress={() => setSelectedCategoryId(null)}
              style={[
                styles.chip,
                !selectedCategoryId && styles.chipSelected,
              ]}
            >
              <Text
                style={[
                  styles.chipText,
                  !selectedCategoryId && styles.chipTextSelected,
                ]}
              >
                All Categories
              </Text>
            </Pressable>
            {categoryList.map((c) => (
              <Pressable
                key={c.id}
                onPress={() => setSelectedCategoryId(c.id)}
                style={[
                  styles.chip,
                  selectedCategoryId === c.id && {
                    backgroundColor: (c.colour || colours.primary) + "18",
                    borderColor: c.colour || colours.primary,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedCategoryId === c.id && {
                      color: c.colour || colours.primary,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {c.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton
          title={isEditing ? "Save Changes" : "Create Target"}
          onPress={handleSave}
          loading={loading}
          style={styles.saveButton}
        />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  backButton: {
    width: 40,
    alignItems: "flex-start",
  },
  screenTitle: {
    ...typography.subtitle,
    color: colours.textPrimary,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: spacing.base,
    paddingBottom: spacing["3xl"],
    gap: spacing.xl,
  },
  error: {
    ...typography.caption,
    color: colours.danger,
    textAlign: "center",
    backgroundColor: "#FEF2F2",
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  field: {
    gap: spacing.sm,
  },
  label: {
    ...typography.captionMedium,
    color: colours.textPrimary,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colours.border,
    borderRadius: radii.md,
    paddingHorizontal: spacing.base,
    ...typography.body,
    color: colours.textPrimary,
    backgroundColor: colours.surface,
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  chipRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colours.border,
    backgroundColor: colours.surface,
  },
  chipSmall: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radii.full,
    borderWidth: 1,
    borderColor: colours.border,
    backgroundColor: colours.surface,
  },
  chipSelected: {
    backgroundColor: colours.primaryFaint,
    borderColor: colours.primary,
  },
  chipText: {
    ...typography.caption,
    color: colours.textSecondary,
  },
  chipTextSmall: {
    ...typography.small,
    color: colours.textSecondary,
  },
  chipTextSelected: {
    color: colours.primary,
    fontWeight: "600",
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});