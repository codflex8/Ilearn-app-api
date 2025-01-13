"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trackUserActivity = void 0;
const UsersActivities_model_1 = require("../models/UsersActivities.model");
const AuthValidator_1 = require("./validators/AuthValidator");
const trackUserActivity = async (user) => {
    try {
        const userId = user === null || user === void 0 ? void 0 : user.id;
        if ((user === null || user === void 0 ? void 0 : user.role.toString()) !== AuthValidator_1.UsersRoles.user.toString()) {
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // const usersActivitiesRepository = dataSource.getRepository(UsersActivities);
        let activity = await UsersActivities_model_1.UsersActivities.findOne({
            where: { date: today },
        });
        if (activity) {
            if (!activity.usersIds.includes(userId)) {
                activity.usersIds.push(userId);
                activity.count += 1;
                await activity.save();
            }
        }
        else {
            activity = UsersActivities_model_1.UsersActivities.create({
                date: today,
                count: 1,
                usersIds: [userId],
            });
            // new UsersActivities();
            // activity.date = today;
            // activity.count = 1;
            // activity.usersIds = [userId];
            await activity.save();
        }
    }
    catch (error) {
        console.error("Error tracking user activity:", error);
    }
};
exports.trackUserActivity = trackUserActivity;
//# sourceMappingURL=trackUsersActivity.js.map