import express from "express";

const router = express.Router();

import {
  sendTheoryPrefMail,
  getCurrStatus,
  finalizeTheoryPreference,
  getLabRoomAssignment,
  setLabRoomAssignemnt,
  getTeacherAssignment,
} from "./controller.js";

router.get("/theory/initiate", sendTheoryPrefMail);
router.get("/theory/status", getCurrStatus);
router.get("/theory/finalize", finalizeTheoryPreference);

router.get("/theory/all", getTeacherAssignment);

router.get("/room/status", getLabRoomAssignment);
router.post("/room/assign", setLabRoomAssignemnt);

export default router;
