import { Router, type IRouter } from "express";
import { db, adZonesTable, siteSettingsTable, scriptsTable } from "@workspace/db";

const router: IRouter = Router();

const DEFAULT_ZONES = [
  "HEADER_AD", "TOOL_TOP_AD", "TOOL_MIDDLE_AD", "RESULT_SECTION_AD",
  "SIDEBAR_TOP_AD", "SIDEBAR_BOTTOM_AD", "FOOTER_AD", "STICKY_BOTTOM_AD",
  "FLOATING_AD", "INLINE_CONTENT_AD"
];

router.get("/ads", async (req, res) => {
  try {
    let zones = await db.select().from(adZonesTable);
    if (zones.length === 0) {
      zones = DEFAULT_ZONES.map((zone, i) => ({
        id: i + 1, zone, enabled: 1, code: "", deviceTarget: "both", updatedAt: new Date(),
      }));
    }
    res.json({
      zones: zones.map(z => ({
        zone: z.zone, enabled: !!z.enabled, code: z.code || "", deviceTarget: z.deviceTarget || "both",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch ad zones" });
  }
});

router.get("/settings", async (req, res) => {
  try {
    const rows = await db.select().from(siteSettingsTable);
    const settings: Record<string, string> = {};
    for (const row of rows) settings[row.key] = row.value;
    res.json({ settings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch settings" });
  }
});

router.get("/scripts", async (req, res) => {
  try {
    const scripts = await db.select().from(scriptsTable);
    res.json({ scripts: scripts.filter(s => !!s.enabled) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch scripts" });
  }
});

export default router;
