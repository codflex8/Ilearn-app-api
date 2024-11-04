import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { GroupsChat } from "../models/GroupsChat.model";
import { getPaginationData } from "../utils/getPaginationData";
import { BaseQuery } from "../utils/validators/BaseQuery";
import { GenericResponse } from "../utils/GenericResponse";
import { addGroupChatValidator } from "../utils/validators/GroupsChatValidator";
import { User } from "../models/User.model";
import { FindOptionsWhere, ILike, In } from "typeorm";
import { GroupsChatUsers } from "../models/GroupsChatUsers.model";

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
      users: {
        id: user.id,
      },
    };
    if (name) {
      condition = { ...condition, name: ILike(`%${name}%`) };
    }
    const [groupsChat, count] = await GroupsChat.findAndCount({
      where: condition,
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
    // ToDO: set group chat admin and memebers
    const user = req.user;
    const users = await User.find({
      where: {
        id: In(usersIds),
      },
    });
    const newGroupChat = GroupsChat.create({
      name,
      users,
      imageUrl,
    });

    await newGroupChat.save();

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
    const {
      name,
      usersIds,
      image,
      muteNotification,
      backgroundColor,
      backgroundCover,
    } = req.body;
    // ToDO: set group chat admin and memebers
    const user = req.user;
    const users = await User.find({
      where: {
        id: In(usersIds ?? []),
      },
    });
    const groupChat = await GroupsChat.findOne({
      where: {
        id,
        // userGroupsChats: {
        //   userId: user.id,
        // },
        // users: {
        //   id: user.id,
        // },
      },
      relations: {
        users: true,
        userGroupsChats: true,
      },
    });
    groupChat.name = name;
    if (users.length > 0) groupChat.users = [...groupChat.users, ...users];
    if (image) groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover) groupChat.backgroundCoverUrl = backgroundCover;
    // groupChat.userGroupsChats.

    await groupChat.save();
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
    const users = await User.find({
      where: {
        id: In(usersIds),
      },
    });
    groupChat.users = [...groupChat.users, ...users];
    await groupChat.save();

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
    const deletedRows = await GroupsChatUsers.find({
      where: {
        chatId: id,
        userId: In(usersIds),
      },
    });

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
        chatId: id,
        userId: user.id,
      },
    });
    await GroupsChatUsers.remove(deletedRows);

    res.status(200).json({ message: "user leaved groupchat succes" });
  }
);
