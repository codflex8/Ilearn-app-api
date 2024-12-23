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
const websocket_1 = __importDefault(require("../websocket/websocket"));
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
        console.log("Successfully sent Notification:", response.responses.filter((res) => res.success));
        console.log("Failed sent Notification", response.responses.filter((res) => !res.success));
    }
    catch (error) {
        console.error("Error sending Notification:", error);
    }
};
exports.sendNotification = sendNotification;
const sendAndCreateNotification = async ({ title, data, fcmTokens, body, users, group, fromUser, type, createNotification = true, }) => {
    console.log("dataaa", { fcmTokens, data });
    if (createNotification) {
        await Notification_model_1.Notification.createNewNotification({
            title,
            users,
            group,
            fromUser,
            body,
            data,
            type,
        });
        websocket_1.default.sendUnseenNotifications(users);
    }
    try {
        const fcms = fcmTokens.filter((fc) => !!fc);
        if (fcmTokens.length) {
            await (0, exports.sendNotification)({ title, data, fcmTokens: fcms, body });
        }
        else {
            logger_1.httpLogger.error("fcm array is empty", { fcmTokens });
        }
    }
    catch (error) {
        logger_1.httpLogger.error("error sending Notification", { error });
    }
};
exports.sendAndCreateNotification = sendAndCreateNotification;
//# sourceMappingURL=sendNotification.js.map