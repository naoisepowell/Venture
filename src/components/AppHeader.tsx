import { StyleSheet, Text, View, ViewStyle } from "react-native";
import { useTheme, type Colours, typography, spacing } from "@/src/theme";

interface AppHeaderProps {
  title: string;
  subtitle?: string;
  style?: ViewStyle;
}

export function AppHeader({ title, subtitle, style }: AppHeaderProps) {
  const { colours } = useTheme();
  const styles = makeStyles(colours);

  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? (
        <Text style={styles.subtitle}>{subtitle}</Text>
      ) : null}
    </View>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    container: {
      paddingTop: spacing.lg,
      paddingBottom: spacing.base,
    },
    title: {
      ...typography.largeTitle,
      color: c.textPrimary,
    },
    subtitle: {
      ...typography.caption,
      color: c.textSecondary,
      marginTop: spacing.xs,
    },
  });
}
