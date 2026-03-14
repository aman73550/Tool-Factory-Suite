import { Router, type IRouter } from "express";
import { db, feedbackTable, toolsTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";

const router: IRouter = Router();

router.get("/feedback", async (req, res) => {
  try {
    const { toolSlug, limit = "50", offset = "0" } = req.query as Record<string, string>;
    
    let all = await db.select().from(feedbackTable).orderBy(feedbackTable.createdAt);
    all = all.reverse();
    
    if (toolSlug) {
      all = all.filter(f => f.toolSlug === toolSlug);
    }
    
    const total = all.length;
    const feedback = all.slice(Number(offset), Number(offset) + Number(limit));
    
    res.json({ feedback, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to fetch feedback" });
  }
});

router.post("/feedback", async (req, res) => {
  try {
    const { toolSlug, rating, comment } = req.body;
    
    if (!toolSlug || !rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: "validation_error", message: "Invalid feedback data" });
    }
    
    const [tool] = await db.select().from(toolsTable).where(eq(toolsTable.slug, toolSlug));
    const toolName = tool?.name || toolSlug;
    
    const [created] = await db.insert(feedbackTable).values({
      toolSlug,
      toolName,
      rating: Number(rating),
      comment: comment || null,
      status: "pending",
    }).returning();
    
    const allFeedback = await db.select().from(feedbackTable).where(eq(feedbackTable.toolSlug, toolSlug));
    const avgRating = allFeedback.reduce((sum, f) => sum + f.rating, 0) / allFeedback.length;
    
    await db.update(toolsTable)
      .set({ 
        averageRating: Math.round(avgRating * 10) / 10,
        ratingCount: allFeedback.length
      })
      .where(eq(toolsTable.slug, toolSlug));
    
    res.status(201).json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to submit feedback" });
  }
});

router.delete("/feedback/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(feedbackTable).where(eq(feedbackTable.id, id));
    res.json({ success: true, message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to delete" });
  }
});

router.patch("/feedback/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;
    
    const [updated] = await db.update(feedbackTable)
      .set({ status })
      .where(eq(feedbackTable.id, id))
      .returning();
    
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server_error", message: "Failed to update" });
  }
});

export default router;
