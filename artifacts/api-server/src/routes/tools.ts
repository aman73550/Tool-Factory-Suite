import { Router, type IRouter } from "express";
import { db, toolsTable, analyticsTable } from "@workspace/db";
import { eq, ilike, or, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/tools", async (req, res) => {
  try {
    const { category, search, limit = "50", offset = "0" } = req.query as Record<string, string>;
    
    let query = db.select().from(toolsTable).where(eq(toolsTable.status, "active"));
    
    const allTools = await db.select().from(toolsTable).where(eq(toolsTable.status, "active"));
    
    let filtered = allTools;
    if (category) {
      filtered = filtered.filter(t => t.category === category);
    }
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(s) || 
        t.description.toLowerCase().includes(s) ||
        t.category.toLowerCase().includes(s)
      );
    }
    
    const categories = [...new Set(allTools.map(t => t.category))];
    const total = filtered.length;
    const tools = filtered.slice(Number(offset), Number(offset) + Number(limit));
    
    res.json({ tools, total, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch tools" });
  }
});

router.get("/tools/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, slug));
    
    if (!tool) {
      return res.status(404).json({ error: "not_found", message: "Tool not found" });
    }
    
    res.json(tool);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch tool" });
  }
});

router.post("/tools/:slug/view", async (req, res) => {
  try {
    const { slug } = req.params;
    
    await db.update(toolsTable)
      .set({ viewCount: sql`${toolsTable.viewCount} + 1` })
      .where(eq(toolsTable.slug, slug));
    
    const today = new Date().toISOString().split("T")[0];
    const existing = await db.select().from(analyticsTable)
      .where(eq(analyticsTable.toolSlug, slug));
    const todayEntry = existing.find(e => e.date === today);
    
    if (todayEntry) {
      await db.update(analyticsTable)
        .set({ views: sql`${analyticsTable.views} + 1` })
        .where(eq(analyticsTable.id, todayEntry.id));
    } else {
      await db.insert(analyticsTable).values({ toolSlug: slug, date: today, views: 1 });
    }
    
    res.json({ success: true, message: "View recorded" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to record view" });
  }
});

export default router;
