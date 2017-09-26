
const express = require('express');
const router = express.Router();

const errorStatusCodeMapping = require('./error-status-code-mapping');
const saveUser = require('../storage/save-user');
const findUserByEmail = require('../storage/user').findUserByEmail;
const registerUser = require('../security/register-user')(saveUser, findUserByEmail);

router.post('/', function(req, res) {
	registerUser(req.body, function(err) {
		if (err) {
			let statusCode = 500;
			let message = 'Something went wrong';
			if (err.type) {
				statusCode = errorStatusCodeMapping[err.type];
				message = err.message;
			}
			
			return res.status(statusCode).json({ message: message}).send();
		}
		res.sendStatus(200).send();
	});
});

module.exports = router;