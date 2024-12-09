import Log 	      from '#lib/logger';
import { toSnakeCase } from '#lib/utils'
import telescope  from '#app/utils/telescope';


export const throwIf = (fn, status, errorType, errorMessage) => {
	return result => (fn(result) ? throwError(status, errorType, errorMessage)() : result);
}


export const validateJoi = (err, status = 500, errorType = 'Validation Error', errorMessage = 'Validation error') => {
	if(!err)   return;

	let e        = new Error(errorMessage || 'Default Error');
	e.status     = status;
	e.errorType  = errorType;
	e.status     = 403;
	e.isJoiValidationError = true;
	e.preventErrorLog      = true;
	
	console.log(err.details)
	// e.errors     = err.details.map(( {context , message} ) => ({ [context.label] : message }) );
	const errorList = {};
	for (const key in err.details) {
		if (Object.hasOwnProperty.call(err.details, key)) {
			const { context, message } = err.details[key];
			errorList[context.label] = message;
		}
	}
	e.errors     = errorList;
	throw e;
}


export const throwError = (status, errorType, errorMessage, errors = false) => {
	return (e) => {
		if (!e) e   = new Error(errorMessage || 'Default Error');
		e.status    = status;
		e.errorType = errorType;
		e.message   = errorMessage;
		e.preventErrorLog = true;
		if(errors !== false) e.errors = errors;
		throw e;
	}
}

export const catchError = (res, error) => {
	if (!error) error = new Error('Default error');

	// Log.request(req, error.message, 'error');

	res.status(error.status || 500).json({ status : false, type: 'Error', message: error.message || 'Unhandled error', error });
}


export const sendSuccess = (req, res, message = '', status = 200) => {
	telescope.requestProcessed(req);
		
	return (data, globalData) => {
		const response  = { status : true,  ...globalData };

		if (!!message) response.message = message;
		if (!!data)    response.data    = data;
		
		res.status(status).json(response);
	};
}

export const sendFailure = (req, res, message = '', status = 400) => {
	telescope.requestProcessed(req, { success:false });

	return (data, globalData) => {
		let response  = { status : false,  ...globalData };

		if (!!message) response.message = message;
		if (!!data)    response.data    = data;

		res.status(status).json(response);
	};
}


export const sendError = async (req, res, error) => {
	telescope.requestError(error, req, { critical:false });
	
	// console.log(JSON.stringify(error, null, 4))
	await parseError(error)

	return res.status(error.status || 500).json({
		status : false, 
		type   : error.errorType || 'Error', 
		message: error.message || 'Unhandled Error', 
		errors : error.errors,
	});
}


const parseError = async (error) => {
	if (error.isJoiValidationError) {
		error.status    = 403;
		error.errorType = 'Validation failed';
		error.message   = 'failed to validate request';
	}
	else if(error.name == 'ValidationError') {
		const errorList = {};
		for (const currentErrorKey in error.errors){
			const currentError  = error.errors[currentErrorKey];
			// const errorField    = toSnakeCase(currentError.path);
			if(currentError.name == 'ValidatorError'){
				errorList[currentErrorKey] = currentError.message;
			} else if(currentError.name == 'CastError'){
				errorList[currentErrorKey] = `Expected ${currentError.kind} but received ${currentError.valueType}`;
			}
		}	
		error.status    = 403;
		error.errorType = 'Validation failed';
		error.message   = 'failed to validate request';
		error.errors    = errorList;
	}

	// console.log(error.errors)
	// error.errors = ;
	error.status  = 403;
}

export default { throwIf, validateJoi, throwError, catchError, sendSuccess, sendFailure, sendError };

