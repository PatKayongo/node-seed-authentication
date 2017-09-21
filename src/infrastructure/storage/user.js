const getDbConnection = require('./get-db-connection');
const collectionName = 'users';

module.exports.getUserByEmail = function getUserByEmail(email, callback) {
	getDbConnection(function(err, db) {
		if (err) {
			return callback(err);
		}

		db.collection(collectionName).findOne({ email: email }, function(findErr, document) {
			db.close();
			callback(findErr, document);
		});
	});
}