import { Socket } from "socket.io";
import { GroupsChat } from "../models/GroupsChat.model";

export const groupsChatEvents = (socket: Socket) => {
  socket.on("join-room", async ({ roomId }: { roomId: string }, next) => {
    const user = socket.user;
    const groupChat = await GroupsChat.findOne({
      where: {
        id: roomId,
        userGroupsChats: {
          user: {
            id: user.id,
          },
        },
      },
    });
    if (!groupChat) {
      next(new Error("there is not groupchat with this roomId"));
    }
    socket.join(roomId);
  });

  socket.on("new-message", async (data, next) => {});
};
