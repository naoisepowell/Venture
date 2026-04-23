import { useTheme, type Colours, radii, spacing, typography } from "@/src/theme";
import { StyleSheet, Text, TextInput, View } from "react-native";

// Defines the props a form field needs to render and handle input
interface FormFieldProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: "default" | "numeric" | "email-address";
}

// Reusable labelled text input for use across forms in the app
export function FormField({
  label,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = "default",
}: FormFieldProps) {
  const { colours } = useTheme();
  const styles = makeStyles(colours);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colours.textTertiary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
    </View>
  );
}

function makeStyles(c: Colours) {
  return StyleSheet.create({
    container: {
      gap: spacing.xs,
    },
    label: {
      ...typography.captionMedium,
      color: c.textSecondary,
    },
    input: {
      height: 44,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: radii.md,
      paddingHorizontal: spacing.md,
      ...typography.body,
      color: c.textPrimary,
      backgroundColor: c.surface,
    },
  });
}
