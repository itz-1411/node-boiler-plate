#!/usr/bin/env node

/**
 * Module dependencies.
 */
import http      from 'node:http'
import Log       from '#lib/logger';
import app       from '#server/http';
import telescope from '#app/utils/telescope';
import schedule  from 'node-schedule'
import schedular from '#server/schedular';

const port      = Number(process.env.APP_PORT) || 3000;


/**
 * initialize logger instance
 * 
 */
Log.init()


/**
 * Do stuff and exit the process
 * @param {NodeJS.SignalsListener} signal
 */
async function signalHandler(signal) {
    Log.info(`Stopping the server 🙁 [${process.pid}] [signal:${signal}]`, { sync:true });
    telescope.printMetadata()
    await schedule.gracefulShutdown()
    process.exit()
}
process.on('SIGINT',  signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)
process.on('warning', e => console.warn(e.stack))
// process.on('unhandledRejection', (err, promise) => {
//     Log.error(`Unhandled promise rejection [${process.pid}] ${err.message}`, { data:err.stack });
//     // server.close(() => process.exit(1));
// })


/**
 * Create HTTP and WebSocket server
 * @param {Express.Application} app
 */
const server = http.createServer(app);

schedular.init()
// WsServer.init(server);



/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);



/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
    if (error.syscall !== "listen") {
        throw error;
    }

    //  handle specific listen errors with logs
    
    switch (error.code) {
        case "EACCES":
            Log.error(`Port ${port} requires elevated privileges`, { sync:true });
            process.exit(1);
            break;
        case "EADDRINUSE":
            Log.error(`Port ${port} is already in use`, { sync:true });
            process.exit(1);
            break;
        default:
            throw error;
    }
}



/**
 * Event listener for HTTP server "listening" event.
 */
function onListening() {
    // const addr = server.address();
    // const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    Log.info(`The Server [${process.pid}] started listening on port ${port} 🥳`);
}