import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/theme/colors';
import { Spacing } from '@/src/theme/spacing';
import { FontWeight, FontSize } from '@/src/theme/typography';

type SectionHeaderProps = ViewProps & {
  title: string;
  subtitle?: string;
  /** Label for the right-side action; requires onActionPress */
  actionLabel?: string;
  onActionPress?: () => void;
};

export function SectionHeader({
  title,
  subtitle,
  actionLabel,
  onActionPress,
  style,
  ...rest
}: SectionHeaderProps) {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[scheme];

  return (
    <View style={[styles.row, style]} {...rest}>
      <View style={styles.textGroup}>
        <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        ) : null}
      </View>

      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.action, { color: colors.primary }]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  textGroup: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 24,
  },
  subtitle: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 18,
  },
  action: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    lineHeight: 18,
  },
});
