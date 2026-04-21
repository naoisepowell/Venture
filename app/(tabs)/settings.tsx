import { StyleSheet, Text, View, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { ScreenContainer, AppHeader } from "@/src/components";
import { colours, typography, spacing, radii } from "@/src/theme";

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

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <ScreenContainer>
      <AppHeader title="Settings" />

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
});
