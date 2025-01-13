import { UsersActivities } from "../models/UsersActivities.model";
import { dataSource } from "../models/dataSource";
import { UsersRoles } from "./validators/AuthValidator";
import { User } from "../models/User.model";

export const trackUserActivity = async (user: User) => {
  try {
    const userId = user?.id;
    if (user?.role.toString() !== UsersRoles.user.toString()) {
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // const usersActivitiesRepository = dataSource.getRepository(UsersActivities);

    let activity: UsersActivities | null = await UsersActivities.findOne({
      where: { date: today },
    });

    if (activity) {
      if (!activity.usersIds.includes(userId)) {
        activity.usersIds.push(userId);
        activity.count += 1;
        await activity.save();
      }
    } else {
      activity = UsersActivities.create({
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
  } catch (error) {
    console.error("Error tracking user activity:", error);
  }
};
