import { Server } from "socket.io";
import Router     from '#app/router/ws/index'

const connection = { io: {} }

class WsServer {
    static init(instance) {
        /**
         * attach websocket server to node http server
         * -------------------------------------------------
         * @param {NodeJS.Server}
         * @return {WsServer.instance}
         */
        const io = new Server(instance, {
            cors: {
                origin: "*",
            },
        });
        
        /**
         * Attach router to this socket server 
         * ------------------------------------------------
         * listen and dispatch all io events to coresponding controllers
         * 
         */
        Router.listen(io);
        connection.io = io
    }
}

export default WsServer;

// export const socket = connection;


