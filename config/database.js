
let mongoose = require('mongoose');

let dbURI = 'mongodb://djohnsonkc:demo1234@ds133340.mlab.com:33340/identity';

let db = mongoose.connection;

//db.on('error', console.error.bind(console, 'connection error:'));
//db.once('open', function callback() {
//    // yay!
//    console.log("authenticated");

//});

db.on('connecting', function () {
    console.log('connecting to MongoDB...');
});

db.on('error', function (error) {
    console.error('Error in MongoDb connection: ' + error);
    mongoose.disconnect();
});
db.on('connected', function () {
    console.log('MongoDB connected!');
});
db.once('open', function () {
    console.log('MongoDB connection opened!');
});
db.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});
db.on('disconnected', function () {
    console.log('MongoDB disconnected!');
    mongoose.connect(dbURI, { server: { auto_reconnect: true } });
});

mongoose.connect(dbURI, { server: { auto_reconnect: true } });