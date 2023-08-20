import { transporter } from "../../config/mail.js";
import { v4 as uuidv4 } from "uuid";
import {
  getTemplate,
  getAllTeacherMail,
  createForm,
  getTheoryPreferencesStatus,
  finalize,
  isFinalized,
} from "./repository.js";

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
    console.log(msgBody);

    if (msgBody[0].key !== null && msgBody[0].key !== undefined) {
      //get all mail and initial
      const data = await getAllTeacherMail();
      for (var i = 0; i <= 2; i++) {
        const id = uuidv4();
        const row = await createForm(id, data[i].initial, "theory-pref");
        var info = sendMail(data[i].email, msgBody[0].value, id);
        console.log(info.messageId);
      }
      // data.forEach((e)=>{
      //   var info = sendMail(e.email,msgBody[0].value,uuidv4() )
      //   console.log(info.messageId)
      // })
      res.status(200).json({ msg: "successfully send" });
    } else {
      next(new Error("No template found"));
    }
  } catch (err) {
    next(err);
  }
}

export async function getCurrStatus(req, res, next) {
  try {
    if (await isFinalized()) {
      res.status(200).json({ status: 3 });
    } else {
      const rows = await getTheoryPreferencesStatus();
      //console.log(rows.length);
      let result = {};
      if (rows.length == 0) {
        result = { status: 0 };
      } else {
        let hasNullResponse = [];
        for (const row of rows) {
          if (row.response === null) {
            hasNullResponse.push(row);
          }
        }
        let otherResponse =[]
        for (const row of rows) {
          if (row.response !== null) {
            otherResponse.push(row);
          }
        }

        result =
          hasNullResponse.length > 0
            ? { status: 1, values: hasNullResponse, submitted: otherResponse  }
            : { status: 2, submitted: otherResponse };
      }
      //console.log(result)
      res.status(200).json(result);
    }
  } catch (err) {
    next(err);
  }
}

export async function finalizeTheoryPreference(req, res, next) {
  try {
    const rowAffected = await finalize();
    res.status(200).json({ msg: "Finilizing Done" });
  } catch (err) {
    next(err);
  }
}
