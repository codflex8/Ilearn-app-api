import { Server } from "socket.io";

const WEBSOCKET_CORS = {
  origin: "*",
  methods: ["GET", "POST"],
};

class Websocket extends Server {
  private static io: Websocket;

  constructor(httpServer) {
    super(httpServer, {
      cors: {
        origin: "*",
      },
    });
  }

  public static getInstance(httpServer?): Websocket {
    if (!this.io) {
      this.io = new Websocket(httpServer);
    }

    return this.io;
  }
}

export default Websocket;
