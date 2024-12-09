/**
 * Module dependencies.
 */
import express         from 'express';
import bodyParser      from 'body-parser';
import compression     from 'compression';
import methodOverrider from 'method-override';
import cors            from 'cors';

import Log   		   from '#lib/logger';
import config          from '#config/index';
import {getPath}      from '#lib/utils';
import telescope       from '#app/utils/telescope';
import router 		   from '#app/router/index'
import { sendError }   from '#app/utils/request.handler'
// import swagger         from '#app/utils/swagger';
// import models 	      from '#app/model/index';
// import statusMonitor   from 'express-status-monitor';
// import MessageBroker   from '#app/service/messageBroker/index';

const app              = express();



/**
 * Set up database and redis connections
 * 
 */
await config.db.connect((error, status) => {
	if(!!error) {
		Log.error(`Error connecting to database [${process.pid}]`, { data:error, sync:true });
		process.exit();
	}

	if (status) Log.info(`process [${process.pid}] connected to the database`)
});


// await config.redis.connect((error, status) => {
// 	if(!!error) {
// 		Log.error(`Error connecting to redis server [${process.pid}]`, { data:error, sync:true });
// 		// process.exit();
// 	}

// 	if (status) Log.info(`process [${process.pid}] connected to the redis server`)
// });



/**
 * Attach configs to express app.
 */
// app.set('port', config.server.port);
// app.set('config', config); // The system configrations
// app.set('db', models); // attach models to express instance
// app.set('log', Log); // attach logger to express


// app.use(express.static(getPath('/storage/public/')));

// app.get('/*', (req, res) => {
// 	res.sendFile(getPath('/storage/public/html/index.html'));
// });


/**
 * Attach utility middlwares to express app.
 */
// bodyParser, parses the request body to be a readable json format
// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(cors());
app.use(cors({origin: true,optionsSuccessStatus: 200,credentials: true}));
app.options('*', cors({origin: true,optionsSuccessStatus: 200,credentials: true}));

app.use(bodyParser.json({ verify: function(req, res, buf) { req.rawBody = buf; } }));
// app.use(bodyParser.json());
app.use(methodOverrider());
app.use(compression());



/**
 * Attach api documentation routes.
 */
// app.use('/api/docs', swagger.router);


/**
 * Attach identifier to each request
 */
app.use(telescope.identifyRequest);


/**
 * Attach router to express app.
 */
app.use(router);


/**
 * Set fallback url for routes.
 */
app.use((req, res, _) => {
	telescope.routeNotFound(req);
	res.status(404).json({ status:false, type: 'Resource Not Found', message: 'the url you are trying to reach is not hosted on our server' });
});


/**
 * Log errors.
 */
app.use((err, req, res, _) => sendError(req, res, err));

// app.use((err, req, res, _) => {
// 	telescope.requestError(err, req);
//     res.status(err.status || 500).json({ status:false, type: 'error', message: err.message || 'Something went wrong' });
// });



/**
 * Export Express App.
 */
export default app;
