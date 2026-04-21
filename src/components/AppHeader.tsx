import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { colours, typography, spacing } from "@/src/theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function AppHeader({ title, subtitle, style }: AppHeaderProps) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  title: {
    ...typography.largeTitle,
    color: colours.textPrimary,
  },
  subtitle: {
    ...typography.caption,
    color: colours.textSecondary,
    marginTop: spacing.xs,
  },
});
