var bcrypt = require('bcrypt');

module.exports = function addHashPasswordToUser(user, callback) {
	if (!user.password) {
		return callback(new Error('Password required'));
	}
	
	bcrypt.hash(user.password, 10, function(err, hash) {
		var updatedUser = Object.assign({ hashPassword: hash }, user);
		delete updatedUser.password;
		return callback(null, updatedUser);
	});
}