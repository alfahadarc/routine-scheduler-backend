import dotenv from 'dotenv'
dotenv.config()
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: process.env.SENDEREMAIL,
    pass: process.env.SENDERPASSWORD
  }
});

export {transporter}