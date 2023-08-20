import express from "express";
import { getCurrStatus, getScheduleAPI, initiate, setScheduleAPI} from "./controller.js";

const router = express.Router();

router.get("/theory/:batch/:section", getScheduleAPI);
router.post("/theory/:batch/:section/:course", setScheduleAPI);

router.get("/theory/initiate", initiate);
router.get("/theory/status", getCurrStatus);
// router.get("/theory/finalize", null);

export default router;