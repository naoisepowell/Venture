import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import { colours, typography, radii, spacing } from "@/src/theme";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: "filled" | "outline";
  style?: ViewStyle;
}

export function PrimaryButton({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = "filled",
  style,
}: PrimaryButtonProps) {
  const isFilled = variant === "filled";

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        isFilled ? styles.filled : styles.outline,
        pressed && (isFilled ? styles.filledPressed : styles.outlinePressed),
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={isFilled ? colours.textInverse : colours.primary}
        />
      ) : (
        <Text
          style={[
            styles.label,
            isFilled ? styles.filledLabel : styles.outlineLabel,
          ]}
        >
          {title}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 52,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  filled: {
    backgroundColor: colours.primary,
  },
  filledPressed: {
    backgroundColor: colours.primaryDark,
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: colours.primary,
  },
  outlinePressed: {
    backgroundColor: colours.primaryFaint,
  },
  disabled: {
    opacity: 0.5,
  },
  label: {
    ...typography.button,
  },
  filledLabel: {
    color: colours.textInverse,
  },
  outlineLabel: {
    color: colours.primary,
  },
});
