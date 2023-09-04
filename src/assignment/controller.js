import { transporter } from "../config/mail.js";
import { v4 as uuidv4 } from "uuid";
import {
  getTemplate,
  getAllTeacherMail,
  createForm,
  getTheoryPreferencesStatus,
  finalize,
  isFinalized,
  getTheoryAssignment,
  getLabRoomAssignmentDB,
  setLabRoomAssignemntDB
} from "./repository.js";
import { HttpError } from "../config/error-handle.js";

async function sendMail(email, template, token) {
  var url = process.env.URL || "http://localhost:3000";
  url = url + "/form/theory-pref/" + token;
  const msg =
    " <h1>Please fill up this form</h1>  <a href=' " +
    url +
    " ' > " +
    url +
    "</a>";
  const info = await transporter.sendMail({
    from: "BUET CSE Routine Team",
    to: email,
    subject: "Theory Preferences Form",
    text: template,
    html: msg,
  });
  return info;
}

export async function sendTheoryPrefMail(req, res, next) {
  try {
    const msgBody = await getTemplate("demo");

    if (msgBody[0].key !== null && msgBody[0].key !== undefined) {
      //get all mail and initial
      const data = await getAllTeacherMail();
      for (var i = 0; i <= 2; i++) {
        const id = uuidv4();
        const row = await createForm(id, data[i].initial, "theory-pref");
        var info = sendMail(data[i].email, msgBody[0].value, id);
      }
      // data.forEach((e)=>{
      //   var info = sendMail(e.email,msgBody[0].value,uuidv4() )
      //   console.log(info.messageId)
      // })
      res.status(200).json({ msg: "successfully send" });
    } else {
      next(new HttpError(400, "Template not found"));
    }
  } catch (err) {
    next(err);
  }
}

export async function getCurrStatus(req, res, next) {
  try {
    const result = await getTheoryPreferencesStatus();
    if (result.length === 0) {
      res.status(200).json({ status: 0 });
    } else {
      const nullResponse = result.filter((row) => row.response === null);
      const otherResponse = result.filter((row) => row.response !== null);
      if (await isFinalized())
        res.status(200).json({
          status: 3,
          values: nullResponse,
          submitted: otherResponse,
          assignment: await getTheoryAssignment(),
        });
      else
        res.status(200).json({
          status: nullResponse.length === 0 ? 2 : 1,
          values: nullResponse,
          submitted: otherResponse,
        });
    }
  } catch (err) {
    next(err);
  }
}

export async function finalizeTheoryPreference(req, res, next) {
  try {
    const commited = await finalize();
    if (!commited) {
      throw new HttpError(400, "Finalizing Failed");
    }
    res.status(200).json({ msg: "Finilizing Done" });
  } catch (err) {
    next(err);
  }
}

export async function getLabRoomAssignment(req, res, next) {
  try {
    const result = await getLabRoomAssignmentDB();
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
}


export async function setLabRoomAssignemnt(req, res, next) {
  try {
    await setLabRoomAssignemntDB(req.body);
    res.status(200).json({msg:"Successfully Assigned"});
  } catch (err) {
    next(err);
  }
}