import nodemailer from "nodemailer";
import { httpLogger } from "./logger";
import ApiError from "./ApiError";
// app password: lghf xwys xwvj xpwn
export const sendEmail = async (
  email: string,
  subject: string,
  message: string
) => {
  try {
    console.log("sending email ...");
    const senderEmail = process.env.SENDER_EMAIL;
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: senderEmail,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    const mailOptions = {
      from: senderEmail,
      to: email,
      subject,
      text: message,
    };

    const response = await transporter.sendMail(mailOptions);
    httpLogger.info(`Email sent`, { response: response.response });
  } catch (error) {
    httpLogger.error(`error Email sent`, { error });
    console.log(error);
    throw new ApiError("Error sending email", 400);
  }
};
export default sendEmail;
