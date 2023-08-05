import { transporter } from "../config/mail.js";
import { getTemplate,getAllTeacherMail } from "./repository.js";

async function sendMail(email, template){
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: template, // plain text body
      html: template, // html body
    });
    return info;
}

export async function sendTheoryMail(req, res, next) {

  try {
    const msgBody = await getTemplate("demo")
    console.log(msgBody)

    if (msgBody[0].key !== null && msgBody[0].key !== undefined) {

      //get all mail
      const emails = await getAllTeacherMail()
      emails.forEach((e)=>{
        var info = sendMail(e.email,msgBody[0].value)
        console.log(info.messageId)
        
      })
      res.status(200).json({ msg: emails })
      
    } else {
      next({msg:"no body found"})
    }

  } catch (err) {
    next(err)
  }
  
}