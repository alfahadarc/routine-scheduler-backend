import { transporter } from "../../config/mail.js";
import { v4 as uuidv4 } from "uuid";
import { getSchedule } from "./repository.js";

export async function setScheduleAPI(req, res, next) {
  const { batch, section, course } = req.params
  const times = req.body

  res.status(200).json({ msg: "successfully send", body: times });
}

export async function getScheduleAPI(req, res, next) {
  let { batch, section } = req.params
  batch = parseInt(batch)

  const result = await getSchedule(batch, section)

  res.status(200).json(result);
}