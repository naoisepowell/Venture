import { useAuth } from "@/src/auth";
import { PrimaryButton, ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { trips } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

const THEME_COLOURS = [
  "#C41E3A",
  "#E85D75",
  "#2563EB",
  "#0891B2",
  "#059669",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#475569",
];

// Screen for creating/editing a trip
export default function TripFormScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { tripId } = useLocalSearchParams<{ tripId?: string }>();
  const isEditing = !!tripId;
 
  const [title, setTitle] = useState("");
  const [countryOrRegion, setCountryOrRegion] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [description, setDescription] = useState("");
  const [themeColour, setThemeColour] = useState(THEME_COLOURS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load trip details if editing an existing trip
  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      const rows = await db
        .select()
        .from(trips)
        .where(eq(trips.id, parseInt(tripId!, 10)))
        .limit(1);

      if (rows.length > 0) {
        const t = rows[0];
        setTitle(t.title);
        setCountryOrRegion(t.countryOrRegion);
        setStartDate(t.startDate);
        setEndDate(t.endDate);
        setDescription(t.description ?? "");
        setThemeColour(t.themeColour);
      }
    })();
  }, [tripId]);

  // Validate form fields before saving
  const validate = (): string | null => {
    if (!title.trim()) return "Title is required.";
    if (!countryOrRegion.trim()) return "Country or region is required.";
    if (!startDate.trim()) return "Start date is required.";
    if (!endDate.trim()) return "End date is required.";

    const start = new Date(startDate.trim());
    const end = new Date(endDate.trim());
    if (isNaN(start.getTime())) return "Start date is not valid. Use YYYY-MM-DD.";
    if (isNaN(end.getTime())) return "End date is not valid. Use YYYY-MM-DD.";
    if (end < start) return "End date must be after start date.";

    return null;
  };

  // Create or update trip
  const handleSave = async () => {
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!user) return;
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await db
          .update(trips)
          .set({
            title: title.trim(),
            countryOrRegion: countryOrRegion.trim(),
            startDate: startDate.trim(),
            endDate: endDate.trim(),
            description: description.trim() || null,
            themeColour,
          })
          .where(eq(trips.id, parseInt(tripId!, 10)));
      } else {
        await db.insert(trips).values({
          userId: user.id,
          title: title.trim(),
          countryOrRegion: countryOrRegion.trim(),
          startDate: startDate.trim(),
          endDate: endDate.trim(),
          description: description.trim() || null,
          themeColour,
          createdAt: Date.now(),
        });
      }

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save trip.");
    } finally {
      setLoading(false);
    }
  };

  // Form for creating/editing trip
  return (
    <ScreenContainer>
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colours.textPrimary} />
        </Pressable>
        <Text style={styles.screenTitle}>
          {isEditing ? "Edit Trip" : "New Trip"}
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
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Summer in Portugal"
            placeholderTextColor={colours.textTertiary}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Country or Region</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Portugal"
            placeholderTextColor={colours.textTertiary}
            value={countryOrRegion}
            onChangeText={setCountryOrRegion}
          />
        </View>

        <View style={styles.dateRow}>
          <View style={styles.dateField}>
            <Text style={styles.label}>Start Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colours.textTertiary}
              value={startDate}
              onChangeText={setStartDate}
            />
          </View>
          <View style={styles.dateField}>
            <Text style={styles.label}>End Date</Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colours.textTertiary}
              value={endDate}
              onChangeText={setEndDate}
            />
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Description (optional)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Notes about this trip..."
            placeholderTextColor={colours.textTertiary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Theme Colour</Text>
          <View style={styles.colourRow}>
            {THEME_COLOURS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setThemeColour(c)}
                style={[
                  styles.colourSwatch,
                  { backgroundColor: c },
                  themeColour === c && styles.colourSelected,
                ]}
              >
                {themeColour === c ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton
          title={isEditing ? "Save Changes" : "Create Trip"}
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
  dateRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  dateField: {
    flex: 1,
    gap: spacing.xs,
  },
  colourRow: {
    flexDirection: "row",
    gap: spacing.sm,
    flexWrap: "wrap",
  },
  colourSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  colourSelected: {
    borderWidth: 2.5,
    borderColor: colours.textPrimary,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});