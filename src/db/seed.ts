import { eq } from "drizzle-orm";
import { db } from "./client";
import { activities, categories, targets, trips } from "./schema";

// Fills database with sample data for one user
// Only runs if user doesnt already have trips saved
export async function seedDatabase(userId: number) {
  const existing = await db
    .select({ id: trips.id })
    .from(trips)
    .where(eq(trips.userId, userId))
    .limit(1);

  if (existing.length > 0) return;

  const now = Date.now();

  // Creates sample trip and keeps ID for linking
  const [trip] = await db.insert(trips).values({
    userId,
    title: "Southeast Asia",
    countryOrRegion: "Thailand, Vietnam, Indonesia",
    startDate: "2026-03-15",
    endDate: "2026-05-15",
    description: "Two months backpacking — Bangkok, Chiang Mai, Hanoi, HCMC, Bali.",
    themeColour: "#0891B2",
    createdAt: now,
  }).returning({ id: trips.id });

  const tripId = trip.id;

  // Sample categories
  const catValues = [
    { userId, name: "Sightseeing", colour: "#2563EB", icon: "camera-outline", createdAt: now },
    { userId, name: "Nightlife", colour: "#7C3AED", icon: "wine-outline", createdAt: now },
    { userId, name: "Adventure", colour: "#059669", icon: "fitness-outline", createdAt: now },
    { userId, name: "Food", colour: "#EA580C", icon: "restaurant-outline", createdAt: now },
    { userId, name: "Transport", colour: "#475569", icon: "train-outline", createdAt: now },
    { userId, name: "Culture", colour: "#DB2777", icon: "book-outline", createdAt: now },
  ];

  // Inserts catgeories and returns their IDs so they can be linked to activities
  const catRows = await db.insert(categories).values(catValues).returning({ id: categories.id, name: categories.name });

  const catId = (name: string) => catRows.find((c) => c.name === name)!.id;

  //Sample activities
  const a = [
    { tripId, categoryId: catId("Transport"), title: "Flight to Bangkok", date: "2026-03-15", metricType: "hours", metricValue: 12, status: "completed", notes: null, location: "Bangkok", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Grand Palace", date: "2026-03-17", metricType: "hours", metricValue: 3.5, status: "completed", notes: null, location: "Bangkok", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Food"), title: "Chinatown street food", date: "2026-03-18", metricType: "hours", metricValue: 2.5, status: "completed", notes: null, location: "Bangkok", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Nightlife"), title: "Khao San Road", date: "2026-03-19", metricType: "hours", metricValue: 4, status: "completed", notes: null, location: "Bangkok", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Transport"), title: "Train to Chiang Mai", date: "2026-03-21", metricType: "hours", metricValue: 13, status: "completed", notes: "Overnight sleeper", location: "Thailand", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Adventure"), title: "Doi Inthanon trek", date: "2026-03-23", metricType: "hours", metricValue: 7, status: "completed", notes: null, location: "Chiang Mai", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Culture"), title: "Monk chat", date: "2026-03-24", metricType: "hours", metricValue: 1.5, status: "completed", notes: null, location: "Chiang Mai", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Doi Suthep", date: "2026-03-25", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Chiang Mai", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Nightlife"), title: "Night bazaar", date: "2026-03-26", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Chiang Mai", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Food"), title: "Cooking class", date: "2026-03-27", metricType: "hours", metricValue: 4, status: "completed", notes: null, location: "Chiang Mai", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Transport"), title: "Flight to Hanoi", date: "2026-03-30", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Vietnam", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Old Quarter walk", date: "2026-04-01", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Hanoi", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Food"), title: "Bun cha lunch", date: "2026-04-01", metricType: "hours", metricValue: 1.5, status: "completed", notes: null, location: "Hanoi", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Adventure"), title: "Ha Long Bay cruise", date: "2026-04-03", metricType: "hours", metricValue: 18, status: "completed", notes: "Overnight with kayaking", location: "Ha Long Bay", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Culture"), title: "Ho Chi Minh Mausoleum", date: "2026-04-07", metricType: "hours", metricValue: 2, status: "completed", notes: null, location: "Hanoi", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Nightlife"), title: "Bia hoi corner", date: "2026-04-08", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Hanoi", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Transport"), title: "Train to HCMC", date: "2026-04-10", metricType: "hours", metricValue: 34, status: "completed", notes: "Stopped in Hue and Hoi An", location: "Vietnam", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Cu Chi Tunnels", date: "2026-04-14", metricType: "hours", metricValue: 5, status: "completed", notes: null, location: "Ho Chi Minh City", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Nightlife"), title: "Bui Vien Street", date: "2026-04-15", metricType: "hours", metricValue: 4, status: "completed", notes: null, location: "Ho Chi Minh City", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Food"), title: "Banh mi and pho crawl", date: "2026-04-16", metricType: "hours", metricValue: 3, status: "completed", notes: null, location: "Ho Chi Minh City", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Transport"), title: "Flight to Bali", date: "2026-04-20", metricType: "hours", metricValue: 4, status: "completed", notes: null, location: "Indonesia", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Adventure"), title: "Mount Batur sunrise", date: "2026-04-22", metricType: "hours", metricValue: 6, status: "planned", notes: null, location: "Bali", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Rice terraces and monkey forest", date: "2026-04-23", metricType: "hours", metricValue: 5, status: "planned", notes: null, location: "Ubud", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Culture"), title: "Water temple visit", date: "2026-04-24", metricType: "hours", metricValue: 2, status: "planned", notes: null, location: "Bali", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Adventure"), title: "Snorkelling day trip", date: "2026-04-26", metricType: "hours", metricValue: 8, status: "planned", notes: null, location: "Nusa Penida", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Nightlife"), title: "Beach clubs", date: "2026-04-28", metricType: "hours", metricValue: 5, status: "planned", notes: null, location: "Seminyak", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Food"), title: "Seafood sunset dinner", date: "2026-04-29", metricType: "hours", metricValue: 2.5, status: "planned", notes: null, location: "Jimbaran", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Adventure"), title: "Surfing lesson", date: "2026-05-01", metricType: "hours", metricValue: 3, status: "planned", notes: null, location: "Canggu", createdAt: now, updatedAt: now },
    { tripId, categoryId: catId("Sightseeing"), title: "Uluwatu sunset", date: "2026-05-03", metricType: "hours", metricValue: 2.5, status: "planned", notes: null, location: "Uluwatu", createdAt: now, updatedAt: now },
  ];

  // Insert sample activities
  await db.insert(activities).values(a);

  // Sample targets
  await db.insert(targets).values([
    { userId, tripId, categoryId: catId("Sightseeing"), periodType: "weekly", targetMetricType: "hours", targetValue: 8, createdAt: now },
    { userId, tripId, categoryId: catId("Adventure"), periodType: "weekly", targetMetricType: "hours", targetValue: 6, createdAt: now },
    { userId, tripId, categoryId: catId("Nightlife"), periodType: "weekly", targetMetricType: "hours", targetValue: 4, createdAt: now },
    { userId, tripId, categoryId: catId("Food"), periodType: "monthly", targetMetricType: "hours", targetValue: 12, createdAt: now },
    { userId, tripId, categoryId: null, periodType: "monthly", targetMetricType: "hours", targetValue: 60, createdAt: now },
    { userId, tripId: null, categoryId: catId("Culture"), periodType: "monthly", targetMetricType: "hours", targetValue: 6, createdAt: now },
  ]);
}