import express from "express";
import { getScheduleAPI, setScheduleAPI} from "./controller.js";

const router = express.Router();

router.get("/theory/:batch/:section", getScheduleAPI);
router.post("/theory/:batch/:section/:course", setScheduleAPI);

export default router;