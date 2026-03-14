import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, toolsTable, adZonesTable, adminTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

const AD_ZONES = [
  "HEADER_AD", "TOOL_TOP_AD", "TOOL_MIDDLE_AD", "RESULT_SECTION_AD",
  "SIDEBAR_TOP_AD", "SIDEBAR_BOTTOM_AD", "FOOTER_AD", "STICKY_BOTTOM_AD", "FLOATING_AD"
];

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "toolsfactory_salt").digest("hex");
}

async function ensureAdminAndZones() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@toolsfactory.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  const existing = await db.select().from(adminTable).where(eq(adminTable.email, adminEmail));
  if (existing.length === 0) {
    await db.insert(adminTable).values({
      email: adminEmail,
      passwordHash: hashPassword(adminPassword),
    });
  }
  
  const zones = await db.select().from(adZonesTable);
  if (zones.length === 0) {
    await db.insert(adZonesTable).values(
      AD_ZONES.map(zone => ({ zone, enabled: 1, code: "" }))
    );
  }
}

ensureAdminAndZones().catch(console.error);

declare module "express-serve-static-core" {
  interface Request {
    adminEmail?: string;
  }
}

function requireAdmin(req: Request, res: Response, next: NextFunction): void {
  const session = (req as any).session;
  if (!session?.adminEmail) {
    res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
    return;
  }
  req.adminEmail = session.adminEmail;
  next();
}

router.post("/admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: "validation_error", message: "Email and password required" });
    }
    
    const [admin] = await db.select().from(adminTable).where(eq(adminTable.email, email));
    
    if (!admin || admin.passwordHash !== hashPassword(password)) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid credentials" });
    }
    
    (req as any).session = { adminEmail: email };
    
    res.cookie("admin_session", Buffer.from(JSON.stringify({ email, ts: Date.now() })).toString("base64"), {
      httpOnly: true,
      maxAge: 86400000,
      sameSite: "strict",
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
  if (!cookie) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
  try {
    const { email } = JSON.parse(Buffer.from(cookie, "base64").toString());
    res.json({ email, isAdmin: true });
  } catch {
    res.status(401).json({ error: "unauthorized", message: "Invalid session" });
  }
});

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

router.post("/admin/tools", async (req, res) => {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
  try {
    const { name, slug, category, description, logicFunction, keywords, faqData } = req.body;
    
    if (!name || !slug || !category || !description || !logicFunction) {
      return res.status(400).json({ error: "validation_error", message: "Missing required fields" });
    }
    
    const [tool] = await db.insert(toolsTable).values({
      name,
      slug,
      category,
      description,
      logicFunction,
      keywords: keywords || [],
      faqData: faqData || [],
      status: "active",
    }).returning();
    
    res.status(201).json(tool);
  } catch (err: any) {
    if (err.code === "23505") {
      return res.status(409).json({ error: "conflict", message: "Tool with this slug already exists" });
    }
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to create tool" });
  }
});

router.put("/admin/tools/:id", async (req, res) => {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
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
    
    const [tool] = await db.update(toolsTable)
      .set(updates)
      .where(eq(toolsTable.id, id))
      .returning();
    
    if (!tool) {
      return res.status(404).json({ error: "not_found", message: "Tool not found" });
    }
    
    res.json(tool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update tool" });
  }
});

router.delete("/admin/tools/:id", async (req, res) => {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
  try {
    const id = Number(req.params.id);
    await db.delete(toolsTable).where(eq(toolsTable.id, id));
    res.json({ success: true, message: "Tool deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to delete tool" });
  }
});

router.get("/admin/ads", async (req, res) => {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
  try {
    const zones = await db.select().from(adZonesTable);
    res.json({ zones: zones.map(z => ({ zone: z.zone, enabled: !!z.enabled, code: z.code || "" })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch ad zones" });
  }
});

router.put("/admin/ads", async (req, res) => {
  if (!isAdminAuthenticated(req)) {
    return res.status(401).json({ error: "unauthorized", message: "Not authenticated" });
  }
  
  try {
    const { zones } = req.body;
    
    for (const zone of zones) {
      await db.update(adZonesTable)
        .set({ enabled: zone.enabled ? 1 : 0, code: zone.code || "", updatedAt: new Date() })
        .where(eq(adZonesTable.zone, zone.zone));
    }
    
    const updated = await db.select().from(adZonesTable);
    res.json({ zones: updated.map(z => ({ zone: z.zone, enabled: !!z.enabled, code: z.code || "" })) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update ad zones" });
  }
});

export default router;
