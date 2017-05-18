

let express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jwt_security = require('./lib/jwt-security'),
    db = require('./config/database'),
    accounts = require('./routes/accounts'),
    port = process.env.PORT || 3001; // Use the port that Heroku provides or default to 3000 locally


// this allows req.body to be parsed by our API
app.use(bodyParser.urlencoded({ extended: false }))
// this instructs our API to support application/json as the content type
app.use(bodyParser.json())


// provide these response headers to clients to solve the CORS issue 
// I added some custom ones: x-access-token (for JWT-secured resources) and user-local-time (for any logging)
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, user-local-time, Cache-Control, Pragma, Expires");  
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  next();
});

app.get("/", (req, res) => {
  res.status(200).send({ 
    message: "Welcome!", 
    details: " This is a simple JWT-based identity provider solution using Node, Express, and MongoDB.", 
    tags: ["RESTful API", "Node", "express", "mongoose", "body-parser", "jwt-simple"]
  })
});

//**************************************************************************************
//* REST API endpoints
//**************************************************************************************
app.post('/api/v1/accounts/register', accounts.register);
app.post('/api/v1/accounts/login', accounts.login);
app.get('/api/v1/accounts', jwt_security.verifyToken, accounts.getAll);
app.get('/api/v1/accounts/:id', jwt_security.verifyToken, accounts.getById);
app.put('/api/v1/accounts/:id', jwt_security.verifyToken, accounts.update);
app.delete('/api/v1/accounts/:id', jwt_security.verifyToken, accounts.delete);



//**************************************************************************************
//* Start our app
//**************************************************************************************
app.listen(port, function () {
    console.log("Express server listening on port " + port);
});



