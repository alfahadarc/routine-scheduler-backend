import { transporter } from "../../config/mail.js";
import { v4 as uuidv4 } from "uuid";
import { getSchedule, setSchedule } from "./repository.js";

export async function setScheduleAPI(req, res, next) {
  try {
    let { batch, section, course } = req.params;
    batch = parseInt(batch);
    const schedule = req.body;
    const ok = await setSchedule(batch, section, course, schedule);
    if (ok) res.status(200).json({ msg: "successfully send", body: schedule });
    else res.status(400).json({ msg: "error" });
  } catch (e) {
    next(e);
  }
}

export async function getScheduleAPI(req, res, next) {
  try {
    let { batch, section } = req.params;
    batch = parseInt(batch);

    const result = await getSchedule(batch, section);

    res.status(200).json(result);
  } catch (e) {
    next(e);
  }
}
