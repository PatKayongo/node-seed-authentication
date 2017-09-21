var addHashPasswordToUser = require('./add-hash-password-to-user');

module.exports = function registerUserFactory(saveUser) {
	return function registerUser(user, callback) {
		addHashPasswordToUser(user, function(err, hashedUser) {
			if (err) {
				return callback(err);
			}

			saveUser(hashedUser, callback);
		});
	}
}