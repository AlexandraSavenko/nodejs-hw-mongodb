import nodemailer from "nodemailer";
import "dotenv/config";

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';

// const {SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM} = process.env;

// const nodemailerConfig = {
//     host: SMTP_HOST,
//   port: SMTP_PORT,
//   secure: false, // true for 465, false for other ports
//   auth: {
//     user: SMTP_USER,
//     pass: SMTP_PASSWORD,
//   },
// };
// const transport = nodemailer.createTransport(nodemailerConfig);

const transporter = nodemailer.createTransport({
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
});



export const sendEmail = async (options) => {
  return await transporter.sendMail(options);
};

// export const sendEmail = data => {
//     const email = {...data, from: SMTP_FROM,};
//     return transporter.sendMail(email);
// };

// transport.sendMail(email).then(() => console.log("email sent successfully")).catch(error => console.log(error.message));