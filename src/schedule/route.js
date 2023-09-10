import express from "express";
import {
  getAllSchedule,
  getCurrStatus,
  getSessionalScheduleAPI,
  getTheoryScheduleAPI,
  initiate,
  roomContradiction,
  setSessionalScheduleAPI,
  setTheoryScheduleAPI,
  teacherContradiction,
} from "./controller.js";

const router = express.Router();

router.get("/theory/:batch/:section", getTheoryScheduleAPI);
router.post("/theory/:batch/:section/:course", setTheoryScheduleAPI);

router.get("/sessional/:batch/:section", getSessionalScheduleAPI);
router.post("/sessional/:batch/:section", setSessionalScheduleAPI);

router.get("/all", getAllSchedule)
router.get("/contradiction/room/:batch/:section/:course_id", roomContradiction)
router.get("/contradiction/teacher/:batch/:section/:course_id", teacherContradiction)

router.get("/theory/initiate", initiate);
router.get("/theory/status", getCurrStatus);
// router.get("/theory/finalize", null);

export default router;
