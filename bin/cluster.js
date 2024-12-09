import cluster from 'node:cluster'
import Log     from '#lib/logger';
import config  from '#config/index';


const port                = config.app.port || 3000;
let isWorkersRestarting   = false;
let activeWorkers         = {};


const getWorkers          = () => Object.values(activeWorkers);
const writeControlScripts = async (pid) => {
    const { default: storage } = await import('#lib/storage');

    storage.write('./bin/restart_workers.sh', `/bin/kill -SIGUSR2 ${pid}`);
    storage.write('./bin/kill_server.sh', `/bin/kill -SIGQUIT ${pid}`);
}


export const boot = ({workers = false, maxWorker = false} = {workers : 1, maxWorker : false}) => {
    cluster.isPrimary ? startMaster({workers, maxWorker}) : startWorker()
}


const startMaster    = async ({workers, maxWorker}) => {
    const { default: os } = await import('os');

    let totalWorkers = workers;

    if(maxWorker || !Boolean(totalWorkers)){
        totalWorkers = config.server.maxClusterWorkers || os.cpus().length;
    }

    isWorkersRestarting = false;     
    Log.info(`The Master [${process.pid}] is running 🥹`);

    /**
     * Fork child / Worker 
     */
    Log.info(`Starting ${totalWorkers} workers`);
    for (let i = 0; i < totalWorkers; i++) cluster.fork();
    
    /**
     * Listen child cluster exit event and
     * Fork another child cluster if one goes down
     */
    cluster.on("exit", (worker, code, signal) => {
        if(isWorkersRestarting) return;

        Log.error(`Ohh no😭. Worker ${worker.process.pid} died | [${code}][${signal}]`);
        Log.info(`Let's fork another worker! 😤`);

        // cluster.fork();
    });

    activeWorkers = {... cluster.workers};
    writeControlScripts(process.pid);
}


/**
 * init Cluster Child | Attach express app to server |
 */
const startWorker = async () => {
    const { default: http } = await import('node:http');
    const { default: App }  = await import('#server/http');

    /**
     * Create HTTP server
     * @param {Express.Application} app
     */
    const server = http.createServer(App);

    /**
     * Listen on provided port, on all network interfaces.
     */
    server.listen(port);
    server.on('error', onError);
    server.on('listening', onListening);
}


/**
 * Restart all workers without stopping the master
 */
const reboot = (workerIndex = 0) => {
    const currentWorker = workerIndex + 1
    const worker        = getWorkers()[workerIndex];

    if (!worker){
        activeWorkers       = {... cluster.workers};
        isWorkersRestarting = false;
        return Log.info(`All workers restarted successfully 😀`);
    }

    const workerDisconnected = () => {
        if (!worker.exitedAfterDisconnect) return;

        Log.info(`Worker ${currentWorker} [${worker.process.pid}] disconnected`);
        Log.info(`Let's fork another worker! 😉`);
        
        cluster.fork().on("listening", () => {
            Log.info(`Worker ${currentWorker} restarted`);

            setTimeout(() => reboot(workerIndex + 1), 1000);
        });
    };

    worker.on("exit",       workerDisconnected);
    worker.on('disconnect', workerDisconnected);

    isWorkersRestarting = true;
    Log.info(`Restarting worker ${currentWorker}! 🧐`);
    worker.disconnect();
};




/**
 * Event listener for HTTP server "error" event.
 */
const onError = (error) => {
    if (error.syscall !== "listen") throw error;
    
    switch (error.code) {
        case "EACCES":
            Log.error(`Port ${port} requires elevated privileges`, { sync:true });
            // process.exit(1);
            break;
        case "EADDRINUSE":
            Log.error(`Port ${port} is already in use`, { sync:true });
            // process.exit(1);
            break;
        default:
            throw error;
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

const onListening = () => {
    // const addr = server.address();
    Log.info(`Worker [${process.pid}] started listening on port ${port} 🥳`);
}


export default { boot, reboot, isPrimary:cluster.isPrimary }