let jwt = require('jwt-simple');
let constants = require('../lib/constants');
let moment = require('moment');


exports.generateToken = function(account) {

	//console.log("generateToken: " + account._id + ", " + person._id)

	//expire after x number of days, but convert the value to milliseconds using .valueOf()
	let expires = moment().add(constants.JWT_TOKEN_EXPIRATION_DAYS, 'days').valueOf() //Unix Offset (milliseconds)

	let token = jwt.encode({
	      iss: account.user_name + "|" + account._id,
	      exp: expires
	    }, 
	    constants.JWT_TOKEN_SECRET
	);

	let auth_response = {
		//access_key: account._id,
	    access_token : token,
	    expires_in: expires
	};

	return auth_response

}

//this is middleware that is used in the API method routes
exports.verifyToken = function(req, res, next) {

	//header or query string parameter
	let token = req.headers['x-access-token'] || req.query.access_token || undefined;

	//console.log("token: " + token)

	if (!token){
		return res.send(401, { status: 401, error: "Not Authorized", message: "x-access-token must be provided in the request header or access_token in the query string"});
	}
	else {

		try {


			let decoded = jwt.decode(token, constants.JWT_TOKEN_SECRET);

			if (decoded.exp <= Date.now()) {
				return res.send({ status: 401, error: "Not Authorized", message: "Access token has expired" });
			}

			let iss = decoded.iss.split('|');
			let user_name = iss[0];
			let account_id = iss[1];


			let issuer = { user_name: user_name, account_id: account_id };
			req.access_token_issuer = issuer;
			console.log("issuer: " + JSON.stringify(issuer));

			//return res.send({ status: 200, message: "Access token is valid" });

		}
		catch(err) {
			return res.send(500, { status: 500, message: "Error with access token", error: err });
		}


	}

	return next();

}


exports.getIssuer = function(token) {

	let decoded = jwt.decode(token, constants.JWT_TOKEN_SECRET);

	let iss = decoded.iss.split('|');
	let user_name = iss[0];
	let account_id = iss[1];

	// if (decoded.exp <= Date.now()) {
	// 	return res.send({ status: 401, error: "Not Authorized", message: "Access token has expired" });
	// }

	return { user_name: user_name, account_id: account_id, exp: decoded.exp };


}