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
  deviceTarget: text("device_target").notNull().default("both"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettingsTable = pgTable("site_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull().default(""),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const scriptsTable = pgTable("scripts", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  placement: text("placement").notNull().default("head"),
  enabled: integer("enabled").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnalyticsSchema = createInsertSchema(analyticsTable).omit({ id: true });
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Analytics = typeof analyticsTable.$inferSelect;

export const insertAdZoneSchema = createInsertSchema(adZonesTable).omit({ id: true, updatedAt: true });
export type InsertAdZone = z.infer<typeof insertAdZoneSchema>;
export type AdZone = typeof adZonesTable.$inferSelect;

export const insertSiteSettingSchema = createInsertSchema(siteSettingsTable).omit({ updatedAt: true });
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettingsTable.$inferSelect;

export const insertScriptSchema = createInsertSchema(scriptsTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertScript = z.infer<typeof insertScriptSchema>;
export type Script = typeof scriptsTable.$inferSelect;
