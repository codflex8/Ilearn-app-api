import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { GroupsChat } from "../models/GroupsChat.model";
import { getPaginationData } from "../utils/getPaginationData";
import { BaseQuery } from "../utils/validators/BaseQuery";
import { GenericResponse } from "../utils/GenericResponse";
import {
  addGroupChatValidator,
  GroupChatRoles,
} from "../utils/validators/GroupsChatValidator";
import { User } from "../models/User.model";
import { In } from "typeorm";
import { GroupsChatUsers } from "../models/GroupsChatUsers.model";
import ApiError from "../utils/ApiError";
import { GroupsChatMessages } from "../models/GroupsChatMessages.model";
import { containsLink } from "../utils/extractLing";
import Websocket from "../websocket/websocket";

enum MessageType {
  messages = "messages",
  images = "images",
  records = "records",
  files = "files",
  links = "links",
}

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
      return next(new ApiError("can not find groupChat", 400));
    }
    groupChatUser.acceptJoin = true;
    await groupChatUser.save();
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    groupChat.isAcceptJoin(user.id, true);
    res.status(200).json({ groupChat });
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
      return next(new ApiError("groupchat not found", 400));
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
    //ToDo: send notification to group admin
    res.status(200).json({ message: "join request sent to group admin" });
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
        id: In([...(usersIds ?? []), user.id]),
      },
    });
    const newGroupChat = GroupsChat.create({
      name,
      imageUrl: image,
    });
    await newGroupChat.save();
    const usersGroupChat = users.map((currentUser) =>
      GroupsChatUsers.create({
        user: currentUser,
        groupChat: newGroupChat,
        acceptJoin: user.id === currentUser.id,
        role:
          user.id === currentUser.id
            ? GroupChatRoles.Admin
            : GroupChatRoles.Member,
      })
    );

    await GroupsChatUsers.save(usersGroupChat);
    res.status(201).json({ newGroupChat });
  }
);

export const getGroupChatById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const user = req.user;
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
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
    const groupChat = await GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
      return next(new ApiError("groupchat not found", 400));
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
      .orderBy("messages.createdAt", "DESC")
      .skip(skip)
      .take(take)
      .select("messages")
      .addSelect(["user.id", "user.username", "user.email", "user.imageUrl"])
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
      return next(new ApiError("groupchat not found", 400));
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
    const usersGroupChat = users.map((user) =>
      GroupsChatUsers.create({
        user,
        groupChat,
        role: GroupChatRoles.Member,
      })
    );

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
    res.status(200).json({ users: groupChatUsers });
  }
);

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
      return next(new ApiError("groupchat not found", 400));
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
      return next(new ApiError("groupchat not found", 400));
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
      return next(new ApiError("groupchat not found", 400));
    }
    const newMessage = await addNewMessage({
      message,
      groupChatId: id,
      user,
      fileUrl: file,
      imageUrl: image,
      recordUrl: record,
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
}: {
  message?: string;
  groupChatId: string;
  user: User;
  imageUrl?: string;
  recordUrl?: string;
  fileUrl?: string;
}) => {
  const groupChat = await checkGroupChatExist(groupChatId, user.id);
  const isLink = containsLink(message);

  const newMessage = GroupsChatMessages.create({
    from: user,
    message,
    group: groupChat,
    fileUrl,
    imageUrl,
    isLink,
    recordUrl,
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

const checkGroupChatExist = async (groupChatId: string, userId: string) => {
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
    throw new ApiError("groupchat not found", 400);
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
