import express from "express";
import { getScheduleAPI } from "./controller.js";

const router = express.Router();

router.get("/theory/:batch/:section", getScheduleAPI);

export default router;