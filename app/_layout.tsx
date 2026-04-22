import { AuthProvider } from "@/src/auth";
import { initialiseDatabase } from "@/src/db/init";
import { colours } from "@/src/theme";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";


SplashScreen.preventAutoHideAsync();

// checks if app is ready to load
export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prepares the app by initializing the database and handling any errors
  useEffect(() => {
    let isMounted = true;

    const prepareApp = async () => {
      try {
        await initialiseDatabase();
        if (isMounted) {
          setReady(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error ? err.message : "Database initialisation failed"
          );
        }
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // shows nothing while app is loading
  if (!ready && !error) {
    return null;
  }

  // error message if app setup fails
  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          padding: 24,
          backgroundColor: colours.background,
        }}
      >
        <StatusBar style="dark" />
        <Text>{error}</Text>
      </View>
    );
  }

  // renders the app if setup is successful
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colours.background },
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="trip/[id]"
          options={{ animation: "slide_from_bottom" }}
        />
        <Stack.Screen name="trip/form" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="categories" />
        <Stack.Screen name="category/form" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="targets" />
        <Stack.Screen name="activity/form" options={{ animation: "slide_from_bottom" }} />
        <Stack.Screen name="target/form" options={{ animation: "slide_from_bottom" }} />
      </Stack>
    </AuthProvider>
  );
}
