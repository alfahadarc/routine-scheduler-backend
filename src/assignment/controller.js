import { transporter } from "../../config/mail.js";
import { v4 as uuidv4 } from 'uuid';
import { getTemplate, getAllTeacherMail } from "./repository.js";


async function sendMail(email, template, token) {
  var url = process.env.URL || "localhost:3000"
  url = url + "/form/theory-pref/" + token
  const msg = "<h1>please fill up this form</h1>  <a>" + url + "</a>"
  const info = await transporter.sendMail({
    from: 'BUET CSE Routine Team', 
    to: email, 
    subject: "Theory Preferences Form",
    text: template, 
    html: msg, 
  });
  return info;
}

// form - > key[teacher_initial_preferences/schedule], type[theory/sessional], response



export async function sendTheoryPrefMail(req, res, next) {

  try {
    const msgBody = await getTemplate("demo")
    console.log(msgBody)

    if (msgBody[0].key !== null && msgBody[0].key !== undefined) {

      //get all mail
      const data = await getAllTeacherMail()
      for (var i = 0; i <= 2; i++) {
        var info = sendMail(data[i].email, msgBody[0].value, uuidv4())
        console.log(info.messageId)
      }
      // data.forEach((e)=>{
      //   var info = sendMail(e.email,msgBody[0].value,uuidv4() )
      //   console.log(info.messageId)
      // })
      res.status(200).json({ msg: "successfully send" })

    } else {
      next({ msg: "no body found" })
    }

  } catch (err) {
    next(err)
  }

}