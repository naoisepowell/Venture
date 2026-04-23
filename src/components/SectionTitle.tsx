import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme, type Colours, typography, spacing } from "@/src/theme";

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
  const { colours } = useTheme();
  const styles = makeStyles(colours);

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

function makeStyles(c: Colours) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: spacing.sm,
    },
    title: {
      ...typography.subtitle,
      color: c.textPrimary,
    },
    action: {
      ...typography.captionMedium,
      color: c.primary,
    },
  });
}
