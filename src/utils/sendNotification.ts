import admin from "firebase-admin";
import serviceAccount from "../../firebaseAccountKey.json";
import { Notification, NotificationType } from "../models/Notification.model";
import { User } from "../models/User.model";
import { GroupsChat } from "../models/GroupsChat.model";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";
import { httpLogger } from "./logger";

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }),
});

interface ISendNotification {
  title: string;
  data: Record<string, string>;
  body: string;
  fcmTokens: string[];
}

export const sendNotification = async ({
  title,
  data,
  fcmTokens,
  body,
}: ISendNotification) => {
  try {
    console.log("fcmTokensssssss", { fcmTokens, data, title });
    const payload: MulticastMessage = {
      notification: {
        title: title,
        body,
      },
      data,
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log(
      "Successfully sent Notification:",
      response.responses.filter((res) => res.success)
    );
    console.log(
      "Failed sent Notification",
      response.responses.filter((res) => !res.success)
    );
  } catch (error) {
    console.error("Error sending Notification:", error);
  }
};

export const sendAndCreateNotification = async ({
  title,
  data,
  fcmTokens,
  body,
  users,
  group,
  fromUser,
  type,
}: {
  // title: string;
  // data: Record<string, string>;
  // body: string;
  // fcmTokens: string[];
  users: User[];
  group?: GroupsChat;
  fromUser?: User;
  type: NotificationType;
} & ISendNotification) => {
  await Notification.createNewNotification({
    title,
    users,
    group,
    fromUser,
    body,
    data,
    type,
  });
  try {
    const fcms = fcmTokens.filter((fc) => !!fc);
    if (fcmTokens.length) {
      await sendNotification({ title, data, fcmTokens: fcms, body });
    } else {
      httpLogger.error("fcm array is empty", { fcmTokens });
    }
  } catch (error) {
    console.log("error sending Notification", error);
  }
};
