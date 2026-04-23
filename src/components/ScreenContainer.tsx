import { ReactNode } from "react";
import { StyleSheet, View, ViewStyle } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme, type Colours, screenPadding } from "@/src/theme";

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
  const { colours } = useTheme();
  const styles = makeStyles(colours);

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

function makeStyles(c: Colours) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.background,
    },
    container: {
      flex: 1,
      backgroundColor: c.background,
    },
    padded: {
      paddingHorizontal: screenPadding.horizontal,
    },
  });
}
