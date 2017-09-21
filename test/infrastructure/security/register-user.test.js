var sinon = require('sinon');
var expect = require('chai').expect;

var registerUserFactory = require('../../../src/infrastructure/security/register-user');

describe('register user', function() {
	var registerUser;
	var saveUser;

	beforeEach(function() {
		saveUser = sinon.stub();
		registerUser = registerUserFactory(saveUser);
	});

	it('should save the user', function(done) {
		var newUser = { email: 'jack@mabaso.co.za', password: 'P@ssword' };
		registerUser(newUser, function() {
			expect(saveUser.called).to.be.true;
			done();
		});

		saveUser.yields();
	});

	it('should add a hashed password', function(done) {
		var newUser = { email: 'jack@mabaso.co.za', password: 'P@ssword' };
		registerUser(newUser, function() {
			var savedUser = saveUser.getCall(0).args[0];
			expect(savedUser.hashPassword).to.exist;
			done();
		});

		saveUser.yields();
	});

	it('should throw an error if password is not provided', function(done) {
		var newUser = { email: 'jack@mabaso.co.za' };
		saveUser.yields();

		registerUser(newUser, function(error) {
			expect(error.message).to.equal('Password required');
			done();
		});

	});

	it('should return error from save user function', function(done) {
		saveUser.yields(new Error('Something has gone wrong'));
		
		registerUser({ email: 'jack@mabaso.co.za', password: 'P@ssword' }, function(error) {
			expect(error.message).to.equal('Something has gone wrong');
			done();
		});
		
	});
});