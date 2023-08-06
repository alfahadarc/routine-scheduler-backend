import express from "express";
import authRouter from "./src/auth/router.js";
import teacherRouter from "./information/teacher/route.js";
import sectionRouter from "./information/section/route.js";
import roomRouter from "./information/room/route.js";

import { authorize } from "./config/authorize.js";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/teacher", authorize(), teacherRouter);
router.use("/section", sectionRouter);
router.use("/room", roomRouter);

export default router;
