'use strict';

var sinon = require('sinon');
var chai = require('chai');
chai.should();
chai.use(require("sinon-chai"));

var expect = chai.expect;

var registerUserFactory = require('../../../src/infrastructure/security/register-user');
var errorTypes = require('../../../src/common/error').errorTypes;

describe('register user', function() {
	let registerUser;
	const saveUser = sinon.stub();
	const findUserByEmail = sinon.stub();

	beforeEach(function() {
		findUserByEmail.yields();
		saveUser.yields();
		registerUser = registerUserFactory(saveUser, findUserByEmail);
	});

	afterEach(function() {
		saveUser.reset();
		findUserByEmail.reset();
	});

	it('should save the user', function(done) {
		var newUser = { email: 'jack@mabaso.co.za', password: 'P@ssword' };
		registerUser(newUser, function() {
			expect(saveUser.called).to.be.true;
			done();
		});
	});

	it('should add a hashed password', function(done) {
		var newUser = { email: 'jack@mabaso.co.za', password: 'P@ssword' };
		registerUser(newUser, function() {
			var savedUser = saveUser.getCall(0).args[0];
			expect(savedUser.hashPassword).to.exist;
			done();
		});
	});

	it('should throw an error if password is not provided', function(done) {
		var newUser = { email: 'jack@mabaso.co.za' };
		
		registerUser(newUser, function(error) {
			expect(error.message).to.equal('Email and password required');
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

	it('should check if a user exists', function(done) {
		registerUser({ email: 'jack@mabaso.co.za', password: 'P@ssword' }, function(error) {
			expect(findUserByEmail).to.have.been.calledWith('jack@mabaso.co.za');
			done();
		});
	});

	describe('when there is an existing user', function() {
		it('should return an invalid argument error', function(done) {
			findUserByEmail.yields(null, { email: 'jack@mabaso.co.za' });
			registerUser({ email: 'jack@mabaso.co.za', password: 'P@ssword' }, function(error) {
				expect(error).to.exist;
				expect(error.type).to.equal(errorTypes.invalidArgument);
				expect(error.message).to.equal('A user with the email address already exists');
				done();
			});
		});
	});
});