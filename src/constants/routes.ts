export const Routes = {
  AUTH: {
    WELCOME: "/(auth)/welcome",
    LOGIN: "/(auth)/login",
    REGISTER: "/(auth)/register",
  },
  TABS: {
    DASHBOARD: "/(tabs)/dashboard",
    TRIPS: "/(tabs)/trips",
    ACTIVITIES: "/(tabs)/activities",
    INSIGHTS: "/(tabs)/insights",
    SETTINGS: "/(tabs)/settings",
  },
  TRIP_DETAIL: "/trip/[id]",
  CATEGORIES: "/categories",
  TARGETS: "/targets",
} as const;
