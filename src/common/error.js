module.exports.errorTypes = {
	invalidArgument: 'INVALID_ARGUMENT'
};

var ApplicationError = function(type, message) {
	this.type = type;
	this.message = message;
	this.stack = (new Error()).stack;
}

ApplicationError.prototype = new Error;

module.exports.ApplicationError = ApplicationError;