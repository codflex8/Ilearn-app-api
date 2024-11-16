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
import { FindOptionsWhere, ILike, In } from "typeorm";
import { GroupsChatUsers } from "../models/GroupsChatUsers.model";
import ApiError from "../utils/ApiError";
import { GroupsChatMessages } from "../models/GroupsChatMessages.model";
import { containsLink } from "../utils/extractLing";

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
    let condition: FindOptionsWhere<GroupsChat> = {
      userGroupsChats: {
        user: {
          id: user.id,
        },
      },
    };
    if (name) {
      condition = { ...condition, name: ILike(`%${name}%`) };
    }
    const [groupsChat, count] = await GroupsChat.findAndCount({
      where: condition,
      relations: {
        userGroupsChats: true,
      },
      order: {
        createdAt: "desc",
      },
      take,
      skip,
    });

    res
      .status(200)
      .json(
        new GenericResponse<GroupsChat>(Number(page), take, count, groupsChat)
      );
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

    res
      .status(200)
      .json(
        new GenericResponse<GroupsChatMessages>(
          Number(page),
          take,
          count,
          messages
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
    groupChat.name = name;
    if (image) groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover) groupChat.backgroundCoverUrl = backgroundCover;

    if (muteNotification !== null && muteNotification !== undefined) {
      const userGroupsChatIndex = groupChat.userGroupsChats.findIndex(
        (groupchat) => groupchat.user.id === user.id
      );
      const userGroupsChat = groupChat.userGroupsChats[userGroupsChatIndex];
      userGroupsChat.muteNotification = muteNotification === "true";
      groupChat.userGroupsChats[userGroupsChatIndex] = userGroupsChat;
    }
    await groupChat.save();
    await GroupsChatUsers.save(groupChat.userGroupsChats);
    res.status(201).json({ groupChat });
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

    res.status(200).json({ message: "add users to groupchat succes" });
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

    res.status(200).json({ message: "user leaved groupchat succes" });
  }
);

const isUserGroupAdmin = (user: User, userGroupsChat: GroupsChatUsers[]) => {
  console.log("userrrrr", { user, userGroupsChat });
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
  });
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
            id: userId,
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
