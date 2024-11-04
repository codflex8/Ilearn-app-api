"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.leaveGroupChat = exports.removeUsersfromGroupChat = exports.addUsersToGroupChat = exports.updateGroupChat = exports.getGroupChatById = exports.createGroupChat = exports.getGroupsChat = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const GroupsChat_model_1 = require("../models/GroupsChat.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const User_model_1 = require("../models/User.model");
const typeorm_1 = require("typeorm");
const GroupsChatUsers_model_1 = require("../models/GroupsChatUsers.model");
exports.getGroupsChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, name } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let condition = {
        users: {
            id: user.id,
        },
    };
    if (name) {
        condition = Object.assign(Object.assign({}, condition), { name: (0, typeorm_1.ILike)(`%${name}%`) });
    }
    const [groupsChat, count] = await GroupsChat_model_1.GroupsChat.findAndCount({
        where: condition,
        order: {
            createdAt: "desc",
        },
        take,
        skip,
    });
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, groupsChat));
});
exports.createGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, usersIds, imageUrl } = req.body;
    // ToDO: set group chat admin and memebers
    const user = req.user;
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)(usersIds),
        },
    });
    const newGroupChat = GroupsChat_model_1.GroupsChat.create({
        name,
        users,
        imageUrl,
    });
    await newGroupChat.save();
    res.status(201).json({ newGroupChat });
});
exports.getGroupChatById = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    res.status(200).json({ groupChat });
});
exports.updateGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { name, usersIds, image, muteNotification, backgroundColor, backgroundCover, } = req.body;
    // ToDO: set group chat admin and memebers
    const user = req.user;
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)(usersIds !== null && usersIds !== void 0 ? usersIds : []),
        },
    });
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
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
    if (users.length > 0)
        groupChat.users = [...groupChat.users, ...users];
    if (image)
        groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover)
        groupChat.backgroundCoverUrl = backgroundCover;
    // groupChat.userGroupsChats.
    await groupChat.save();
    res.status(201).json({ groupChat });
});
exports.addUsersToGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { usersIds } = req.body;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)(usersIds),
        },
    });
    groupChat.users = [...groupChat.users, ...users];
    await groupChat.save();
    res.status(200).json({ message: "add users to groupchat succes" });
});
exports.removeUsersfromGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { usersIds } = req.body;
    const deletedRows = await GroupsChatUsers_model_1.GroupsChatUsers.find({
        where: {
            chatId: id,
            userId: (0, typeorm_1.In)(usersIds),
        },
    });
    await GroupsChatUsers_model_1.GroupsChatUsers.remove(deletedRows);
    res.status(200).json({ message: "removed users to groupchat succes" });
});
exports.leaveGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const deletedRows = await GroupsChatUsers_model_1.GroupsChatUsers.find({
        where: {
            chatId: id,
            userId: user.id,
        },
    });
    await GroupsChatUsers_model_1.GroupsChatUsers.remove(deletedRows);
    res.status(200).json({ message: "user leaved groupchat succes" });
});
//# sourceMappingURL=GroupsChat.controller.js.map