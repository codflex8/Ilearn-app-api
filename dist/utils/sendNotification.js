"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendAndCreateNotification = exports.sendNotification = void 0;
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const firebaseAccountKey_json_1 = __importDefault(require("../../firebaseAccountKey.json"));
const Notification_model_1 = require("../models/Notification.model");
const logger_1 = require("./logger");
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert({
        clientEmail: firebaseAccountKey_json_1.default.client_email,
        privateKey: firebaseAccountKey_json_1.default.private_key,
        projectId: firebaseAccountKey_json_1.default.project_id,
    }),
});
const sendNotification = async ({ title, data, fcmTokens, body, }) => {
    try {
        console.log("fcmTokensssssss", { fcmTokens, data, title });
        const payload = {
            notification: {
                title: title,
                body,
            },
            data,
            tokens: fcmTokens,
        };
        const response = await firebase_admin_1.default.messaging().sendEachForMulticast(payload);
        console.log("Successfully sent message:", response.responses.filter((res) => res.success));
        console.log("Successfully sent message", response.responses.filter((res) => !res.success));
    }
    catch (error) {
        console.error("Error sending message:", error);
    }
};
exports.sendNotification = sendNotification;
const sendAndCreateNotification = async ({ title, data, fcmTokens, body, users, group, fromUser, type, }) => {
    await Notification_model_1.Notification.createNewNotification({
        title,
        users,
        group,
        fromUser,
        body,
        data,
        type,
    });
    if (fcmTokens.length) {
        await (0, exports.sendNotification)({ title, data, fcmTokens, body });
    }
    else {
        logger_1.httpLogger.error("fcm array is empty", { fcmTokens });
    }
};
exports.sendAndCreateNotification = sendAndCreateNotification;
//# sourceMappingURL=sendNotification.js.map