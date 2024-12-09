import admin from "firebase-admin";
import serviceAccount from "../../firebaseAccountKey.json";
import { Notification } from "../models/Notification.model";
import { User } from "../models/User.model";
import { GroupsChat } from "../models/GroupsChat.model";
import { MulticastMessage } from "firebase-admin/lib/messaging/messaging-api";

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }),
});

export const sendNotification = async ({ title, data, fcmTokens }) => {
  try {
    console.log("fcmTokensssssss", { fcmTokens, data, title });
    const payload: MulticastMessage = {
      notification: {
        title: title,
        // body: JSON.stringify(data),
      },
      data,
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log("Successfully sent message:", response);
    console.log("success", response.responses[0], response.responses[0].error);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const sendAndCreateNotification = async ({
  title,
  data,
  fcmTokens,
  message,
  users,
  group,
  fromUser,
}: {
  title: string;
  data: any;
  fcmTokens: string[];
  message: string;
  users: User[];
  group: GroupsChat;
  fromUser?: User;
}) => {
  await Notification.createNewNotification({
    message,
    users,
    group,
    fromUser,
    title,
  });
  await sendNotification({ title, data, fcmTokens });
};
