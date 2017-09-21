
const express = require('express');
const router = express.Router();

const saveUser = require('../storage/save-user');
const registerUser = require('../security/register-user')(saveUser);

router.post('/', function(req, res) {
	registerUser(req.body, function(err) {
		res.sendStatus(200).send();
	});
});

module.exports = router;