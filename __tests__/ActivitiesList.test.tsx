// Uses a fake in-memory database instead of the real one
jest.mock("@/src/db/client", () => {
  const Database = require("better-sqlite3");
  const { drizzle } = require("drizzle-orm/better-sqlite3");
  const schema = require("@/src/db/schema");

  // Same tables as the real app
  const sqlite = new Database(":memory:");
  sqlite.exec(`
    CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE trips (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, title TEXT NOT NULL, country_or_region TEXT NOT NULL, start_date TEXT NOT NULL, end_date TEXT NOT NULL, description TEXT, theme_colour TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE categories (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, name TEXT NOT NULL, colour TEXT NOT NULL, icon TEXT NOT NULL, created_at INTEGER NOT NULL);
    CREATE TABLE activities (id INTEGER PRIMARY KEY AUTOINCREMENT, trip_id INTEGER NOT NULL, category_id INTEGER NOT NULL, title TEXT NOT NULL, date TEXT NOT NULL, metric_type TEXT NOT NULL, metric_value REAL NOT NULL, status TEXT NOT NULL, notes TEXT, location TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL);
    CREATE TABLE targets (id INTEGER PRIMARY KEY AUTOINCREMENT, user_id INTEGER NOT NULL, trip_id INTEGER, category_id INTEGER, period_type TEXT NOT NULL, target_metric_type TEXT NOT NULL, target_value REAL NOT NULL, created_at INTEGER NOT NULL);
  `);

  return { db: drizzle(sqlite, { schema }) };
});

// Makes data load on mount instead of waiting for screen focus
jest.mock("expo-router", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useFocusEffect: (cb: Function) => {
    const { useEffect } = require("react");
    useEffect(cb, []);
  },
}));

// Gives the screen a logged in user to work with
jest.mock("@/src/auth", () => ({
  useAuth: () => ({ user: { id: 1 } }),
}));

// Swaps SafeAreaView for a plain view since native layout isnt available in tests
jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

import { render, waitFor } from "@testing-library/react-native";
import { seedDatabase } from "@/src/db/seed";
import ActivitiesScreen from "@/app/(tabs)/activities";

describe("Integration: ActivitiesScreen", () => {
  // Seeds the database before rendering so there is data to display
  beforeAll(async () => {
    await seedDatabase(1);
  });

  it("displays seeded activity titles after database initialisation", async () => {
    const { getByText } = render(<ActivitiesScreen />);

    // Activities are sorted by date descending so the most recent ones appear first
    await waitFor(() => {
      expect(getByText("Uluwatu sunset")).toBeTruthy();
    });

    expect(getByText("Surfing lesson")).toBeTruthy();
    expect(getByText("Seafood sunset dinner")).toBeTruthy();
  });
});
