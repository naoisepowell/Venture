import { useAuth } from "@/src/auth";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

// main entry point of the app, redirects to welcome screen for authentication flow
export default function Index() {
  const { user, loading } = useAuth();
  
  // Show loading indicator while checking authentication status
  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Redirect to the appropriate screen based on authentication status
  if (user) {
    return <Redirect href="/(tabs)/dashboard" />;
  } else {
    return <Redirect href="/(auth)/welcome" />;
  }

}

