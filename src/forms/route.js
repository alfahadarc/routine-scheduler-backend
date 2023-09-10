import express from "express";
import {
  getTheoryPreferenceForm,
  getAllForm,
  editForm,
  getTheoryScheduleForm,
  saveTheoryScheduleFormAPI,
  saveSessionalPreferenceFormAPI,
  getSessionalPreferenceForm,
} from "./controller.js";

const router = express.Router();

// theory/pref/{form_id} get

// TODO: WHY OPEN? TYPE WHERE?
router.get("/", getAllForm);
router.get("/:uuid", getTheoryPreferenceForm);
router.put("/:uuid", editForm);

router.get("/theory-sched/:uuid", getTheoryScheduleForm);
router.put("/theory-sched/:uuid", saveTheoryScheduleFormAPI);

router.get("/sessional-pref/:uuid", getSessionalPreferenceForm);
router.put("/sessional-pref/:uuid", saveSessionalPreferenceFormAPI);

export default router;
