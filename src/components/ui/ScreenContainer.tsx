import { ScrollView, StyleSheet, View, type ViewProps } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/src/theme/colors';
import { Spacing } from '@/src/theme/spacing';

type ScreenContainerProps = ViewProps & {
  /** Wrap content in a ScrollView */
  scrollable?: boolean;
  /** Apply standard horizontal screen padding */
  padded?: boolean;
  /** Safe area edges to inset; defaults to all */
  edges?: Edge[];
};

export function ScreenContainer({
  children,
  style,
  scrollable = false,
  padded = true,
  edges = ['top', 'bottom', 'left', 'right'],
  ...rest
}: ScreenContainerProps) {
  const scheme = (useColorScheme() ?? 'light') as 'light' | 'dark';
  const colors = Colors[scheme];

  const inner = scrollable ? (
    <ScrollView
      contentContainerStyle={[styles.scrollContent, padded && styles.padded]}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.fill, padded && styles.padded, style]} {...rest}>
      {children}
    </View>
  );

  return (
    <SafeAreaView
      edges={edges}
      style={[styles.fill, { backgroundColor: colors.background }]}
    >
      {inner}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  padded: {
    paddingHorizontal: Spacing.screenHorizontal,
  },
});
