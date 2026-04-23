import { useAuth } from "@/src/auth";
import { AppHeader, PrimaryButton, ScreenContainer } from "@/src/components";
import { seedDatabase } from "@/src/db/seed";
import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { exportActivitiesCsv } from "@/src/utils/exportCsv";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Switch, Text, View } from "react-native";

// settings screen for users to manage their profile, categories, targets, and app preferences
const SETTINGS_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
  action?: string;
}[] = [
  { icon: "person-outline", label: "Profile" },
  { icon: "pricetags-outline", label: "Categories", route: "/categories" },
  { icon: "flag-outline", label: "Targets", route: "/targets" },
  { icon: "download-outline", label: "Export Activities CSV", action: "export" },
  { icon: "notifications-outline", label: "Notifications" },
  { icon: "information-circle-outline", label: "About" },
];

// settings screen for users to manage their profile, categories, targets, and app preferences
export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, deleteProfile } = useAuth();
  const { colours, theme, toggleTheme } = useTheme();
  const styles = makeStyles(colours);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    try {
      await exportActivitiesCsv(user.id);
    } catch (err) {
      Alert.alert(
        "Export Failed",
        err instanceof Error ? err.message : "An error occurred while exporting. Please try again."
      );
    }
  };

  const handleSeed = async () => {
    if (!user) return;
    await seedDatabase(user.id);
    Alert.alert("Database seeded with sample data. Go to Dashboard to see it.");
  }

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await logout();
      router.replace("/(auth)/welcome");
    } finally {
      setLoggingOut(false);
    }
  };

  // Deletes user, logs them out and redirects to welcome page
  const handleDeleteProfile = () => {
    Alert.alert(
      "Delete Profile",
      "Are you sure you want to delete your profile? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteProfile();
            router.replace("/(auth)/welcome");
          }
        },
      ]
    );
  };

  // Render settings options
  return (
    <ScreenContainer>
      <AppHeader
        title="Settings"
        subtitle={user ? user.name : undefined} />

      {/* Dark mode toggle */}
      <View style={[styles.list, styles.appearanceSection]}>
        <View style={styles.row}>
          <View style={styles.rowLeft}>
            <Ionicons name="moon-outline" size={22} color={colours.textSecondary} />
            <Text style={styles.rowLabel}>Dark Mode</Text>
          </View>
          <Switch
            value={theme === "dark"}
            onValueChange={toggleTheme}
            trackColor={{ false: colours.border, true: colours.primary }}
            thumbColor={colours.surface}
          />
        </View>
      </View>

      <View style={styles.list}>
        {SETTINGS_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
            onPress={() => {
              if (item.action === "export") handleExport();
              else if (item.route) router.push(item.route as never)
            }}
          >
            <View style={styles.rowLeft}>
              <Ionicons
                name={item.icon}
                size={22}
                color={colours.textSecondary}
              />
              <Text style={styles.rowLabel}>{item.label}</Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colours.textTertiary}
            />
          </Pressable>
        ))}
      </View>
      <View style={styles.actions}>
        <PrimaryButton
          title="Log Out"
          onPress={handleLogout}
          loading={loggingOut}
          />

          <Pressable onPress={handleDeleteProfile} style={styles.deleteButton}>
            <Text style={styles.deleteText}>Delete Profile</Text>
          </Pressable>

          <Pressable onPress={handleSeed} style={styles.deleteButton}>
            <Text style={[styles.deleteText, {color: colours.info}]}>Seed Database (dev only)</Text>
          </Pressable>
      </View>
    </ScreenContainer>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    appearanceSection: {
      marginBottom: spacing.md,
    },
    list: {
      marginTop: spacing.base,
      backgroundColor: c.surface,
      borderRadius: radii.lg,
      borderWidth: 1,
      borderColor: c.borderLight,
      overflow: "hidden",
    },
    row: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: spacing.base,
      paddingVertical: spacing.base,
      borderBottomWidth: 1,
      borderBottomColor: c.divider,
    },
    rowPressed: {
      backgroundColor: c.primaryFaint,
    },
    rowLeft: {
      flexDirection: "row",
      alignItems: "center",
      gap: spacing.md,
    },
    rowLabel: {
      ...typography.body,
      color: c.textPrimary,
    },
    actions: {
      marginTop: spacing.lg,
      gap: spacing.base,
    },
    deleteButton: {
      paddingVertical: spacing.sm,
      alignItems: "center",
    },
    deleteText: {
      ...typography.captionMedium,
      color: c.danger,
    },
  });
}
