import nodemailer from "nodemailer";
import "dotenv/config";

// import { SMTP } from "../constants/index.js";

const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM} = process.env;

const nodemailerConfig = {
    host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: SMTP_USER,
    pass: SMTP_PASSWORD,
  },
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const email = {
//     to: "kijema2382@decodewp.com",
//     from: SMTP_FROM,
//     subject: "test email",
//     html: "<h1>Test Email</h1>"

// };

export const sendEmail = data => {
    const email = {...data, from: SMTP_FROM,};
    return transport.sendMail(email);
};

// transport.sendMail(email).then(() => console.log("email sent successfully")).catch(error => console.log(error.message));