import { Router, type IRouter } from "express";
import { db, adZonesTable } from "@workspace/db";

const router: IRouter = Router();

const AD_ZONES = [
  "HEADER_AD", "TOOL_TOP_AD", "TOOL_MIDDLE_AD", "RESULT_SECTION_AD",
  "SIDEBAR_TOP_AD", "SIDEBAR_BOTTOM_AD", "FOOTER_AD", "STICKY_BOTTOM_AD", "FLOATING_AD"
];

router.get("/ads", async (req, res) => {
  try {
    let zones = await db.select().from(adZonesTable);

    if (zones.length === 0) {
      zones = AD_ZONES.map((zone, i) => ({
        id: i + 1,
        zone,
        enabled: 1,
        code: "",
        updatedAt: new Date(),
      }));
    }

    res.json({
      zones: zones.map(z => ({
        zone: z.zone,
        enabled: !!z.enabled,
        code: z.code || "",
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch ad zones" });
  }
});

export default router;
