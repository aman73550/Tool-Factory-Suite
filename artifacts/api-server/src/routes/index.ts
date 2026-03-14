import { Router, type IRouter } from "express";
import healthRouter from "./health";
import toolsRouter from "./tools";
import feedbackRouter from "./feedback";
import analyticsRouter from "./analytics";
import adminRouter from "./admin";
import publicRouter from "./public";

const router: IRouter = Router();

router.use(healthRouter);
router.use(publicRouter);
router.use(toolsRouter);
router.use(feedbackRouter);
router.use(analyticsRouter);
router.use(adminRouter);

export default router;
