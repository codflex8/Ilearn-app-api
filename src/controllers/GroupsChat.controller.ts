import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { GroupsChat } from "../models/GroupsChat.model";
import { getPaginationData } from "../utils/getPaginationData";
import { BaseQuery } from "../utils/validators/BaseQuery";
import { GenericResponse } from "../utils/GenericResponse";
import {
  addGroupChatValidator,
  GroupChatRoles,
  MessageType,
} from "../utils/validators/GroupsChatValidator";
import { User } from "../models/User.model";
import { Equal, In } from "typeorm";
import { GroupsChatUsers } from "../models/GroupsChatUsers.model";
import ApiError from "../utils/ApiError";
import { GroupsChatMessages } from "../models/GroupsChatMessages.model";
import { containsLink } from "../utils/extractLing";
import Websocket from "../websocket/websocket";
import { sendAndCreateNotification } from "../utils/sendNotification";
import i18next, { TFunction } from "i18next";
import { Notification, NotificationType } from "../models/Notification.model";

interface GroupsChatQuery extends BaseQuery {
  name?: string;
}

interface GroupsChatMessagesQuery extends BaseQuery {
  messageType: MessageType;
}

export const getGroupsChat = asyncHandler(
  async (
    req: Request<{}, {}, {}, GroupsChatQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const user = req.user;
    const { page, pageSize, name } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });

    let querable = GroupsChat.getRepository()
      .createQueryBuilder("chat")
      .leftJoinAndSelect("chat.userGroupsChats", "userGroupsChats")
      .leftJoin("userGroupsChats.user", "user")
      .where("user.id = :userId", { userId: user.id });

    if (name) {
      querable = querable.andWhere("LOWER(chat.name) LIKE :name", {
        name: `%${name}%`,
      });
    }
    const count = await querable.getCount();
    const groupsChat = await querable.skip(skip).take(take).getMany();
    const getGroupsChatWithMessages = groupsChat.map(async (chat) => {
      chat.isAcceptJoin(user.id, false);
      await GroupsChat.getGroupChatWithMessagesData(chat, user.id);
      return chat;
    });

    const chats = await Promise.all(getGroupsChatWithMessages);

    res
      .status(200)
      .json(new GenericResponse<GroupsChat>(Number(page), take, count, chats));
  }
);

export const acceptJoinGroup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const groupChatUser = await GroupsChatUsers.findOne({
      where: {
        user: {
          id: user.id,
        },
        groupChat: {
          id,
        },
      },
    });
    if (!groupChatUser) {
      return next(new ApiError(req.t("cannot_find_group_chat"), 400));
    }
    groupChatUser.acceptJoin = true;
    await groupChatUser.save();
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    groupChat.isAcceptJoin(user.id, true);
    // send nofitification to admin
    const groupAdmin = await GroupsChatUsers.findOne({
      where: {
        groupChat: {
          id,
        },
        role: GroupChatRoles.Admin,
      },
      relations: { user: true },
    });
    const title = req.t("user_accept_join_title", {
      lng: groupAdmin.user.language,
    });
    const body = req.t("user_accept_join_group", {
      username: user.username,
      name: groupChat.name,
      lng: groupAdmin.user.language,
    });
    await sendAndCreateNotification({
      title,
      body,
      users: [groupAdmin.user],
      fromUser: user,
      group: groupChat,
      data: {
        groupChat: groupChat.name ?? "",
        groupChatId: groupChat.id ?? "",
        groupChatImageUrl: groupChat.fullImageUrl ?? "",
        fromUser: user.username ?? "",
        fromUserId: user.id ?? "",
        fromUserImageUrl: user.fullImageUrl ?? "",
      },
      fcmTokens: [groupAdmin.user.fcm],
      type: NotificationType.UserAcceptJoinGroup,
    });
    res.status(200).json({ groupChat });
  }
);

export const acceptJoinRequest = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { userId } = req.body;
    const { id } = req.params;
    const groupChat = await GroupsChat.findOne({
      where: {
        id: Equal(id),
        userGroupsChats: {
          user: {
            id: user.id,
          },
        },
      },
      relations: {
        userGroupsChats: true,
      },
    });
    console.log("groupChatgroupChat", groupChat);
    if (!groupChat) {
      throw new ApiError(req.t("group_chat_not_found"), 400);
    }
    if (
      !groupChat?.userGroupsChats[0] ||
      groupChat.userGroupsChats[0]?.role !== GroupChatRoles.Admin
    ) {
      throw new ApiError(req.t("you_are_not_group_admin"), 400);
    }

    const isUserInGroup = await GroupsChatUsers.findOne({
      where: {
        user: { id: userId },
        groupChat: { id },
      },
    });
    if (isUserInGroup) {
      throw new ApiError(req.t("user_in_group"), 400);
    }

    const addedUser = await User.findOne({
      where: {
        id: userId,
      },
    });

    const newGroupChatUser = await GroupsChatUsers.create({
      user: addedUser,
      groupChat,
      acceptJoin: true,
      role: GroupChatRoles.Member,
    });
    const notification = await Notification.findOne({
      where: {
        user: { id: user.id },
        fromUser: { id: userId },
        group: { id },
      },
    });

    await newGroupChatUser.save();
    if (notification) {
      notification.acceptRequest = true;
      await notification.save();
    }
    const body = req.t("admin_accept_join_body", {
      name: groupChat.name,
      lng: addedUser.language,
    });
    await sendAndCreateNotification({
      title: req.t("admin_accept_join_title", { lng: addedUser.language }),
      body,
      users: [addedUser],
      fromUser: user,
      group: groupChat,
      data: {
        groupChat: groupChat.name ?? "",
        groupChatId: groupChat.id ?? "",
        groupChatImageUrl: groupChat.fullImageUrl ?? "",
        fromUser: user.username ?? "",
        fromUserId: user.id ?? "",
        fromUserImageUrl: user.fullImageUrl ?? "",
      },
      fcmTokens: [addedUser.fcm],
      type: NotificationType.AdminAcceptJoinGroupRequest,
    });
    res.status(200).json({ message: req.t("success") });
  }
);

export const joinGroup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { id } = req.params;
    const groupChat = await GroupsChat.findOne({
      where: {
        id,
      },
    });
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    const groupAdmin = await GroupsChatUsers.findOne({
      where: {
        groupChat: {
          id,
        },
        role: GroupChatRoles.Admin,
      },
      relations: { user: true },
    });
    console.log("groupAdminnnnn", groupAdmin);
    // send notification to group admin
    const body = req.t("user_request_to_join_group_chat", {
      username: user.username,
      lng: groupAdmin.user.language,
    });
    await sendAndCreateNotification({
      title: req.t("join_group_chat_request", {
        lng: groupAdmin.user.language,
      }),
      body,
      users: [groupAdmin.user],
      fromUser: user,
      group: groupChat,
      data: {
        groupChat: groupChat.name ?? "",
        groupChatId: groupChat.id ?? "",
        groupChatImageUrl: groupChat.fullImageUrl ?? "",
        fromUser: user.username ?? "",
        fromUserId: user.id ?? "",
        fromUserImageUrl: user.fullImageUrl ?? "",
      },
      fcmTokens: [groupAdmin.user.fcm],
      type: NotificationType.JoinGroupRequest,
    });
    res
      .status(200)
      .json({ message: req.t("join_request_sent_to_group_admin") });
  }
);

export const createGroupChat = asyncHandler(
  async (
    req: Request<{}, typeof addGroupChatValidator>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, usersIds, image } = req.body;
    const user = req.user;
    const users = await User.find({
      where: {
        id: In([...(usersIds ?? [])]),
      },
    });
    const newGroupChat = GroupsChat.create({
      name,
      imageUrl: image,
    });
    await newGroupChat.save();
    const arUsers = [];
    const enUsers = [];
    const usersGroupChat = users.map((currentUser) => {
      if (currentUser.language === "ar") {
        arUsers.push(currentUser);
      } else {
        enUsers.push(currentUser);
      }
      return GroupsChatUsers.create({
        user: currentUser,
        groupChat: newGroupChat,
        acceptJoin: user.id === currentUser.id,
        role: GroupChatRoles.Member,
      });
    });
    usersGroupChat.push(
      GroupsChatUsers.create({
        user,
        groupChat: newGroupChat,
        acceptJoin: true,
        role: GroupChatRoles.Admin,
      })
    );

    await GroupsChatUsers.save(usersGroupChat);
    await addUsersNotifications({
      user,
      users: arUsers,
      newGroupChat,
      language: "ar",
    });
    await addUsersNotifications({
      user,
      users: enUsers,
      newGroupChat,
      language: "en",
    });

    res.status(201).json({ newGroupChat });
  }
);

export const getGroupChatById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    // const groupChatGuest = await GroupsChat.findOne({
    //   where: { id },
    // });
    if (groupChat) groupChat.isAcceptJoin(user.id, true);
    res.status(200).json({ groupChat });
  }
);

export const getGroupChatMessages = asyncHandler(
  async (
    req: Request<{ id: string }, {}, {}, GroupsChatMessagesQuery>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const user = req.user;
    const { page, pageSize, messageType } = req.query;
    const { take, skip } = getPaginationData({ page, pageSize });
    const groupChat = await GroupsChat.findOne({ where: { id } });
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    let querable = GroupsChatMessages.getRepository()
      .createQueryBuilder("messages")
      .leftJoin("messages.group", "chat")
      .where("chat.id = :chatId", { chatId: id });

    if (messageType) {
      if (messageType === MessageType.images) {
        querable = querable.andWhere("messages.imageUrl Is Not Null");
      }
      if (messageType === MessageType.records) {
        querable = querable.andWhere("messages.recordUrl Is Not Null");
      }
      if (messageType === MessageType.files) {
        querable = querable.andWhere("messages.fileUrl Is Not Null");
      }
      if (messageType === MessageType.links) {
        querable = querable.andWhere("messages.isLink = 1");
      }
    }

    const count = await querable.getCount();
    const messages = await querable
      .leftJoinAndSelect("messages.from", "user")
      .leftJoinAndSelect("messages.sharedGroup", "sharedGroup")
      .orderBy("messages.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .select("messages")
      .addSelect(["user.id", "user.username", "user.email", "user.imageUrl"])
      .addSelect("sharedGroup")
      .getMany();
    const checkIsSeenMessages = messages.map((msg) => {
      msg.isSeenMessage(user.id);
      return msg;
    });
    res
      .status(200)
      .json(
        new GenericResponse<GroupsChatMessages>(
          Number(page),
          take,
          count,
          checkIsSeenMessages
        )
      );
  }
);

export const updateGroupChat = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { name, image, muteNotification, backgroundColor, backgroundCover } =
      req.body;
    const user = req.user;
    const groupChat = await GroupsChat.findOne({
      where: {
        id,
        userGroupsChats: {
          user: {
            id: user.id,
          },
        },
      },
      relations: {
        userGroupsChats: { user: true },
      },
    });
    const userGroupsChatIndex = groupChat.userGroupsChats.findIndex(
      (groupchat) => groupchat.user.id === user.id
    );
    const userGroupsChat = groupChat.userGroupsChats[userGroupsChatIndex];

    if (userGroupsChat.role !== GroupChatRoles.Admin) {
      return next(new ApiError("just admin can change group settings", 409));
    }
    if (!groupChat) return next(new ApiError("groupcaht not found", 400));
    groupChat.name = name;
    if (image) groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover) groupChat.backgroundCoverUrl = backgroundCover;

    if (muteNotification !== null && muteNotification !== undefined) {
      userGroupsChat.muteNotification = muteNotification === "true";
      groupChat.userGroupsChats[userGroupsChatIndex] = userGroupsChat;
    }
    await groupChat.save();
    await GroupsChatUsers.save(groupChat.userGroupsChats);
    Websocket.sendNewGroupUpdate(groupChat);
    await GroupsChat.getGroupChatWithMessagesData(groupChat, user.id);
    res.status(200).json({ groupChat });
  }
);

export const addUsersToGroupChat = asyncHandler(
  async (
    req: Request<{ id: string }, typeof addGroupChatValidator>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const user = req.user;
    const { usersIds } = req.body;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    const isAdmin = isUserGroupAdmin(user, groupChat?.userGroupsChats);
    if (!isAdmin) return next(new ApiError("you are not group admin", 400));
    const filterdUserIds = usersIds.filter(
      (userId) =>
        !groupChat.userGroupsChats.find((group) => group.user.id === userId)
    );

    const users = await User.find({
      where: {
        id: In(filterdUserIds),
      },
    });

    const usersFcm: string[] = [];
    const arUsers = [];
    const enUsers = [];
    const usersGroupChat = users.map((user) => {
      if (user.language === "ar") {
        arUsers.push(user);
      } else {
        enUsers.push(user);
      }
      return GroupsChatUsers.create({
        user,
        groupChat,
        role: GroupChatRoles.Member,
      });
    });
    await GroupsChatUsers.save(usersGroupChat);

    const groupChatUsers = await User.find({
      where: {
        userGroupsChats: {
          groupChat: {
            id,
          },
        },
      },
      select: {
        id: true,
        username: true,
        email: true,
        imageUrl: true,
        phoneNumber: true,
        birthDate: true,
        gender: true,
      },
    });
    Websocket.sendNewGroupUpdate(groupChat);

    await addUsersNotifications({
      user,
      users: arUsers,
      newGroupChat: groupChat,
      language: "ar",
    });
    await addUsersNotifications({
      user,
      users: enUsers,
      newGroupChat: groupChat,
      language: "en",
    });
    res.status(200).json({ users: groupChatUsers });
  }
);

const addUsersNotifications = async ({
  language,
  user,
  newGroupChat,
  users,
}: {
  language: string;
  user: User;
  newGroupChat: GroupsChat;
  users: User[];
}) => {
  if (users.length) {
    const t = i18next.getFixedT(language);
    const body = t("user_added_to_group_chat", {
      username: user.username,
      groupChatName: newGroupChat.name,
    });
    await sendAndCreateNotification({
      title: t("add_to_group_chat"),
      body,
      users,
      group: newGroupChat,
      data: {
        groupChat: newGroupChat.name ?? "",
        groupChatId: newGroupChat.id ?? "",
        groupChatImageUrl: newGroupChat.fullImageUrl ?? "",
        fromUser: user.username ?? "",
        fromUserId: user.id ?? "",
        fromUserImageUrl: user.fullImageUrl ?? "",
      },
      fcmTokens: users
        // .filter((u) => u.id !== user.id)
        .map((user) => user.fcm)
        .filter((fcm) => !!fcm),
      type: NotificationType.UserAddedTOGroupChat,
    });
  }
};

export const removeUsersfromGroupChat = asyncHandler(
  async (
    req: Request<{ id: string }, typeof addGroupChatValidator>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const { usersIds } = req.body;
    const user = req.user;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    const deletedRows = await GroupsChatUsers.find({
      where: {
        groupChat: { id },
        user: { id: In(usersIds) },
      },
      relations: {
        user: true,
      },
    });
    const isAdmin = isUserGroupAdmin(user, groupChat.userGroupsChats);
    if (!isAdmin) return next(new ApiError("you are not group admin", 400));
    await GroupsChatUsers.remove(deletedRows);
    Websocket.sendNewGroupUpdate(groupChat);
    res.status(200).json({ message: "removed users to groupchat succes" });
  }
);

export const leaveGroupChat = asyncHandler(
  async (
    req: Request<{ id: string }, typeof addGroupChatValidator>,
    res: Response,
    next: NextFunction
  ) => {
    const { id } = req.params;
    const user = req.user;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    const deletedRows = await GroupsChatUsers.find({
      where: {
        groupChat: { id },
        user: { id: user.id },
      },
    });
    await GroupsChatUsers.remove(deletedRows);
    Websocket.sendNewGroupUpdate(groupChat);
    res.status(200).json({ message: "user leaved groupchat succes" });
  }
);

const isUserGroupAdmin = (user: User, userGroupsChat: GroupsChatUsers[]) => {
  const userGroupChat = userGroupsChat.find(
    (chat) => chat.user?.id === user.id
  );
  return userGroupChat?.role === GroupChatRoles.Admin;
};

export const newGroupChatMessage = asyncHandler(
  async (req: Request<{ id: string }>, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const { message, file, image, record } = req.body;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
      return next(new ApiError(req.t("group_chat_not_found"), 400));
    }
    const newMessage = await addNewMessage({
      message,
      groupChatId: id,
      user,
      fileUrl: file,
      imageUrl: image,
      recordUrl: record,
      translate: req.t,
    });
    res.status(201).json({ message: "messages added successfuly", newMessage });
  }
);

export const addNewMessage = async ({
  message,
  groupChatId,
  user,
  fileUrl,
  imageUrl,
  recordUrl,
  sharedGroup,
  translate,
}: {
  message?: string;
  groupChatId: string;
  user: User;
  imageUrl?: string;
  recordUrl?: string;
  fileUrl?: string;
  sharedGroup?: GroupsChat;
  translate: TFunction;
}) => {
  const groupChat = await checkGroupChatExist(groupChatId, user.id, translate);
  const isLink = containsLink(message);

  const newMessage = GroupsChatMessages.create({
    from: user,
    message,
    group: groupChat,
    fileUrl,
    imageUrl,
    isLink,
    recordUrl,
    sharedGroup,
    readbyIds: [user.id],
  });
  delete newMessage.from.userGroupsChats;
  delete newMessage.from.password;
  delete newMessage.from.passwordChangedAt;
  delete newMessage.from.passwordResetCode;
  delete newMessage.from.passwordResetExpires;
  delete newMessage.from.passwordResetVerified;

  await newMessage.save();
  return newMessage;
};

export const sendNewMessageByNotification = async ({
  message,
  groupChat,
  users,
  translate,
}: {
  message: GroupsChatMessages;
  groupChat: GroupsChat;
  users: User[];
  translate: TFunction;
}) => {
  const arUsers = [];
  const enUsers = [];
  users.map((user) => {
    if (user.language === "ar") {
      arUsers.push(user);
    } else {
      enUsers.push(user);
    }
  });
  const body =
    message.imageUrl || message.fileUrl || message.recordUrl || message.message;
  await sendAndCreateNotification({
    title: translate("new_groupcaht_message", {
      lng: "en",
    }),
    body,
    users: enUsers,
    // fromUser: user,
    group: groupChat,
    data: {
      groupChat: groupChat.name ?? "",
      groupChatId: groupChat.id ?? "",
      groupChatImageUrl: groupChat.fullImageUrl ?? "",
      message: message.message ?? "",
      // fromUser: user,
    },
    fcmTokens: enUsers.map((u) => u.fcm),
    type: NotificationType.NewGroupChatMessage,
    createNotification: false,
  });
  await sendAndCreateNotification({
    title: translate("new_groupcaht_message", {
      lng: "ar",
    }),
    body,
    users: arUsers,
    // fromUser: user,
    group: groupChat,
    data: {
      groupChat: groupChat.name ?? "",
      groupChatId: groupChat.id ?? "",
      groupChatImageUrl: groupChat.fullImageUrl ?? "",
      message: message.message ?? "",
      // fromUser: user,
    },
    fcmTokens: arUsers.map((u) => u.fcm),
    type: NotificationType.NewGroupChatMessage,
    createNotification: false,
  });
};

export const readMessages = async ({
  messagesIds,
  userId,
  chatId,
}: {
  messagesIds: string[];
  userId: string;
  chatId: string;
}) => {
  const updateMessages = await GroupsChatMessages.update(
    {
      id: In(messagesIds),
      group: {
        id: chatId,
        userGroupsChats: {
          user: {
            id: In([userId]),
          },
        },
      },
    },
    {
      readbyIds: () => `
      CASE
        WHEN readbyIds IS NULL OR readbyIds = '' THEN '${userId}'
        WHEN FIND_IN_SET('${userId}', readbyIds) = 0 THEN CONCAT(readbyIds, ',', '${userId}')
        ELSE readbyIds
      END
    `,
    }
  );
};

const checkGroupChatExist = async (
  groupChatId: string,
  userId: string,
  translate: TFunction
) => {
  const groupChat = await GroupsChat.findOne({
    where: {
      id: groupChatId,
      userGroupsChats: {
        user: {
          id: userId,
        },
      },
    },
  });
  if (!groupChat) {
    throw new ApiError(translate("group_chat_not_found"), 400);
  }
  return groupChat;
};

export const getUserRooms = async (roomsIds: string[], userId: string) => {
  return await GroupsChat.find({
    where: {
      id: In(roomsIds),
      userGroupsChats: {
        user: {
          id: userId,
        },
      },
    },
  });
};
