import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View, ViewStyle } from "react-native";

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function EmptyState({
  icon = "layers-outline",
  title,
  message,
  actionLabel,
  onAction,
  style,
}: EmptyStateProps) {
  const { colours } = useTheme();
  const styles = makeStyles(colours);

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
      {actionLabel && onAction ? (
        <Pressable onPress={onAction}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.actionPressed,
          ]}
        >
          <Text style={styles.actionText}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: spacing["2xl"],
      paddingVertical: spacing["4xl"],
    },
    title: {
      ...typography.subtitle,
      color: c.textPrimary,
      marginTop: spacing.base,
      textAlign: "center",
    },
    message: {
      ...typography.caption,
      color: c.textSecondary,
      marginTop: spacing.sm,
      textAlign: "center",
      lineHeight: 20,
    },
    actionButton: {
      marginTop: spacing.base,
      paddingHorizontal: spacing.xl,
      paddingVertical: spacing.sm,
      borderRadius: radii.full,
      borderWidth: 1,
      borderColor: c.primary,
    },
    actionPressed: {
      backgroundColor: c.primaryFaint,
    },
    actionText: {
      ...typography.captionMedium,
      color: c.primary,
    },
  });
}
