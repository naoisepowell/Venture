import { ActivityIndicator, StyleSheet, Text, View, type ViewProps } from 'react-native';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/theme/colors';
import { Spacing } from '@/src/theme/spacing';
import { FontSize, FontWeight } from '@/src/theme/typography';

type LoadingStateProps = ViewProps & {
  message?: string;
  size?: 'small' | 'large';
};

export function LoadingState({
  message,
  size = 'large',
  style,
  ...rest
}: LoadingStateProps) {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[scheme];

  return (
    <View style={[styles.container, style]} {...rest}>
      <ActivityIndicator size={size} color={colors.primary} />
      {message ? (
        <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  message: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.regular,
    lineHeight: 20,
    textAlign: 'center',
    marginTop: Spacing.xs,
  },
});
