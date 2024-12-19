"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = require("./logger");
const ApiError_1 = __importDefault(require("./ApiError"));
// app password: lghf xwys xwvj xpwn
const sendEmail = async (email, subject, message) => {
    try {
        console.log("sending email ...");
        const senderEmail = process.env.SENDER_EMAIL;
        const transporter = nodemailer_1.default.createTransport({
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
        logger_1.httpLogger.info(`Email sent`, { response: response.response });
    }
    catch (error) {
        logger_1.httpLogger.error(`error Email sent`, { error });
        console.log(error);
        throw new ApiError_1.default("Error sending email", 400);
    }
};
exports.sendEmail = sendEmail;
exports.default = exports.sendEmail;
//# sourceMappingURL=sendEmail.js.map