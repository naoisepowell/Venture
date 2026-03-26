import { Pressable, StyleSheet, Text, View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/theme/colors';
import { Radius } from '@/src/theme/radius';
import { Spacing } from '@/src/theme/spacing';
import { FontSize, FontWeight } from '@/src/theme/typography';

type EmptyStateProps = ViewProps & {
  /** SF Symbol / icon name rendered above the title; pass a rendered element */
  icon?: React.ReactNode;
  title: string;
  message?: string;
  /** CTA button label; requires onActionPress */
  actionLabel?: string;
  onActionPress?: () => void;
};

export function EmptyState({
  icon,
  title,
  message,
  actionLabel,
  onActionPress,
  style,
  ...rest
}: EmptyStateProps) {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, style]} {...rest}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}

      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>

      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}

      {actionLabel && onActionPress ? (
        <Pressable
          onPress={onActionPress}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={styles.buttonLabel}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing['2xl'],
    gap: Spacing.sm,
  },
  iconWrap: {
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    lineHeight: 24,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.regular,
    lineHeight: 22,
    textAlign: 'center',
  },
  button: {
    marginTop: Spacing.md,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm + 2,
    borderRadius: Radius.button,
  },
  buttonLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: '#FFFFFF',
  },
});
