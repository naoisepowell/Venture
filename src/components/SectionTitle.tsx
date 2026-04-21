import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colours, typography, spacing } from "@/src/theme";

interface SectionTitleProps {
  title: string;
  action?: string;
  onAction?: () => void;
  style?: ViewStyle;
}

export function SectionTitle({
  title,
  action,
  onAction,
  style,
}: SectionTitleProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {action ? (
        <Text style={styles.action} onPress={onAction}>
          {action}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.sm,
  },
  title: {
    ...typography.subtitle,
    color: colours.textPrimary,
  },
  action: {
    ...typography.captionMedium,
    color: colours.primary,
  },
});
