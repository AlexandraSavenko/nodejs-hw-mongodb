import nodemailer from "nodemailer";
import "dotenv/config";

const {UKR_NET_PASSWORD, UKR_NET_FROM} = process.env;

const nodemailConfig = {
  host: "smtp.ukr.net",
  port: 465,
  secure: true,
  auth: {
    user: UKR_NET_FROM,
    pass: UKR_NET_PASSWORD
  }
};

const transporter = nodemailer.createTransport(nodemailConfig);



export const sendEmail = data => {
    const email = {...data, from: UKR_NET_FROM,}; 
    return transporter.sendMail(email);
};




// import { SMTP } from '../constants/index.js';
// import { getEnvVar } from '../utils/getEnvVar.js';

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


// export const sendEmail = async (options) => {
//   return await transporter.sendMail(options);
// };

// transport.sendMail(email).then(() => console.log("email sent successfully")).catch(error => console.log(error.message));