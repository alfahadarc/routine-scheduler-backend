import { transporter } from "../config/mail.js";
import { v4 as uuidv4 } from "uuid";
import {
  getSchedule,
  setSchedule,
  getTheoryScheduleForms,
  getTheoryScheduleTeachers,
  nextInSeniority,
} from "./repository.js";
import { createForm } from "../assignment/repository.js";
import { HttpError } from "../config/error-handle.js";

async function sendMail(email, template, token) {
  var url = process.env.URL || "http://localhost:3000";
  url = url + "/form/theory-sched/" + token;
  const msg =
    " <h1>Please fill up this form</h1>  <a href=' " +
    url +
    " ' > " +
    url +
    "</a>";
  const info = await transporter.sendMail({
    from: "BUET CSE Routine Team",
    to: email,
    subject: "Theory Schedule Form",
    text: template,
    html: msg,
  });
  return info;
}

export async function setScheduleAPI(req, res, next) {
  try {
    let { batch, section, course } = req.params;
    batch = parseInt(batch);
    const schedule = req.body;
    const ok = await setSchedule(batch, section, course, schedule);
    if (ok) res.status(200).json({ msg: "successfully send", body: schedule });
    else throw new HttpError(400, "Insert Failed");
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

export async function sendTheorySchedNextMail(batch) {
  const teachers = await nextInSeniority();
  for (const teacher of teachers.filter((t) => t.batch === batch)) {
    const id = teacher.id;
    await sendMail(teacher.email, `Theory Schedule Form: ${id}`, id);
    // console.log(teacher);
  }
}

export async function initiate(req, res, next) {
  const teachers = await getTheoryScheduleTeachers();
  const batches = new Set();
  for (const teacher of teachers) {
    teacher.id = uuidv4();
    await createForm(teacher.id, teacher.initial, "theory-sched");
    batches.add(teacher.batch);
  }

  for (const batch of batches) {
    await sendTheorySchedNextMail(batch);
  }

  res.status(200).json({ msg: "successfully send" });
}

export async function getCurrStatus(req, res, next) {
  try {
    const result = await getTheoryScheduleForms();
    if (result.length === 0) {
      res.status(200).json({ status: 0 });
    } else {
      const mailed = await nextInSeniority();
      const nullResponse = result.filter((row) => row.response === null);
      const otherResponse = result.filter((row) => row.response !== null);
      const mailedObj = mailed.reduce((acc, row) => {
        acc[row.initial] = row;
        return acc;
      }, {});
      const mailedResponse = result
        .filter(
          (row) => row.response === null && mailedObj[row.initial] !== undefined
        )
        .map((row) => {
          row.batch = mailedObj[row.initial].batch;
          row.course_id = mailedObj[row.initial].course_id;
          return row;
        });
      res.status(200).json({
        status: nullResponse.length === 0 ? 2 : 1,
        values: mailedResponse,
        submitted: otherResponse,
      });
    }
  } catch (err) {
    next(err);
  }
}
