import { db } from "@/src/db/client";
import { activities, categories, trips } from "@/src/db/schema";
import { eq } from "drizzle-orm";
import { File as FSFile, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

// Makes values safe to use in CSV file
function escapeCsv(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Exports users activities into CSV file and opens share menu for file to be saved or sent
export async function exportActivitiesCsv(userId: number) {
  const rows = await db
    .select({
      title: activities.title,
      date: activities.date,
      status: activities.status,
      metricType: activities.metricType,
      metricValue: activities.metricValue,
      location: activities.location,
      notes: activities.notes,
      tripTitle: trips.title,
      tripCountry: trips.countryOrRegion,
      categoryName: categories.name,
    })
    .from(activities)
    .innerJoin(trips, eq(activities.tripId, trips.id))
    .innerJoin(categories, eq(activities.categoryId, categories.id))
    .where(eq(trips.userId, userId))
    .orderBy(activities.date);

  if (rows.length === 0) {
    throw new Error("No activities to export.");
  }

  // Column headers for CSV file
  const headers = [
    "Title",
    "Date",
    "Status",
    "Metric Type",
    "Metric Value",
    "Location",
    "Notes",
    "Trip",
    "Country/Region",
    "Category",
  ];

  // Builds CSV file as array of lines
  const csvLines = [
    headers.join(","),
    ...rows.map((r) =>
      [
        escapeCsv(r.title),
        escapeCsv(r.date),
        escapeCsv(r.status),
        escapeCsv(r.metricType),
        escapeCsv(r.metricValue),
        escapeCsv(r.location),
        escapeCsv(r.notes),
        escapeCsv(r.tripTitle),
        escapeCsv(r.tripCountry),
        escapeCsv(r.categoryName),
      ].join(",")
    ),
  ];

  const csv = csvLines.join("\n");
  const filename = `venture-activities-${new Date().toISOString().split("T")[0]}.csv`;
  const file = new FSFile(Paths.document, filename);
  file.write(csv);

  // Opens sharing menu for user to export
  await Sharing.shareAsync(file.uri, {
    mimeType: "text/csv",
    dialogTitle: "Export Activities",
    UTI: "public.comma-separated-values-text",
  });
}