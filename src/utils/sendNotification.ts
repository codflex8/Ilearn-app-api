import admin from "firebase-admin";
import serviceAccount from "../../firebaseAccountKey.json";
import { Notification } from "../models/Notification.model";
import { User } from "../models/User.model";
import { GroupsChat } from "../models/GroupsChat.model";

admin.initializeApp({
  credential: admin.credential.cert({
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
    projectId: serviceAccount.project_id,
  }),
});

export const sendNotification = async ({ title, data, fcmTokens }) => {
  try {
    const payload = {
      notification: {
        title: title,
        body: data,
      },
      tokens: fcmTokens,
    };

    const response = await admin.messaging().sendEachForMulticast(payload);
    console.log("Successfully sent message:", response);
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
