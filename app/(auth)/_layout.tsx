import { Stack } from "expo-router";
import { useTheme } from "@/src/theme";

export default function AuthLayout() {
  const { colours } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colours.background },
        animation: "slide_from_right",
      }}
    />
  );
}
