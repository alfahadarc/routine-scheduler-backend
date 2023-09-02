import express from "express";
import authRouter from "./src/auth/router.js";
import teacherRouter from "./src/information/teacher/route.js";
import sectionRouter from "./src/information/section/route.js";
import roomRouter from "./src/information/room/route.js";
import courseRouter from "./src/information/courses/route.js";
import formsRouter from "./src/forms/route.js";
import assignRouter from "./src/assignment/route.js";
import scheduleRouter from "./src/schedule/route.js";


import { authorize } from "./src/config/authorize.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/teacher", authorize(), teacherRouter);
router.use("/section", authorize(), sectionRouter);
router.use("/room", authorize(), roomRouter);
router.use("/assign", authorize(), assignRouter);
router.use("/course", authorize(), courseRouter);
router.use("/schedule", authorize(), scheduleRouter);


router.use("/forms", formsRouter);

export default router;
