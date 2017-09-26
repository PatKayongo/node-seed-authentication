var errorTypes = require('../../common/error').errorTypes;

const mapping = {};
mapping[errorTypes.invalidArgument] = '400';

module.exports = mapping;