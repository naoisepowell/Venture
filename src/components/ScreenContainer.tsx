import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colours, screenPadding } from "@/src/theme";

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  edges?: ("top" | "bottom" | "left" | "right")[];
}

export function ScreenContainer({
  children,
  style,
  padded = true,
  edges = ["top", "bottom"],
}: ScreenContainerProps) {
  return (
    <SafeAreaView style={styles.safe} edges={edges}>
      <View
        style={[
          styles.container,
          padded && styles.padded,
          style,
        ]}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colours.background,
  },
  container: {
    flex: 1,
    backgroundColor: colours.background,
  },
  padded: {
    paddingHorizontal: screenPadding.horizontal,
  },
});
