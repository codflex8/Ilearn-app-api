"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAndCreateNotification = exports.sendNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseAccountKey_json_1 = __importDefault(require("../../firebaseAccountKey.json"));
const Notification_model_1 = require("../models/Notification.model");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        clientEmail: firebaseAccountKey_json_1.default.client_email,
        privateKey: firebaseAccountKey_json_1.default.private_key,
        projectId: firebaseAccountKey_json_1.default.project_id,
    }),
});
const sendNotification = async ({ title, data, fcmTokens }) => {
    try {
        console.log("fcmTokensssssss", fcmTokens);
        const payload = {
            notification: {
                title: title,
                body: data,
            },
            tokens: fcmTokens,
        };
        const response = await firebase_admin_1.default.messaging().sendEachForMulticast(payload);
        console.log("Successfully sent message:", response);
        console.log("success", response.responses[0], response.responses[0].error);
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
};
exports.sendNotification = sendNotification;
const sendAndCreateNotification = async ({ title, data, fcmTokens, message, users, group, fromUser, }) => {
    await Notification_model_1.Notification.createNewNotification({
        message,
        users,
        group,
        fromUser,
        title,
    });
    await (0, exports.sendNotification)({ title, data, fcmTokens });
};
exports.sendAndCreateNotification = sendAndCreateNotification;
//# sourceMappingURL=sendNotification.js.map