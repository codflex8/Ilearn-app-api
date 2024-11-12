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
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const User_model_1 = require("../models/User.model");
const typeorm_1 = require("typeorm");
const GroupsChatUsers_model_1 = require("../models/GroupsChatUsers.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
exports.getGroupsChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, name } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let condition = {
        userGroupsChats: {
            user: {
                id: user.id,
            },
        },
    };
    if (name) {
        condition = Object.assign(Object.assign({}, condition), { name: (0, typeorm_1.ILike)(`%${name}%`) });
    }
    const [groupsChat, count] = await GroupsChat_model_1.GroupsChat.findAndCount({
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
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, groupsChat));
});
exports.createGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { name, usersIds, image } = req.body;
    const user = req.user;
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)([...(usersIds !== null && usersIds !== void 0 ? usersIds : []), user.id]),
        },
    });
    const newGroupChat = GroupsChat_model_1.GroupsChat.create({
        name,
        imageUrl: image,
    });
    await newGroupChat.save();
    const usersGroupChat = users.map((currentUser) => GroupsChatUsers_model_1.GroupsChatUsers.create({
        user: currentUser,
        groupChat: newGroupChat,
        role: user.id === currentUser.id
            ? GroupsChatValidator_1.GroupChatRoles.Admin
            : GroupsChatValidator_1.GroupChatRoles.Member,
    }));
    await GroupsChatUsers_model_1.GroupsChatUsers.save(usersGroupChat);
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
    const { name, image, muteNotification, backgroundColor, backgroundCover } = req.body;
    const user = req.user;
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
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
    if (image)
        groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover)
        groupChat.backgroundCoverUrl = backgroundCover;
    if (muteNotification) {
        const userGroupsChatIndex = groupChat.userGroupsChats.findIndex((groupchat) => groupchat.user.id === user.id);
        const userGroupsChat = groupChat.userGroupsChats[userGroupsChatIndex];
        userGroupsChat.muteNotification = Boolean(muteNotification);
        groupChat.userGroupsChats.splice(userGroupsChatIndex, 1, userGroupsChat);
    }
    await groupChat.save();
    await GroupsChatUsers_model_1.GroupsChatUsers.save(groupChat.userGroupsChats);
    res.status(201).json({ groupChat });
});
exports.addUsersToGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { usersIds } = req.body;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    const isAdmin = isUserGroupAdmin(user, groupChat === null || groupChat === void 0 ? void 0 : groupChat.userGroupsChats);
    if (!isAdmin)
        return next(new ApiError_1.default("you are not group admin", 400));
    const filterdUserIds = usersIds.filter((userId) => !groupChat.userGroupsChats.find((group) => group.user.id === userId));
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)(filterdUserIds),
        },
    });
    const usersGroupChat = users.map((user) => GroupsChatUsers_model_1.GroupsChatUsers.create({
        user,
        groupChat,
        role: GroupsChatValidator_1.GroupChatRoles.Member,
    }));
    await GroupsChatUsers_model_1.GroupsChatUsers.save(usersGroupChat);
    res.status(200).json({ message: "add users to groupchat succes" });
});
exports.removeUsersfromGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { usersIds } = req.body;
    const user = req.user;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    const deletedRows = await GroupsChatUsers_model_1.GroupsChatUsers.find({
        where: {
            groupChat: { id },
            user: { id: (0, typeorm_1.In)(usersIds) },
        },
        relations: {
            user: true,
        },
    });
    const isAdmin = isUserGroupAdmin(user, groupChat.userGroupsChats);
    if (!isAdmin)
        return next(new ApiError_1.default("you are not group admin", 400));
    await GroupsChatUsers_model_1.GroupsChatUsers.remove(deletedRows);
    res.status(200).json({ message: "removed users to groupchat succes" });
});
exports.leaveGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const deletedRows = await GroupsChatUsers_model_1.GroupsChatUsers.find({
        where: {
            groupChat: { id },
            user: { id: user.id },
        },
    });
    await GroupsChatUsers_model_1.GroupsChatUsers.remove(deletedRows);
    res.status(200).json({ message: "user leaved groupchat succes" });
});
const isUserGroupAdmin = (user, userGroupsChat) => {
    console.log("userrrrr", { user, userGroupsChat });
    const userGroupChat = userGroupsChat.find((chat) => { var _a; return ((_a = chat.user) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
    return (userGroupChat === null || userGroupChat === void 0 ? void 0 : userGroupChat.role) === GroupsChatValidator_1.GroupChatRoles.Admin;
};
//# sourceMappingURL=GroupsChat.controller.js.map