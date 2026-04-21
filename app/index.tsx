import { Redirect } from "expo-router";

// main entry point of the app, redirects to welcome screen for authentication flow
export default function Index() {
  return <Redirect href="/(auth)/welcome" />;
}

