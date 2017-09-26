const expect = require('chai').expect;
const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../src/infrastructure/rest-api/server');

const getDb = require('../src/infrastructure/storage/get-db-connection');
const findUserByEmail = require('../src/infrastructure/storage/user').findUserByEmail;
const dropDb = require('./utilities/drop-db');

chai.use(chaiHttp);

describe('when registering a new user', () => {
	beforeEach(function(done) {
		getDb(function(err, db) {
			dropDb(db, done);
		});
	});

	function registerNewUser(userDetails, callback) {
		chai.request(app)
			.post('/user')
			.send(userDetails)
			.end(callback);
	};

	it('should save user details in the database', function(done) {
		registerNewUser({ email: 'email@example.com', password: 'P@ssword1' }, function(err, res) {
			expect(res).to.have.status(200);
			findUserByEmail('email@example.com', function(findErr, user) {
				expect(findErr).to.not.exist;
				expect(user).to.exist;
				expect(user.email).to.equal('email@example.com');
				expect(user.hashPassword).to.exist;
				done(); 
			});
		});
	});

	it('should return a 400 error if the user already exists', function(done) {
		var userDetails = { email: 'email@example.com', password: 'P@ssword1' };

		registerNewUser(userDetails, function() {
			registerNewUser(userDetails, function(err, res) {
				expect(res).to.have.status(400);
				expect(res.body.message).to.equal('A user with the email address already exists');
				done();
			});
		});
	});

	it('should return a 400 error if no password is not provided', function(done) {
		var userDetails = { email: 'email@example.com'};

		registerNewUser(userDetails, function(err, res) {
			expect(res).to.have.status(400);
			expect(res.body.message).to.equal('Email and password required');
			done();
		});
	});

	it('should return a 400 error if no email is not provided', function(done) {
		var userDetails = { password: 'P@ssword1'};

		registerNewUser(userDetails, function(err, res) {
			expect(res).to.have.status(400);
			expect(res.body.message).to.equal('Email and password required');
			done();
		});
	});
});