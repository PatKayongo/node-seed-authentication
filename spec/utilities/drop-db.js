const async = require('async');

module.exports = function(db, done) {
	if (!db) {
		return done();
	}

	db.dropDatabase(function(err) {
		done();
	});
}