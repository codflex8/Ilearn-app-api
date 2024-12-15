"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserRooms = exports.readMessages = exports.sendNewMessageByNotification = exports.addNewMessage = exports.newGroupChatMessage = exports.leaveGroupChat = exports.removeUsersfromGroupChat = exports.addUsersToGroupChat = exports.updateGroupChat = exports.getGroupChatMessages = exports.getGroupChatById = exports.createGroupChat = exports.joinGroup = exports.acceptJoinRequest = exports.acceptJoinGroup = exports.getGroupsChat = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const GroupsChat_model_1 = require("../models/GroupsChat.model");
const getPaginationData_1 = require("../utils/getPaginationData");
const GenericResponse_1 = require("../utils/GenericResponse");
const GroupsChatValidator_1 = require("../utils/validators/GroupsChatValidator");
const User_model_1 = require("../models/User.model");
const typeorm_1 = require("typeorm");
const GroupsChatUsers_model_1 = require("../models/GroupsChatUsers.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const GroupsChatMessages_model_1 = require("../models/GroupsChatMessages.model");
const extractLing_1 = require("../utils/extractLing");
const websocket_1 = __importDefault(require("../websocket/websocket"));
const sendNotification_1 = require("../utils/sendNotification");
const Notification_model_1 = require("../models/Notification.model");
exports.getGroupsChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const user = req.user;
    const { page, pageSize, name } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    let querable = GroupsChat_model_1.GroupsChat.getRepository()
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
        await GroupsChat_model_1.GroupsChat.getGroupChatWithMessagesData(chat, user.id);
        return chat;
    });
    const chats = await Promise.all(getGroupsChatWithMessages);
    res
        .status(200)
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, chats));
});
exports.acceptJoinGroup = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    const { id } = req.params;
    const user = req.user;
    const groupChatUser = await GroupsChatUsers_model_1.GroupsChatUsers.findOne({
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
        return next(new ApiError_1.default(req.t("cannot_find_group_chat"), 400));
    }
    groupChatUser.acceptJoin = true;
    await groupChatUser.save();
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    groupChat.isAcceptJoin(user.id, true);
    // send nofitification to admin
    const groupAdmin = await GroupsChatUsers_model_1.GroupsChatUsers.findOne({
        where: {
            groupChat: {
                id,
            },
            role: GroupsChatValidator_1.GroupChatRoles.Admin,
        },
        relations: { user: true },
    });
    const title = req.t("user_accept_join_title");
    const body = req.t("user_accept_join_group", {
        username: user.username,
        name: groupChat.name,
    });
    await (0, sendNotification_1.sendAndCreateNotification)({
        title,
        body,
        users: [groupAdmin.user],
        fromUser: user,
        group: groupChat,
        data: {
            groupChat: (_a = groupChat.name) !== null && _a !== void 0 ? _a : "",
            groupChatId: (_b = groupChat.id) !== null && _b !== void 0 ? _b : "",
            groupChatImageUrl: (_c = groupChat.fullImageUrl) !== null && _c !== void 0 ? _c : "",
            fromUser: (_d = user.username) !== null && _d !== void 0 ? _d : "",
            fromUserId: (_e = user.id) !== null && _e !== void 0 ? _e : "",
            fromUserImageUrl: (_f = user.fullImageUrl) !== null && _f !== void 0 ? _f : "",
        },
        fcmTokens: [groupAdmin.user.fcm],
        type: Notification_model_1.NotificationType.UserAcceptJoinGroup,
    });
    res.status(200).json({ groupChat });
});
exports.acceptJoinRequest = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a;
    const user = req.user;
    const { userId } = req.body;
    const { id } = req.params;
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
        where: {
            id: (0, typeorm_1.Equal)(id),
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
        throw new ApiError_1.default(req.t("group_chat_not_found"), 400);
    }
    if (!(groupChat === null || groupChat === void 0 ? void 0 : groupChat.userGroupsChats[0]) ||
        ((_a = groupChat.userGroupsChats[0]) === null || _a === void 0 ? void 0 : _a.role) !== GroupsChatValidator_1.GroupChatRoles.Admin) {
        throw new ApiError_1.default(req.t("you_are_not_group_admin"), 400);
    }
    const addedUser = await User_model_1.User.findOne({
        where: {
            id: userId,
        },
    });
    const newGroupChatUser = await GroupsChatUsers_model_1.GroupsChatUsers.create({
        user: addedUser,
        groupChat,
        acceptJoin: true,
        role: GroupsChatValidator_1.GroupChatRoles.Member,
    });
    const notification = await Notification_model_1.Notification.findOne({
        where: {
            user: { id: user.id },
            fromUser: { id: userId },
            group: { id },
        },
    });
    if (notification) {
        notification.acceptRequest = true;
    }
    await newGroupChatUser.save();
    await notification.save();
    res.status(200).json({ message: req.t("success") });
});
exports.joinGroup = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    const user = req.user;
    const { id } = req.params;
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
        where: {
            id,
        },
    });
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
    const groupAdmin = await GroupsChatUsers_model_1.GroupsChatUsers.findOne({
        where: {
            groupChat: {
                id,
            },
            role: GroupsChatValidator_1.GroupChatRoles.Admin,
        },
        relations: { user: true },
    });
    console.log("groupAdminnnnn", groupAdmin);
    // send notification to group admin
    const body = req.t("user_request_to_join_group_chat", {
        username: user.username,
    });
    await (0, sendNotification_1.sendAndCreateNotification)({
        title: req.t("join_group_chat_request"),
        body,
        users: [groupAdmin.user],
        fromUser: user,
        group: groupChat,
        data: {
            groupChat: (_a = groupChat.name) !== null && _a !== void 0 ? _a : "",
            groupChatId: (_b = groupChat.id) !== null && _b !== void 0 ? _b : "",
            groupChatImageUrl: (_c = groupChat.fullImageUrl) !== null && _c !== void 0 ? _c : "",
            fromUser: (_d = user.username) !== null && _d !== void 0 ? _d : "",
            fromUserId: (_e = user.id) !== null && _e !== void 0 ? _e : "",
            fromUserImageUrl: (_f = user.fullImageUrl) !== null && _f !== void 0 ? _f : "",
        },
        fcmTokens: [groupAdmin.user.fcm],
        type: Notification_model_1.NotificationType.JoinGroupRequest,
    });
    res
        .status(200)
        .json({ message: req.t("join_request_sent_to_group_admin") });
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
        acceptJoin: user.id === currentUser.id,
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
    // const groupChatGuest = await GroupsChat.findOne({
    //   where: { id },
    // });
    if (groupChat)
        groupChat.isAcceptJoin(user.id, true);
    res.status(200).json({ groupChat });
});
exports.getGroupChatMessages = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { page, pageSize, messageType } = req.query;
    const { take, skip } = (0, getPaginationData_1.getPaginationData)({ page, pageSize });
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({ where: { id } });
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
    let querable = GroupsChatMessages_model_1.GroupsChatMessages.getRepository()
        .createQueryBuilder("messages")
        .leftJoin("messages.group", "chat")
        .where("chat.id = :chatId", { chatId: id });
    if (messageType) {
        if (messageType === GroupsChatValidator_1.MessageType.images) {
            querable = querable.andWhere("messages.imageUrl Is Not Null");
        }
        if (messageType === GroupsChatValidator_1.MessageType.records) {
            querable = querable.andWhere("messages.recordUrl Is Not Null");
        }
        if (messageType === GroupsChatValidator_1.MessageType.files) {
            querable = querable.andWhere("messages.fileUrl Is Not Null");
        }
        if (messageType === GroupsChatValidator_1.MessageType.links) {
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
        .json(new GenericResponse_1.GenericResponse(Number(page), take, count, checkIsSeenMessages));
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
    const userGroupsChatIndex = groupChat.userGroupsChats.findIndex((groupchat) => groupchat.user.id === user.id);
    const userGroupsChat = groupChat.userGroupsChats[userGroupsChatIndex];
    if (userGroupsChat.role !== GroupsChatValidator_1.GroupChatRoles.Admin) {
        return next(new ApiError_1.default("just admin can change group settings", 409));
    }
    if (!groupChat)
        return next(new ApiError_1.default("groupcaht not found", 400));
    groupChat.name = name;
    if (image)
        groupChat.imageUrl = image;
    groupChat.backgroundColor = backgroundColor;
    if (backgroundCover)
        groupChat.backgroundCoverUrl = backgroundCover;
    if (muteNotification !== null && muteNotification !== undefined) {
        userGroupsChat.muteNotification = muteNotification === "true";
        groupChat.userGroupsChats[userGroupsChatIndex] = userGroupsChat;
    }
    await groupChat.save();
    await GroupsChatUsers_model_1.GroupsChatUsers.save(groupChat.userGroupsChats);
    websocket_1.default.sendNewGroupUpdate(groupChat);
    await GroupsChat_model_1.GroupsChat.getGroupChatWithMessagesData(groupChat, user.id);
    res.status(200).json({ groupChat });
});
exports.addUsersToGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    var _a, _b, _c, _d, _e, _f;
    const { id } = req.params;
    const user = req.user;
    const { usersIds } = req.body;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
    const isAdmin = isUserGroupAdmin(user, groupChat === null || groupChat === void 0 ? void 0 : groupChat.userGroupsChats);
    if (!isAdmin)
        return next(new ApiError_1.default("you are not group admin", 400));
    const filterdUserIds = usersIds.filter((userId) => !groupChat.userGroupsChats.find((group) => group.user.id === userId));
    const users = await User_model_1.User.find({
        where: {
            id: (0, typeorm_1.In)(filterdUserIds),
        },
    });
    const usersFcm = [];
    const usersGroupChat = users.map((user) => {
        if (user.fcm) {
            usersFcm.push(user.fcm);
        }
        return GroupsChatUsers_model_1.GroupsChatUsers.create({
            user,
            groupChat,
            role: GroupsChatValidator_1.GroupChatRoles.Member,
        });
    });
    await GroupsChatUsers_model_1.GroupsChatUsers.save(usersGroupChat);
    const groupChatUsers = await User_model_1.User.find({
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
    websocket_1.default.sendNewGroupUpdate(groupChat);
    const body = req.t("user_added_to_group_chat", {
        username: user.username,
        groupChatName: groupChat.name,
    });
    await (0, sendNotification_1.sendAndCreateNotification)({
        title: req.t("add_to_group_chat"),
        body,
        users,
        group: groupChat,
        data: {
            groupChat: (_a = groupChat.name) !== null && _a !== void 0 ? _a : "",
            groupChatId: (_b = groupChat.id) !== null && _b !== void 0 ? _b : "",
            groupChatImageUrl: (_c = groupChat.fullImageUrl) !== null && _c !== void 0 ? _c : "",
            fromUser: (_d = user.username) !== null && _d !== void 0 ? _d : "",
            fromUserId: (_e = user.id) !== null && _e !== void 0 ? _e : "",
            fromUserImageUrl: (_f = user.fullImageUrl) !== null && _f !== void 0 ? _f : "",
        },
        fcmTokens: usersFcm,
        type: Notification_model_1.NotificationType.UserAddedTOGroupChat,
    });
    res.status(200).json({ users: groupChatUsers });
});
exports.removeUsersfromGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { usersIds } = req.body;
    const user = req.user;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
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
    websocket_1.default.sendNewGroupUpdate(groupChat);
    res.status(200).json({ message: "removed users to groupchat succes" });
});
exports.leaveGroupChat = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
    const deletedRows = await GroupsChatUsers_model_1.GroupsChatUsers.find({
        where: {
            groupChat: { id },
            user: { id: user.id },
        },
    });
    await GroupsChatUsers_model_1.GroupsChatUsers.remove(deletedRows);
    websocket_1.default.sendNewGroupUpdate(groupChat);
    res.status(200).json({ message: "user leaved groupchat succes" });
});
const isUserGroupAdmin = (user, userGroupsChat) => {
    const userGroupChat = userGroupsChat.find((chat) => { var _a; return ((_a = chat.user) === null || _a === void 0 ? void 0 : _a.id) === user.id; });
    return (userGroupChat === null || userGroupChat === void 0 ? void 0 : userGroupChat.role) === GroupsChatValidator_1.GroupChatRoles.Admin;
};
exports.newGroupChatMessage = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const user = req.user;
    const { message, file, image, record } = req.body;
    const groupChat = await GroupsChat_model_1.GroupsChat.getUserGroupChatById(user.id, id);
    if (!groupChat) {
        return next(new ApiError_1.default(req.t("group_chat_not_found"), 400));
    }
    const newMessage = await (0, exports.addNewMessage)({
        message,
        groupChatId: id,
        user,
        fileUrl: file,
        imageUrl: image,
        recordUrl: record,
        translate: req.t,
    });
    res.status(201).json({ message: "messages added successfuly", newMessage });
});
const addNewMessage = async ({ message, groupChatId, user, fileUrl, imageUrl, recordUrl, sharedGroup, translate, }) => {
    const groupChat = await checkGroupChatExist(groupChatId, user.id, translate);
    const isLink = (0, extractLing_1.containsLink)(message);
    const newMessage = GroupsChatMessages_model_1.GroupsChatMessages.create({
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
exports.addNewMessage = addNewMessage;
const sendNewMessageByNotification = async ({ message, groupChat, users, translate, }) => {
    var _a, _b, _c, _d;
    const body = translate("new_groupcaht_message");
    await (0, sendNotification_1.sendAndCreateNotification)({
        title: translate("new_groupcaht_message"),
        body,
        users: users,
        // fromUser: user,
        group: groupChat,
        data: {
            groupChat: (_a = groupChat.name) !== null && _a !== void 0 ? _a : "",
            groupChatId: (_b = groupChat.id) !== null && _b !== void 0 ? _b : "",
            groupChatImageUrl: (_c = groupChat.fullImageUrl) !== null && _c !== void 0 ? _c : "",
            message: (_d = message.message) !== null && _d !== void 0 ? _d : "",
            // fromUser: user,
        },
        fcmTokens: users.map((u) => u.fcm),
        type: Notification_model_1.NotificationType.NewGroupChatMessage,
        createNotification: false,
    });
};
exports.sendNewMessageByNotification = sendNewMessageByNotification;
const readMessages = async ({ messagesIds, userId, chatId, }) => {
    const updateMessages = await GroupsChatMessages_model_1.GroupsChatMessages.update({
        id: (0, typeorm_1.In)(messagesIds),
        group: {
            id: chatId,
            userGroupsChats: {
                user: {
                    id: (0, typeorm_1.In)([userId]),
                },
            },
        },
    }, {
        readbyIds: () => `
      CASE
        WHEN readbyIds IS NULL OR readbyIds = '' THEN '${userId}'
        WHEN FIND_IN_SET('${userId}', readbyIds) = 0 THEN CONCAT(readbyIds, ',', '${userId}')
        ELSE readbyIds
      END
    `,
    });
};
exports.readMessages = readMessages;
const checkGroupChatExist = async (groupChatId, userId, translate) => {
    const groupChat = await GroupsChat_model_1.GroupsChat.findOne({
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
        throw new ApiError_1.default(translate("group_chat_not_found"), 400);
    }
    return groupChat;
};
const getUserRooms = async (roomsIds, userId) => {
    return await GroupsChat_model_1.GroupsChat.find({
        where: {
            id: (0, typeorm_1.In)(roomsIds),
            userGroupsChats: {
                user: {
                    id: userId,
                },
            },
        },
    });
};
exports.getUserRooms = getUserRooms;
//# sourceMappingURL=GroupsChat.controller.js.map