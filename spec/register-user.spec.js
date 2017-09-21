const expect = require('chai').expect;
const chai = require('chai')
const chaiHttp = require('chai-http');
const app = require('../src/infrastructure/rest-api/server');

const getDb = require('../src/infrastructure/storage/get-db-connection');
const getUserByEmail = require('../src/infrastructure/storage/user').getUserByEmail;
const dropDb = require('./utilities/drop-db');

chai.use(chaiHttp);

describe('when registering a new user', () => {
	beforeEach(function(done) {
		getDb(function(err, db) {
			dropDb(db, done);
		});
	});

	it('should save user details in the database', function(done) {
		chai.request(app)
			.post('/user')
			.send({ email: 'email@example.com', password: 'P@ssword1' })
			.end(function(err, res) {
				expect(res).to.have.status(200);
				getUserByEmail('email@example.com', function(findErr, user) {
					expect(findErr).to.not.exist;
					expect(user).to.exist;
					expect(user.email).to.equal('email@example.com');
					expect(user.hashPassword).to.exist;
					done(); 
				});
			});
	});
});