import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, typography } from "@/src/theme";

type TabIcon = keyof typeof Ionicons.glyphMap;

const TAB_CONFIG: {
  name: string;
  title: string;
  iconFocused: TabIcon;
  iconDefault: TabIcon;
}[] = [
  {
    name: "dashboard",
    title: "Dashboard",
    iconFocused: "grid",
    iconDefault: "grid-outline",
  },
  {
    name: "trips",
    title: "Trips",
    iconFocused: "airplane",
    iconDefault: "airplane-outline",
  },
  {
    name: "activities",
    title: "Activities",
    iconFocused: "list",
    iconDefault: "list-outline",
  },
  {
    name: "insights",
    title: "Insights",
    iconFocused: "bar-chart",
    iconDefault: "bar-chart-outline",
  },
  {
    name: "settings",
    title: "Settings",
    iconFocused: "cog",
    iconDefault: "cog-outline",
  },
];

export default function TabsLayout() {
  const { colours } = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colours.primary,
        tabBarInactiveTintColor: colours.tabInactive,
        tabBarLabelStyle: typography.tabLabel,
        tabBarStyle: {
          backgroundColor: colours.surface,
          borderTopColor: colours.borderLight,
          borderTopWidth: 1,
          paddingBottom: 4,
          height: 56,
        },
      }}
    >
      {TAB_CONFIG.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.iconFocused : tab.iconDefault}
                size={size}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
