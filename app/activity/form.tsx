import { useAuth } from "@/src/auth";
import { PrimaryButton, ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { activities, categories, trips } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";

// Status options user can choose for an activity
const STATUS_OPTIONS = [
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

// Different metric types that can be linked to an activity
const METRIC_TYPES = [
  "hours",
  "km",
  "miles",
  "steps",
  "calories",
  "units",
  "minutes",
];

// Shape used for trips and categories in picker lists
interface PickerItem {
  id: number;
  label: string;
  colour?: string;
}

// Screen for creating/editing an activity
export default function ActivityFormScreen() {
  const router = useRouter(); // Used to move between screens
  const { user } = useAuth(); // Gets current user
  // Gets values passed through the route
  // activityID used when editing
  // presetTripID used when creating from a specific trip
  const { activityId, tripId: presetTripId } = useLocalSearchParams<{
    activityId?: string;
    tripId?: string;
  }>();
  const isEditing = !!activityId;

  // Stores trips + categories that user picks from
  const [tripList, setTripList] = useState<PickerItem[]>([]);
  const [categoryList, setCategoryList] = useState<PickerItem[]>([]);

  // Stores all form values and screen state
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [metricType, setMetricType] = useState("hours");
  const [metricValue, setMetricValue] = useState("");
  const [status, setStatus] = useState("planned");
  const [notes, setNotes] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Loads users trips ande categories
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

      if (presetTripId && !isEditing) {
        setSelectedTripId(parseInt(presetTripId, 10));
      }
    })();
  }, [user]);

  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      const rows = await db
        .select()
        .from(activities)
        .where(eq(activities.id, parseInt(activityId!, 10)))
        .limit(1);

      if (rows.length > 0) {
        const a = rows[0];
        setSelectedTripId(a.tripId);
        setSelectedCategoryId(a.categoryId);
        setTitle(a.title);
        setDate(a.date);
        setMetricType(a.metricType);
        setMetricValue(a.metricValue.toString());
        setStatus(a.status);
        setNotes(a.notes ?? "");
        setLocation(a.location ?? "");
      }
    })();
  }, [activityId]);

  // Form validation
  const validate = (): string | null => {
    if (!selectedTripId) return "Please select a trip.";
    if (!selectedCategoryId) return "Please select a category.";
    if (!title.trim()) return "Title is required.";
    if (!date.trim()) return "Date is required.";
    const parsed = new Date(date.trim());
    if (isNaN(parsed.getTime())) return "Date is not valid. Use YYYY-MM-DD.";
    if (!metricValue.trim() || isNaN(parseFloat(metricValue)))
      return "Metric value must be a number.";
    return null;
  };

  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const now = Date.now();

      if (isEditing) {
        await db
          .update(activities)
          .set({
            tripId: selectedTripId!,
            categoryId: selectedCategoryId!,
            title: title.trim(),
            date: date.trim(),
            metricType,
            metricValue: parseFloat(metricValue),
            status,
            notes: notes.trim() || null,
            location: location.trim() || null,
            updatedAt: now,
          })
          .where(eq(activities.id, parseInt(activityId!, 10)));
      } else {
        await db.insert(activities).values({
          tripId: selectedTripId!,
          categoryId: selectedCategoryId!,
          title: title.trim(),
          date: date.trim(),
          metricType,
          metricValue: parseFloat(metricValue),
          status,
          notes: notes.trim() || null,
          location: location.trim() || null,
          createdAt: now,
          updatedAt: now,
        });
      }

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save activity.");
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
          {isEditing ? "Edit Activity" : "New Activity"}
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
          <Text style={styles.label}>Trip</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
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
          </ScrollView>
          {tripList.length === 0 ? (
            <Text style={styles.hint}>Create a trip first.</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Category</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.chipRow}
          >
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
          </ScrollView>
          {categoryList.length === 0 ? (
            <Text style={styles.hint}>Create a category first.</Text>
          ) : null}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Kayaking at Benagil Caves"
            placeholderTextColor={colours.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Date</Text>
          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={colours.textTertiary}
            value={date}
            onChangeText={setDate}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.field, { flex: 1 }]}>
            <Text style={styles.label}>Value</Text>
            <TextInput
              style={styles.input}
              placeholder="0"
              placeholderTextColor={colours.textTertiary}
              keyboardType="decimal-pad"
              value={metricValue}
              onChangeText={setMetricValue}
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
                  onPress={() => setMetricType(m)}
                  style={[
                    styles.chipSmall,
                    metricType === m && styles.chipSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.chipTextSmall,
                      metricType === m && styles.chipTextSelected,
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
          <Text style={styles.label}>Status</Text>
          <View style={styles.chipRow}>
            {STATUS_OPTIONS.map((s) => (
              <Pressable
                key={s.value}
                onPress={() => setStatus(s.value)}
                style={[
                  styles.chip,
                  status === s.value && styles.chipSelected,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    status === s.value && styles.chipTextSelected,
                  ]}
                >
                  {s.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Location (optional)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Benagil, Algarve"
            placeholderTextColor={colours.textTertiary}
            value={location}
            onChangeText={setLocation}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Notes (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Any extra details..."
            placeholderTextColor={colours.textTertiary}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <PrimaryButton
          title={isEditing ? "Save Changes" : "Create Activity"}
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
    gap: spacing.base,
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
    gap: spacing.xs,
  },
  label: {
    ...typography.captionMedium,
    color: colours.textPrimary,
  },
  hint: {
    ...typography.small,
    color: colours.textTertiary,
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
  textArea: {
    height: 90,
    paddingTop: spacing.md,
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