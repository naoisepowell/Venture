import { useAuth } from "@/src/auth";
import { AppHeader, PrimaryButton, ScreenContainer } from "@/src/components";
import { colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";

// settings screen for users to manage their profile, categories, targets, and app preferences
const SETTINGS_ITEMS: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  route?: string;
}[] = [
  { icon: "person-outline", label: "Profile" },
  { icon: "pricetags-outline", label: "Categories", route: "/categories" },
  { icon: "flag-outline", label: "Targets", route: "/targets" },
  { icon: "notifications-outline", label: "Notifications" },
  { icon: "information-circle-outline", label: "About" },
];

// settings screen for users to manage their profile, categories, targets, and app preferences
export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout, deleteProfile } = useAuth();
  const [loggingOut, setLoggingOut] = useState(false);

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

      <View style={styles.list}>
        {SETTINGS_ITEMS.map((item) => (
          <Pressable
            key={item.label}
            style={({ pressed }) => [
              styles.row,
              pressed && styles.rowPressed,
            ]}
            onPress={() => item.route && router.push(item.route as never)}
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
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: spacing.base,
    backgroundColor: colours.surface,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colours.borderLight,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: colours.divider,
  },
  rowPressed: {
    backgroundColor: colours.primaryFaint,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  rowLabel: {
    ...typography.body,
    color: colours.textPrimary,
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
    color: colours.danger,
  },
});
