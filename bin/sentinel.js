#!/usr/bin/env node

/**
 * Module dependencies.
 */
// import cluster    from 'node:cluster'
// import schedule    from 'node-schedule';
import Log         from '#lib/logger';
import config      from '#config/index';
import telescope   from '#app/utils/telescope';
import cluster     from '#bin/cluster';

/**
 * initialize instances
 */
Log.init()


/**
 * Do stuff before stopping the process
 * @param {NodeJS.SignalsListener} signal
 */
function signalHandler(signal) {
    Log.info(`Stopping the ${cluster.isPrimary ? 'master' : 'worker'} process [${process.pid}] 🙁`, { sync:true });
    if (!cluster.isPrimary) telescope.printMetadata();
    // schedule.gracefulShutdown().then(() => process.exit(0))
    process.exit(0);
}

process.on('SIGINT',  signalHandler)
process.on('SIGTERM', signalHandler)
process.on('SIGQUIT', signalHandler)
process.on('SHUTDOWNSIGN', ()=> {
    if (!cluster.isPrimary) telescope.printMetadata();
    Log.info(`Shutting down the ${cluster.isPrimary ? 'master' : 'worker'} process [${process.pid}]`, { sync:true });
});


/**
 * Zero-downtime Restarts
 * use this command to reboot worker process without affecting the master process 
 * 
 * $ kill -SIGUSR2 PID
 * $ kill -SIGUSR2 7042
*/
process.on('SIGUSR2', () => { 
    cluster.reboot();
});


/**
 * Boot Cluster | start master and worker process
 */
process.nextTick(() => cluster.boot({ workers : config.server.maxClusterWorkers }))