import express from "express";
import {
  getTheoryPreferenceForm,
  getAllForm,
  editForm,
  getTheoryScheduleForm,
  saveTheoryScheduleFormAPI,
} from "./controller.js";

const router = express.Router();

// theory/pref/{form_id} get

// TODO: WHY OPEN? TYPE WHERE?
router.get("/", getAllForm);
router.get("/:uuid", getTheoryPreferenceForm);
router.put("/:uuid", editForm);

router.get("/theory-sched/:uuid", getTheoryScheduleForm);
router.put("/theory-sched/:uuid", saveTheoryScheduleFormAPI);

// theory/pref/{form_id} postMessage
// theory/schedule/{form_id} get

// theory/schedule/{form_id} post
// sessional/pref/{form_id} get
// sessional/pref/{form_id} post

export default router;
