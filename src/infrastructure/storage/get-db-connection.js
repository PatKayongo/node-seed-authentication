const MongoClient = require('mongodb').MongoClient;

module.exports = function getDbConnection(callback) {
	MongoClient.connect(process.env.DB_URL, callback)
}