var MongoClient = require('mongodb').MongoClient;
const getDbConnection = require('./get-db-connection');

module.exports = function saveUser(user, callback) {
	getDbConnection(function(err, db) {
		if (err) {
			return callback(err);
		}
		
		db.collection('users').insert(user, function(error) {
			db.close();
			callback(error);
		});
	});
}