import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colours, typography, spacing } from "@/src/theme";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  style?: ViewStyle;
}

export function EmptyState({
  icon = "layers-outline",
  title,
  message,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.container, style]}>
      <Ionicons
        name={icon}
        size={48}
        color={colours.primaryMuted}
      />
      <Text style={styles.title}>{title}</Text>
      {message ? (
        <Text style={styles.message}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing["2xl"],
    paddingVertical: spacing["4xl"],
  },
  title: {
    ...typography.subtitle,
    color: colours.textPrimary,
    marginTop: spacing.base,
    textAlign: "center",
  },
  message: {
    ...typography.caption,
    color: colours.textSecondary,
    marginTop: spacing.sm,
    textAlign: "center",
    lineHeight: 20,
  },
});
