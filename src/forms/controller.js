import { sendTheorySchedNextMail } from "../schedule/controller.js";
import {
  getTheoryPreferenceFormByUUID,
  getForms,
  updateForm,
  getTheoryScheduleFormByUUID,
  saveTheoryScheduleForm,
} from "./repository.js";

export async function getTheoryPreferenceForm(req, res, next) {
  const uuid = req.params["uuid"];

  try {
    const form = await getTheoryPreferenceFormByUUID(uuid);

    res.status(200).json({ data: form });
  } catch (err) {
    next(err);
  }
}

export async function getTheoryScheduleForm(req, res, next) {
  const uuid = req.params["uuid"];
  try {
    const form = await getTheoryScheduleFormByUUID(uuid);
    res.status(200).json(form);
  } catch (err) {
    next(err);
  }
}

export async function saveTheoryScheduleFormAPI(req, res, next) {
  try {
    const uuid = req.params["uuid"];
    const response = req.body;
    await updateForm(uuid, JSON.stringify(response), "theory-sched");
    const batch = await saveTheoryScheduleForm(uuid, response);
    await sendTheorySchedNextMail(batch);
    res.status(200).json({ msg: "Successfully Updated" });
  } catch (err) {
    next(err);
  }
}

export async function getAllForm(req, res, next) {
  try {
    const form = await getForms();

    res.status(200).json({ data: form });
  } catch (err) {
    next(err);
  }
}

export async function editForm(req, res, next) {
  const uuid = req.params["uuid"];
  let response = req.body.preferences;
  //make response a string
  response = JSON.stringify(response);

  try {
    const form = await updateForm(uuid, response);

    res.status(200).json({ msg: "Successfully Updated" });
  } catch (err) {
    next(err);
  }
}
