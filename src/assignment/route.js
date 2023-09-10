import express from "express";

const router = express.Router();

import {
  sendTheoryPrefMail,
  getCurrStatus,
  finalizeTheoryPreference,
  getLabRoomAssignment,
  setLabRoomAssignemnt,
  getTeacherAssignment,
  sendSessionalPrefMail,
  getSessionalCurrStatus,
  finalizeSessionalPreference,
} from "./controller.js";

router.get("/theory/initiate", sendTheoryPrefMail);
router.get("/theory/status", getCurrStatus);
router.get("/theory/finalize", finalizeTheoryPreference);

router.get("/sessional/initiate", sendSessionalPrefMail);
router.get("/sessional/status", getSessionalCurrStatus);
router.get("/sessional/finalize", finalizeSessionalPreference);

router.get("/theory/all", getTeacherAssignment);

router.get("/room/status", getLabRoomAssignment);
router.post("/room/assign", setLabRoomAssignemnt);

export default router;
