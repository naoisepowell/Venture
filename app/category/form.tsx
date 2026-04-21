import { useAuth } from "@/src/auth";
import { PrimaryButton, ScreenContainer } from "@/src/components";
import { db } from "@/src/db/client";
import { categories } from "@/src/db/schema";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { eq } from "drizzle-orm";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View, } from "react-native";

// List of colours user can choose from
const CATEGORY_COLOURS = [
  "#C41E3A",
  "#E85D75",
  "#2563EB",
  "#0891B2",
  "#059669",
  "#D97706",
  "#7C3AED",
  "#DB2777",
  "#475569",
  "#EA580C",
  "#0D9488",
  "#4F46E5",
];

// List of icons user can choose from
const CATEGORY_ICONS: (keyof typeof Ionicons.glyphMap)[] = [
  "restaurant-outline",
  "bed-outline",
  "car-outline",
  "walk-outline",
  "camera-outline",
  "musical-notes-outline",
  "boat-outline",
  "bicycle-outline",
  "cart-outline",
  "ticket-outline",
  "fitness-outline",
  "book-outline",
  "wine-outline",
  "cafe-outline",
  "bus-outline",
  "train-outline",
  "flag-outline",
  "heart-outline",
  "star-outline",
  "compass-outline",
];

export default function CategoryFormScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();
  const isEditing = !!categoryId;

  const [name, setName] = useState("");
  const [colour, setColour] = useState(CATEGORY_COLOURS[0]);
  const [icon, setIcon] = useState<string>(CATEGORY_ICONS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If user is editing, load existing category details into the form
  useEffect(() => {
    if (!isEditing) return;

    (async () => {
      const rows = await db
        .select()
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId!, 10)))
        .limit(1);

      if (rows.length > 0) {
        const c = rows[0];
        setName(c.name);
        setColour(c.colour);
        setIcon(c.icon);
      }
    })();
  }, [categoryId]);

  // Saves category by updating / creating new one
  const handleSave = async () => {
    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    if (!user) return;
    setError("");
    setLoading(true);

    try {
      if (isEditing) {
        await db
          .update(categories)
          .set({
            name: name.trim(),
            colour,
            icon,
          })
          .where(eq(categories.id, parseInt(categoryId!, 10)));
      } else {
        await db.insert(categories).values({
          userId: user.id,
          name: name.trim(),
          colour,
          icon,
          createdAt: Date.now(),
        });
      }

      router.back();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save category.");
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
          {isEditing ? "Edit Category" : "New Category"}
        </Text>
        <View style={styles.backButton} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {error ? <Text style={styles.error}>{error}</Text> : null}

        <View style={styles.previewRow}>
          <View style={[styles.previewCircle, { backgroundColor: colour }]}>
            <Ionicons
              name={icon as keyof typeof Ionicons.glyphMap}
              size={28}
              color="#FFFFFF"
            />
          </View>
          <Text style={styles.previewName}>{name || "Category name"}</Text>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Food & Dining"
            placeholderTextColor={colours.textTertiary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Colour</Text>
          <View style={styles.swatchRow}>
            {CATEGORY_COLOURS.map((c) => (
              <Pressable
                key={c}
                onPress={() => setColour(c)}
                style={[
                  styles.colourSwatch,
                  { backgroundColor: c },
                  colour === c && styles.swatchSelected,
                ]}
              >
                {colour === c ? (
                  <Ionicons name="checkmark" size={16} color="#FFFFFF" />
                ) : null}
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Icon</Text>
          <View style={styles.iconGrid}>
            {CATEGORY_ICONS.map((i) => (
              <Pressable
                key={i}
                onPress={() => setIcon(i)}
                style={[
                  styles.iconOption,
                  icon === i && styles.iconSelected,
                ]}
              >
                <Ionicons
                  name={i}
                  size={22}
                  color={icon === i ? colours.primary : colours.textSecondary}
                />
              </Pressable>
            ))}
          </View>
        </View>

        <PrimaryButton
          title={isEditing ? "Save Changes" : "Create Category"}
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
  previewRow: {
    alignItems: "center",
    gap: spacing.md,
    paddingVertical: spacing.base,
  },
  previewCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  previewName: {
    ...typography.subtitle,
    color: colours.textPrimary,
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
  swatchRow: {
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
  swatchSelected: {
    borderWidth: 2.5,
    borderColor: colours.textPrimary,
  },
  iconGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  iconOption: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colours.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colours.surface,
  },
  iconSelected: {
    borderColor: colours.primary,
    borderWidth: 2,
    backgroundColor: colours.primaryFaint,
  },
  saveButton: {
    marginTop: spacing.sm,
  },
});