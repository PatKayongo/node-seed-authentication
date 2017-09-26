const async = require('async');
const addHashPasswordToUser = require('./add-hash-password-to-user');
const ApplicationError = require('../../common/error').ApplicationError;
const errorTypes = require('../../common/error').errorTypes;

module.exports = function registerUserFactory(saveUser, findUserByEmail) {
	return function registerUser(user, callback) {
		async.waterfall([
			function(cb) {
				cb(null, user);
			},
			validateUserDetails,
			verifyNoExistingUser,
			addHashPasswordToUser,
			saveUser
		], callback);
	}

	function verifyNoExistingUser(user, callback) {
		findUserByEmail(user.email, function(err, existingUser) {
			if (existingUser) {
				const errorMessage = 'A user with the email address already exists';
				return callback(new ApplicationError(errorTypes.invalidArgument, errorMessage));
			}
		
			callback(null, user);
		});	
	}

	function validateUserDetails(user, callback) {
		if (!user.password || !user.email) {
			return callback(new ApplicationError(errorTypes.invalidArgument, 'Email and password required'));
		}
	
		callback(null, user);
	}
}



