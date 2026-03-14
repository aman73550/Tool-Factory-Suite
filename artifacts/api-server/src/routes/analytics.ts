import { Router, type IRouter } from "express";
import { db, toolsTable, feedbackTable, analyticsTable } from "@workspace/db";
import { eq, desc, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/analytics", async (req, res) => {
  try {
    const tools = await db.select().from(toolsTable);
    const feedback = await db.select().from(feedbackTable);
    const analytics = await db.select().from(analyticsTable);
    
    const totalTools = tools.length;
    const totalViews = tools.reduce((sum, t) => sum + t.viewCount, 0);
    const totalRatings = feedback.length;
    
    const topTools = tools
      .sort((a, b) => b.viewCount - a.viewCount)
      .slice(0, 10)
      .map(t => ({ slug: t.slug, name: t.name, views: t.viewCount, rating: t.averageRating }));
    
    const viewsByDate: Record<string, number> = {};
    analytics.forEach(a => {
      viewsByDate[a.date] = (viewsByDate[a.date] || 0) + a.views;
    });
    
    const last30Days: Array<{ date: string; views: number }> = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const date = d.toISOString().split("T")[0];
      last30Days.push({ date, views: viewsByDate[date] || 0 });
    }
    
    const catMap: Record<string, { count: number; views: number }> = {};
    tools.forEach(t => {
      if (!catMap[t.category]) catMap[t.category] = { count: 0, views: 0 };
      catMap[t.category].count++;
      catMap[t.category].views += t.viewCount;
    });
    
    const categoryStats = Object.entries(catMap).map(([category, stat]) => ({
      category,
      count: stat.count,
      views: stat.views,
    }));
    
    res.json({
      totalTools,
      totalViews,
      totalRatings,
      topTools,
      dailyViews: last30Days,
      categoryStats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch analytics" });
  }
});

export default router;
