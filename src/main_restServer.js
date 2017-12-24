var express = require('express');
var mongoose = require('mongoose'); // mongoose is ODM (Object Data Mapper) nodeJS module for mongodb
var bodyParser = require('body-parser'); // bodyParser used to serialize incoming request body to objects. This puts incoming JSON, x-www-form-urlencoded, ... inputs to request.body
var cors = require('cors'); // NOTE ilker, cors is to allow cross origin requests

var teacherRestRouter = require('./rest/route/teacherRestRouter');
var teacherModel = require('./rest/model/teacherModel');
var teacherMongodbCollection = mongoose.connect("mongodb://localhost:27017/teachers");


// NOTE ilker set CORS variables 
var corsWhiteListDomains = ['http://localhost:4200']; // let an angular app running running on default port 4200 come through
var corsOptionsDelegate = function(req, callback) {
    var corsOptions;
    if (corsWhiteListDomains.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true }; // ALLOW - enable the requested origin in CORS response for this request
    } else {
        corsOptions = { origin: true }; // STOP - disable CORS for this request.
    }
    callback(null, corsOptions); // NOTE 1st arg is error, 2nd options
};

var app = express();
app.use(cors()); // NOTE ilker allow cross origin requests coming from any domain
app.use(cors(corsOptionsDelegate)); // NOTE ilker allow cross origin requests coming from domains in corsWhiteListDomains
// app.use('/students', studentRestRouter); // NOTE ilker important - make sure body-parser is specified before router. Otherwise you get undefined request.body in router
app.use(bodyParser.urlencoded({ extended: true })); // NOTE ilker to parse application/x-www-form-urlencoded, coming from form POSTs
app.use(bodyParser.json()); // NOTE ilker to parse application/json coming from REST clients
app.use('/teachers', teacherRestRouter);
app.use('/api/v1/teachers', teacherRestRouter);

var portNumber = 8016;
app.listen(portNumber, function() {
    console.log("REST server running on port %s", portNumber);
});