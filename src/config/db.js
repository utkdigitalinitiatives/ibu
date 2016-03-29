'use strict';
const mongoose = require('mongoose');
// mongoose.Promise = require('bluebird');
const Promise = require('bluebird');
Promise.promisifyAll(require('mongoose'));

const config = {
  db: 'fileList',
  host: 'localhost',
  port: 27017
};

const dbUri = 'mongodb://localhost:27017/ibu';

mongoose.connect(dbUri);

mongoose.connection.on('connected', () => {
  // console.log('Connected to DB,,, Now what?');
});

mongoose.connection.on('error', (err) => {
  // console.log('Stack error in db: ', err);
});

mongoose.connection.on('disconnected', () => {
  // console.log('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
  mongoose.connection.close(() => {
    console.log('Mongoose default connection disconnected through app termination');
    process.exit(0);
  });
});

exports.mongoose = mongoose;
