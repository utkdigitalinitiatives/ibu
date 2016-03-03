'use strict';
let mongoose = require('mongoose');

let config = {
  'db': 'fileList',
  'host': 'localhost',
  'port': 27017
};

const dbUri = 'mongodb://localhost:27017/ibu';

mongoose.connect(dbUri);

mongoose.connection.on('connected', function () {
});
mongoose.connection.on('error',function (err) {
  console.err(err.stack);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

exports.mongoose = mongoose;
