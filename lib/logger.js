
import fs from 'node:fs';

import { server as serverConfig, app as appConfig }  from '#config/index';
import { getPath } from '#lib/utils';

const LogDir = getPath(serverConfig.logDir);

const getCurentTimestamp = () => (new Date(Date.now())).toUTCString();
const logfileName        = (type = 'log') => LogDir + '/' + (new Date().toISOString().slice(0,10)) + `-${type}.log`;

class LogWriter {
	static write(type, log, data = false, fileName = false, sync = false){
		if (Log.isDebug) {
			return console.log(`${type} - ` + log +  (data ? ' | ' + JSON.stringify(data, null, 4) : ''));
			// return console.log(`[${type}] ` + log);
		}
		
		if (data) log += ' | ' + JSON.stringify(data);
			
		log = getCurentTimestamp() + ` [${type}] ` + log + '\n';
		
		if (sync) {
			return fs.appendFileSync(logfileName(fileName ? fileName : type), log);
		}

		fs.appendFile(logfileName(fileName ? fileName : type), log, () => {});
	}
}


class Log {
	static isDebug  =  appConfig.debug || false;

	static init(){
		if (!fs.existsSync(LogDir)) {
			fs.mkdirSync(LogDir);
		}
	}
	
	static request(request, log, { type = 'info', sync = false, details = false } = {}) {
		let fullLog  = '';
		if (type    == 'error') {
			fullLog += 'Error processing request '
		}

		if (type    == 'warn') {
			fullLog += 'Warning during request '
		}

		if (type    == 'info') {
			fullLog += `Processing request `
		}

		if (type    == 'success') {
			fullLog += 'Request processed '
		}

		fullLog += `- [${request.identifier}] ${details ? `[${request.method}:${request.originalUrl}, ${request.headers['user-agent']}] ` : ''}`
		fullLog += log;

		return LogWriter.write(type, fullLog, false, 'request', sync);
    }

	static log(log, { data= false, type = 'log', sync = false, details = false } = {}) {
		return LogWriter.write(type, log);
    }

    static debug(log, { type = 'info', sync = false, details = false, data = false } = {}) {
		if (!Log.isDebug) return;

		console.log(`debug - ` + log +  (data ? ' | ' + JSON.stringify(data, null, 4) : ''));
    }

    static warn(log, { data= false, type = 'info', sync = false, details = false } = {}) {
		return LogWriter.write('warn', log, data, false, sync);
    }

    static error(log, { data= false, type = 'info', sync = false, details = false } = {}) {
		return LogWriter.write('error', log, data, false, sync);
    }

    static info(log, { data= false, type = 'info', sync = false, details = false } = {}) {
		return LogWriter.write('info', log, data,  false, sync);
    }
}


export default Log
