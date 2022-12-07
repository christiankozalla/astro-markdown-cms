import nodemailer from "nodemailer";
import type { SendMail } from "astro-markdown-cms";

// from user-land
const testAccount = await nodemailer.createTestAccount();
// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  host: "smtp.ethereal.email",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: testAccount.user, // generated ethereal user
    pass: testAccount.pass, // generated ethereal password
  },
});

const sendVerificationMail: SendMail = async function ({ to, html }) {
  const info = await transporter.sendMail({
    from: "Michael The User",
    to,
    subject: "User defined Email title?",
    html,
  });
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendVerificationMail;
