
let Account = require('../models/account');
let utils = require('../lib/utils');
let constants = require('../lib/constants');
let jwt_security = require('../lib/jwt-security');

/* Postman tests

Register:

{
    "email": "djohnsonkc@gmail.com"
    "password": "1234",
    "first_name": "Dywayne",
    "last_name": "Johnson"
    
}

Login:

{
    "email": "djohnsonkc@gmail.com"
    "password": "1234"
}


Update:

{
    "email": "djohnsonkc@gmail.com"
    "password": "2345",
    "first_name": "Dywayne 'Not The Rock'",
    "last_name": "Johnson"
}



*/


exports.register = function (req, res) {

    console.log('Register: ' + JSON.stringify(req.body));

    Account.findOne({ email: req.body.email }, function (err, data) {

        //console.log("data: " + JSON.stringify(data))
        if (err) {
            res.json(500, { status: 500, message: "Error", error: err });
        }
        else if (data != null ) {
            // The HTTP status code for this scenario is very subjective: Draw your own conclusion
            // According to RFC 7231, a 303 See Other MAY be used If the result of processing a POST would be equivalent to a representation of an existing resource.
            res.send(303, { status: 303, message: 'Email address already in use' });
        }
        else if (data == null) {

            let _now = new Date();

            let account_data = {
                email: req.body.email,
                password: utils.passwordHash(req.body.password),
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                created_at: _now,
                updated_at: _now
                
            };

            let account = new Account(account_data);
               
                account.save(function (err, data) {
                    if (err) {
                        res.send(500, { message: "Error", error: err } );
                    }
                    else {                     
                        
                        let token = jwt_security.generateToken(account)
                        res.send(200, { message: 'account created successfully', access_token: token.access_token, expires_in: token.expires_in });

                    }
                });

        }

    });
};

exports.login = function (req, res) {

    //console.log('Login: ' + JSON.stringify(req.body));

    Account.findOne({ email: req.body.email }, function (err, account) {
        if (err) {
            res.send(500, { message: "Error", error: err } );
        }
        else if (account == null) {
            //res.send(404, { status: 404, message: 'Not Found', details: 'account not found for user name' });
            //lets not reveal whether or not an account exists in our system for a specific user name
            res.send(401, { message: 'Unauthorized', details: 'invalid user name and/or password' });
        }
        else {
            if (account.password == utils.passwordHash(req.body.password)) {

                let token = jwt_security.generateToken(account)

                res.send(200, { message: 'login successful', access_token: token.access_token, expires_in: token.expires_in });
            }
            else {
                res.send(401, { message: 'Unauthorized', details: 'invalid user name and/or password' });
            }
        }
    });

};

//wouldn't normally expose this method, but allows us to try out the GET method
exports.getAll = function (req, res) {

    //get the documents using skip and offset (this doesn't allow for TOTAL count to be determined)
    Account.find(function (err, data) {
    })
    //.skip(offset)
    //.limit(count)
    //.select('_id email first_name last_name emails._id emails.address emails.primary')
    //.where('some_attribute').equals(req.params.some_value)
    .sort({last_name: 'asc', first_name: 'asc'})
    .exec(function (err, docs) {
        
        res.send(docs);

    });

};

//example request /v1/accounts/:id
exports.getByAccessToken = function (req, res) {


    // make sure and fetch by the token issuer account_id value
    Account.findById(req.access_token_issuer.account_id, function (err, account) {

        if (err) {
            res.send(500, { message: "Error", error: err } );
        }
        else if (account == null) {
            res.send(404, { message: 'not found' });
        }
        else {
            res.send(account);
        }
    });

};

//this isn't really used since exports.register is serving the same function
/*
exports.add = function (req, res) {
    let obj = req.body;
    console.log('Adding: ' + JSON.stringify(obj));
    //this is handled by exports.register
};
*/

exports.update = function (req, res) {

    //console.log("Updating: " + JSON.stringify(req.body));

    Account.findById(req.params.id, function (err, account) {
        if (err) {
            res.send(500, { message: "Error", error: err } );
        }
        else {

            let _now = new Date();

            //allow specific properties to be updated
            account.first_name = req.body.first_name;
            account.last_name = req.body.last_name;
            account.password = utils.passwordHash(req.body.password);
            account.updated_at = _now;

            //console.log("Updated Account: " + JSON.stringify(account));

            account.save(function (err, data) {
                if (err) {
                    res.send(500, { message: "Error", error: err } );
                }
                else {

                    res.send(200, { message: 'update successful' });

                }
            });
        }

    });

};

exports.delete = function (req, res) {

    //console.log('Deleting: ' + req.params.id);

    Account.remove({ _id: req.params.id }, function (err) {

        console.log('err: ' + err);

        if (err) {
            res.send(500, { message: "Error", error: err } );
        }
        else {
            res.send(200, { message: 'delete successful' });
        }
    });

};


