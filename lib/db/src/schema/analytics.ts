import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const analyticsTable = pgTable("analytics", {
  id: serial("id").primaryKey(),
  toolSlug: text("tool_slug").notNull(),
  date: text("date").notNull(),
  views: integer("views").notNull().default(0),
});

export const adZonesTable = pgTable("ad_zones", {
  id: serial("id").primaryKey(),
  zone: text("zone").notNull().unique(),
  enabled: integer("enabled").notNull().default(1),
  code: text("code").default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analyticsTable).omit({ id: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analyticsTable.$inferSelect;

export const insertAdZoneSchema = createInsertSchema(adZonesTable).omit({ id: true, updatedAt: true });
export type InsertAdZone = z.infer<typeof insertAdZoneSchema>;
export type AdZone = typeof adZonesTable.$inferSelect;
