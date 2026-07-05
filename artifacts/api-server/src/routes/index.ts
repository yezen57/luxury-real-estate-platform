import { Router, type IRouter } from "express";
import healthRouter from "./health";
import apartmentsRouter from "./apartments";
import adminRouter from "./admin";
import statsRouter from "./stats";

const router: IRouter = Router();

router.use(healthRouter);
router.use(apartmentsRouter);
router.use(adminRouter);
router.use(statsRouter);

export default router;
