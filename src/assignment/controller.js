import { transporter } from "../config/mail.js";
import jwt from "jsonwebtoken";
import { getTemplate,getAllTeacherMail } from "./repository.js";
const secret = process.env.SECRET || "default-secret";

async function sendMail(email, template, token){
    const info = await transporter.sendMail({
      from: '"Fred Foo 👻" <foo@example.com>', // sender address
      to: email, // list of receivers
      subject: "Hello ✔", // Subject line
      text: template, // plain text body
      html: <h1>please fill up this form <a>token</a></h1> , // html body
    });
    return info;
}

// form - > key[teacher_initial_preferences/schedule], type[theory/sessional], response

function createToken(initial, type){
  const token = jwt.sign({ initial: initial, type:type }, secret, {
    expiresIn: "3 days",
  });
  return token;
}

export async function sendTheoryPrefMail(req, res, next) {

  try {
    const msgBody = await getTemplate("demo")
    console.log(msgBody)

    if (msgBody[0].key !== null && msgBody[0].key !== undefined) {

      //get all mail
      const data = await getAllTeacherMail()
      data.forEach((e)=>{
        const token = createToken(e.initial,"Preferences")
        var info = sendMail(e.email,msgBody[0].value, token)
        console.log(info.messageId)
        
      })
      res.status(200).json({ msg: data })
      
    } else {
      next({msg:"no body found"})
    }

  } catch (err) {
    next(err)
  }
  
}