var expect = require('chai').expect;
var bcrypt = require('bcrypt');

var addHashPasswordToUser = require('../../../src/infrastructure/security/add-hash-password-to-user');

describe('add hash password to user', function() {
	it('should create a new object', function(done) {
		var user = {
			password: 'P@ssword'
		};

		addHashPasswordToUser(user, function(error, userWithHash) {
			expect(userWithHash).to.not.equal(user);
			done();
		});
	});

	it('should add a hashed password to the user', function(done) {
		var user = {
			password: 'P@ssword'
		};

		addHashPasswordToUser(user, function(error, userWithHash) {
			bcrypt.compare('P@ssword', userWithHash.hashPassword, function(err, res) {
				expect(res).to.be.true;
				done();
			});			
		});
	});

	it('should delete the original password', function(done) {
		var user = {
			password: 'P@ssword'
		};

		addHashPasswordToUser(user, function(error, userWithHash) {
			expect(userWithHash.password).to.not.exist;
			done();
		});
	});

	it('should throw an error if there is no password', function(done){
		addHashPasswordToUser({}, function(error, userWithHash) {
			expect(error.message).to.equal('Password required');
			done();
		});
	});
});