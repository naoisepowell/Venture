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

import { db } from "@/src/db/client";
import { seedDatabase } from "@/src/db/seed";
import { activities, categories, targets, trips } from "@/src/db/schema";

const tdb = db as any;

describe("Unit: seedDatabase", () => {
  // Seeds once before all tests run
  beforeAll(async () => {
    await seedDatabase(1);
  });

  // Checks all four tables have rows after seeding
  it("inserts rows into all four core tables", () => {
    expect(tdb.select().from(trips).all().length).toBeGreaterThan(0);
    expect(tdb.select().from(categories).all().length).toBeGreaterThan(0);
    expect(tdb.select().from(activities).all().length).toBeGreaterThan(0);
    expect(tdb.select().from(targets).all().length).toBeGreaterThan(0);
  });

  // Checks the exact counts match what is defined in seed.ts
  it("inserts the expected sample counts", () => {
    expect(tdb.select().from(trips).all()).toHaveLength(1);
    expect(tdb.select().from(categories).all()).toHaveLength(6);
    expect(tdb.select().from(activities).all()).toHaveLength(29);
    expect(tdb.select().from(targets).all()).toHaveLength(6);
  });

  // Calls seedDatabase a second time and confirms nothing extra was added
  it("does not duplicate rows when called a second time", async () => {
    const before = {
      trips: tdb.select().from(trips).all().length,
      categories: tdb.select().from(categories).all().length,
      activities: tdb.select().from(activities).all().length,
      targets: tdb.select().from(targets).all().length,
    };

    await seedDatabase(1);

    expect(tdb.select().from(trips).all()).toHaveLength(before.trips);
    expect(tdb.select().from(categories).all()).toHaveLength(before.categories);
    expect(tdb.select().from(activities).all()).toHaveLength(before.activities);
    expect(tdb.select().from(targets).all()).toHaveLength(before.targets);
  });
});
