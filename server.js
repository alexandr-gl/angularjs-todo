var express = require('express');
var app = express();
var index = require('./routes/index');
var tasks = require('./routes/tasks');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');


app.use(express.static("app")); // myApp will be the same folder name.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.get('/', function (req, res, next) {
res.redirect('/');
});
// app.use('/', index);
app.use('/tasks', tasks);
console.log('MyProject Server is Listening on port 3000');

var db = mongoose.connect('mongodb://localhost:27017/todo', {
    // useMongoClient: true
    useNewUrlParser: true
});
console.log('DB', db);
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//     console.log('Running DB');
// });

module.exports = app;