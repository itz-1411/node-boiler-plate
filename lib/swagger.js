/**
 * Module dependencies.
 */
const router = require('express').Router();
const fs = require('fs');
const path = require('path');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const _ = require('lodash');
const config = require('../config/appconfig');


/**
 * Get all file paths in api directory
 */
const pathes = [];
const directoryPath = path.join(__dirname, '../router/api');
const filesName = fs.readdirSync(directoryPath, (err, files) => {
	// handling error
	if (err) {
		return console.log(`Unable to scan directory: ${err}`);
	}
	// listing all files using forEach
	return files.forEach(file => pathes.push(file));
});
getFullPathes(filesName);



/**
 * Config for swagger
 */
const options = {
	swaggerDefinition: {
		info: {
			title: 'softwallet',
			version: '1.0.0',
			description: 'SoftWallet Cryptocurrency Wallet System, REST API with Swagger doc',
			contact: {
				email: 'kamleshswami01@gmail.com',
			},
		},
		tags: [
			{
				name: 'users',
				description: 'Users API',
			},
			{
				name: 'Auth',
				description: 'Authentication apis',
			},
			{
				name: 'Email',
				description: 'for testing and sending emails ',
			},
			{
				name: 'termsAndCondition',
				description: ' the terms and condition for the application',

			},
			{
				name: 'Versioning',
				description: ' operation related to check the version of the apis or the mobile .. etc ',

			},
		],
		schemes: ['http'],
		host: `localhost:${config.app.port}`,
		basePath: '/api/v1',
		securityDefinitions: {
			Bearer: {
				type: 'apiKey',
				description: 'JWT authorization of an API',
				name: 'Authorization',
				in: 'header',
			},
		},
	},

	apis: pathes,
};

/**
 * Setup swagger
 */
const swaggerSpec = swaggerJSDoc(options);
require('swagger-model-validator')(swaggerSpec);


/**
 * Router for swagger
 */
router.get('/json', (req, res) => {
	res.setHeader('Content-Type', 'application/json');
	res.send(swaggerSpec);
});
router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * Helper functions
 */
function validateModel(name, model) {
	const responseValidation = swaggerSpec.validateModel(name, model, false, true);
	if (!responseValidation.valid) {
		throw new Error('Model doesn\'t match Swagger contract');
	}
}

function getFullPathes(names) {
	names.forEach((name) => {
		let customePath;
		if (name !== 'index') {
			customePath = `./router/api/${name}`;
		}
		if (!(_.isUndefined(name))) {
			pathes.push(customePath);
		}
	});
}


/**
 * Export swagger router and helper functions
 */
module.exports = {
	router,
	validateModel,
};
