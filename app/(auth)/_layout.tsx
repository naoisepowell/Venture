import { Stack } from "expo-router";
import { colours } from "@/src/theme";

export default function AuthLayout() {
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
