// @ts-nocheck
import { Router, type IRouter } from "express";
import healthRouter from "./health";
import apartmentsRouter from "./apartments";
import adminRouter from "./admin";
import statsRouter from "./stats";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(apartmentsRouter);
router.use(adminRouter);
router.use(statsRouter);
router.use("/upload", uploadRouter);

export default router;

