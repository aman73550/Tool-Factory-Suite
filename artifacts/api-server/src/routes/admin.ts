import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, toolsTable, adZonesTable, adminTable, siteSettingsTable, scriptsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const ALL_AD_ZONES = [
  "HEADER_AD", "TOOL_TOP_AD", "TOOL_MIDDLE_AD", "RESULT_SECTION_AD",
  "SIDEBAR_TOP_AD", "SIDEBAR_BOTTOM_AD", "FOOTER_AD", "STICKY_BOTTOM_AD",
  "FLOATING_AD", "INLINE_CONTENT_AD"
];

const DEFAULT_SETTINGS: Record<string, string> = {
  siteName: "ToolsFactory",
  siteTagline: "Free Online Tools for Everyone",
  siteUrl: "https://toolsfactory.com",
  adminEmail: "admin@toolsfactory.com",
  footerText: "© 2025 ToolsFactory. All rights reserved.",
  defaultMetaTitle: "ToolsFactory — Free Online Tools",
  defaultMetaDescription: "Free online tools for developers, creators & professionals. QR codes, image compression, calculators, and more.",
  defaultKeywords: "free online tools, developer tools, image tools, calculators",
  theme: "light",
  feedbackEnabled: "true",
  analyticsEnabled: "true",
  autoPublishTools: "false",
  resultsPerPage: "20",
  emptySpaceAdsEnabled: "false",
};

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "toolsfactory_salt").digest("hex");
}

async function ensureDefaults() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@toolsfactory.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  const existing = await db.select().from(adminTable).where(eq(adminTable.email, adminEmail));
  if (existing.length === 0) {
    await db.insert(adminTable).values({ email: adminEmail, passwordHash: hashPassword(adminPassword) });
  }

  const zones = await db.select().from(adZonesTable);
  const existingZones = new Set(zones.map(z => z.zone));
  for (const zone of ALL_AD_ZONES) {
    if (!existingZones.has(zone)) {
      await db.insert(adZonesTable).values({ zone, enabled: 1, code: "", deviceTarget: "both" });
    }
  }

  const existingSettings = await db.select().from(siteSettingsTable);
  const settingsMap = new Set(existingSettings.map(s => s.key));
  for (const [key, value] of Object.entries(DEFAULT_SETTINGS)) {
    if (!settingsMap.has(key)) {
      await db.insert(siteSettingsTable).values({ key, value });
    }
  }
}

ensureDefaults().catch(console.error);

function isAdminAuthenticated(req: Request): boolean {
  const cookie = req.cookies?.admin_session;
  if (!cookie) return false;
  try {
    const { email } = JSON.parse(Buffer.from(cookie, "base64").toString());
    return !!email;
  } catch {
    return false;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  if (!isAdminAuthenticated(req)) {
    res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
    return;
  }
  next();
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "validation_error", message: "Email and password required" });
    const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email));
    if (!admin || admin.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
    }
    res.cookie("admin_session", Buffer.from(JSON.stringify({ email, ts: Date.now() })).toString("base64"), {
      httpOnly: true, maxAge: 86400000, sameSite: "strict",
    });
    res.json({ success: true, message: "Logged in successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Login failed" });
  }
});

router.post("/admin/logout", (req, res) => {
  res.clearCookie("admin_session");
  res.json({ success: true, message: "Logged out" });
});

router.get("/admin/me", (req, res) => {
  const cookie = req.cookies?.admin_session;
  if (!cookie) return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  try {
    const { email } = JSON.parse(Buffer.from(cookie, "base64").toString());
    res.json({ email, isAdmin: true });
  } catch {
    res.status(401).json({ error: "unauthorized", message: "Invalid session" });
  }
});

// ── TOOLS ─────────────────────────────────────────────────────────────────────

router.post("/admin/tools", requireAdmin, async (req, res) => {
  try {
    const { name, slug, category, description, logicFunction, keywords, faqData } = req.body;
    if (!name || !slug || !category || !description || !logicFunction) {
      return res.status(400).json({ error: "validation_error", message: "Missing required fields" });
    }
    const [tool] = await db.insert(toolsTable).values({
      name, slug, category, description, logicFunction,
      keywords: keywords || [], faqData: faqData || [], status: "active",
    }).returning();
    res.status(201).json(tool);
  } catch (err: any) {
    if (err.code === "23505") return res.status(409).json({ error: "conflict", message: "Tool with this slug already exists" });
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to create tool" });
  }
});

router.put("/admin/tools/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, category, description, logicFunction, keywords, faqData, status } = req.body;
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (category !== undefined) updates.category = category;
    if (description !== undefined) updates.description = description;
    if (logicFunction !== undefined) updates.logicFunction = logicFunction;
    if (keywords !== undefined) updates.keywords = keywords;
    if (faqData !== undefined) updates.faqData = faqData;
    if (status !== undefined) updates.status = status;
    const [tool] = await db.update(toolsTable).set(updates).where(eq(toolsTable.id, id)).returning();
    if (!tool) return res.status(404).json({ error: "not_found", message: "Tool not found" });
    res.json(tool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update tool" });
  }
});

router.delete("/admin/tools/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(toolsTable).where(eq(toolsTable.id, id));
    res.json({ success: true, message: "Tool deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to delete tool" });
  }
});

// ── ADS ───────────────────────────────────────────────────────────────────────

router.get("/admin/ads", requireAdmin, async (req, res) => {
  try {
    let zones = await db.select().from(adZonesTable);
    const existingZones = new Set(zones.map(z => z.zone));
    for (const zone of ALL_AD_ZONES) {
      if (!existingZones.has(zone)) {
        await db.insert(adZonesTable).values({ zone, enabled: 1, code: "", deviceTarget: "both" });
      }
    }
    zones = await db.select().from(adZonesTable);
    res.json({
      zones: zones.map(z => ({
        zone: z.zone, enabled: !!z.enabled, code: z.code || "", deviceTarget: z.deviceTarget || "both"
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch ad zones" });
  }
});

router.put("/admin/ads", requireAdmin, async (req, res) => {
  try {
    const { zones } = req.body;
    for (const zone of zones) {
      const existing = await db.select().from(adZonesTable).where(eq(adZonesTable.zone, zone.zone));
      if (existing.length > 0) {
        await db.update(adZonesTable)
          .set({ enabled: zone.enabled ? 1 : 0, code: zone.code || "", deviceTarget: zone.deviceTarget || "both", updatedAt: new Date() })
          .where(eq(adZonesTable.zone, zone.zone));
      } else {
        await db.insert(adZonesTable).values({ zone: zone.zone, enabled: zone.enabled ? 1 : 0, code: zone.code || "", deviceTarget: zone.deviceTarget || "both" });
      }
    }
    const updated = await db.select().from(adZonesTable);
    res.json({
      zones: updated.map(z => ({
        zone: z.zone, enabled: !!z.enabled, code: z.code || "", deviceTarget: z.deviceTarget || "both"
      }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update ad zones" });
  }
});

// ── SITE SETTINGS ─────────────────────────────────────────────────────────────

router.get("/admin/settings", requireAdmin, async (req, res) => {
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

router.put("/admin/settings", requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body as { settings: Record<string, string> };
    for (const [key, value] of Object.entries(settings)) {
      const existing = await db.select().from(siteSettingsTable).where(eq(siteSettingsTable.key, key));
      if (existing.length > 0) {
        await db.update(siteSettingsTable).set({ value: String(value), updatedAt: new Date() }).where(eq(siteSettingsTable.key, key));
      } else {
        await db.insert(siteSettingsTable).values({ key, value: String(value) });
      }
    }
    const rows = await db.select().from(siteSettingsTable);
    const updated: Record<string, string> = {};
    for (const row of rows) updated[row.key] = row.value;
    res.json({ settings: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update settings" });
  }
});

// ── SCRIPTS ───────────────────────────────────────────────────────────────────

router.get("/admin/scripts", requireAdmin, async (req, res) => {
  try {
    const scripts = await db.select().from(scriptsTable);
    res.json({ scripts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch scripts" });
  }
});

router.post("/admin/scripts", requireAdmin, async (req, res) => {
  try {
    const { name, code, placement, enabled } = req.body;
    if (!name || !code) return res.status(400).json({ error: "validation_error", message: "Name and code are required" });
    const [script] = await db.insert(scriptsTable).values({
      name, code, placement: placement || "head", enabled: enabled !== false ? 1 : 0,
    }).returning();
    res.status(201).json(script);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to create script" });
  }
});

router.put("/admin/scripts/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, code, placement, enabled } = req.body;
    const updates: Record<string, any> = { updatedAt: new Date() };
    if (name !== undefined) updates.name = name;
    if (code !== undefined) updates.code = code;
    if (placement !== undefined) updates.placement = placement;
    if (enabled !== undefined) updates.enabled = enabled ? 1 : 0;
    const [script] = await db.update(scriptsTable).set(updates).where(eq(scriptsTable.id, id)).returning();
    if (!script) return res.status(404).json({ error: "not_found", message: "Script not found" });
    res.json(script);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update script" });
  }
});

router.delete("/admin/scripts/:id", requireAdmin, async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(scriptsTable).where(eq(scriptsTable.id, id));
    res.json({ success: true, message: "Script deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to delete script" });
  }
});

export default router;
