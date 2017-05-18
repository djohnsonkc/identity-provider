//http://stackoverflow.com/questions/8595509/how-do-you-share-constants-in-nodejs-modules

//usage example
//var constants = require('./lib/constants');
//console.log(constants.MY_CONSTANT); // 'some value'


module.exports = Object.freeze({
    JWT_TOKEN_SECRET: 'my-secret-key-goes-here',
    JWT_TOKEN_EXPIRATION_DAYS: 7
});


