import Log   		      from '#lib/logger';
import { v4 as uuid }     from 'uuid';
import { timeConversion } from '#lib/utils';

// const skipUrls = [ '/api/v1/media', '/favicon.ico' ];
const skipUrls = [ '/api/v1/auth', '/api/v1/media', '/favicon.ico' ];
export const metadata = { request : {  total:0, success:0, error:0, critical:0, time:{ max:0, min:1 } }, time:{ boot : performance.now() }, id: uuid() }

export const printMetadata = () => {
	const instance  = { request:metadata.request, id : metadata.id };
	instance.uptime = timeConversion((performance.now() - metadata.time.boot));
	Log.info(`telescope stats [${process.pid}] `, { data : instance, sync:true });
}

export const identifyRequest = (req, _, next) => {
	for (const match of skipUrls) {
		if (req.originalUrl.includes(match)) {
			req.skipRequestLog = true;
			break;
		}
	}
	

	let ip = (req.headers['cf-connecting-ip'] || req.headers['x-real-ip'] || req.headers['x-forwarded-for'] || req.connection.remoteAddress || '' ).split(',')?.[0]?.trim();;

	// const ip = req.headers['x-real-ip'] || req.connection.remoteAddress;
	// console.log({ip}, req.ip);


	if(req.skipRequestLog !== true){
		req.identifier = uuid();
		req.arrivedAt  = performance.now();
		
		metadata.request.total++;
		Log.request(req, `a request has been made with the following data ${JSON.stringify(req.body)}`,  { details:true });
	}
	next();
}


export const routeNotFound = (req) => {
	if(req.skipRequestLog === true) return;

	Log.request(req, `the url you are trying to reach is not hosted on our server`, { type:'warn' })
	requestProcessed(req);
}


export const requestError = (err, req, { critical = true } = { }) => {
	if(req.skipRequestLog === true) return;
	
	if (!err.preventErrorLog) {
		metadata.request.critical++;
		Log.error(err.message, { data : err.stack });
	}
	
	metadata.request.error++;
	Log.request(req, err.message , { type:'error' });
	requestProcessed(req, { success : false });
}

export const requestProcessed = (req, { success = true } = {}) => {
	if(req.skipRequestLog === true) return;

	if (!req.completedAt) req.completedAt = performance.now();
	if (!req.timeTakenToComplete) req.timeTakenToComplete = req.completedAt - req.arrivedAt;

	if (metadata.request.time.max < req.timeTakenToComplete) metadata.request.time.max = req.timeTakenToComplete;
	if (metadata.request.time.min > req.timeTakenToComplete) metadata.request.time.min = req.timeTakenToComplete;

	if (success) {
		metadata.request.success++;
		Log.request(req, `request has been proccessed successfully in ${req.timeTakenToComplete}ms`, { type: 'success' });
	} else {
		Log.request(req, `request has been failed but proccessed in ${req.timeTakenToComplete}ms`, { type: 'success' });
	}
}

export default { printMetadata, identifyRequest, routeNotFound, requestError, requestProcessed }