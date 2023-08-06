import express from "express";
import authRouter from "./src/auth/router.js";
import teacherRouter from "./information/teacher/route.js";
import sectionRouter from "./information/section/route.js";
import roomRouter from "./information/room/route.js";
import courseRouter from "./information/courses/route.js";
import formsRouter from "./src/forms/route.js";
import assignRouter from "./src/assignment/route.js";

import { authorize } from "./config/authorize.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/teacher", authorize(), teacherRouter);
router.use("/section", authorize(), sectionRouter);
router.use("/room", authorize(), roomRouter);
router.use("/assign", authorize(), assignRouter);
router.use("/course", authorize(), courseRouter);

router.use("/forms", formsRouter);

export default router;
