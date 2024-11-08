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

interface GroupsChatQuery extends BaseQuery {
  name?: string;
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
    const { name, usersIds, imageUrl } = req.body;
    const user = req.user;
    const users = await User.find({
      where: {
        id: In([...(usersIds ?? []), user.id]),
      },
    });
    const newGroupChat = GroupsChat.create({
      name,
      imageUrl,
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
    if (muteNotification) {
      const userGroupsChatIndex = groupChat.userGroupsChats.findIndex(
        (groupchat) => groupchat.user.id === user.id
      );
      const userGroupsChat = groupChat.userGroupsChats[userGroupsChatIndex];
      userGroupsChat.muteNotification = Boolean(muteNotification);
      groupChat.userGroupsChats.splice(userGroupsChatIndex, 1, userGroupsChat);
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
