'use strict';
/**
 * [schema defines validation schemas for Mongo documents being inserted into db:ibu collection:ibuerrors]
 *
 *
 */
 // Mongoose connection to MongoDB
const mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ibuErrorSchema = new Schema({
  filename: {
    type: String,
    trim: true,
    unique: true
  },
  filePathXML: {
    type: String,
    unique: true
  },
  filePathIMG: {
    type: String,
    unique: true
  },
  digitalcollection: {
    type: String
  },
  IMGerrors: {
    type: Array
  },
  XMLerrors: {
    type: Array
  },
  created: {
    type: Date , default: Date.now
  }
});
//,
// validate: {
//   validator: function(v){
//     return /^[^.]+$/.test(v);

var ibuErrorDoc = mongoose.model('ibuErrorDoc', ibuErrorSchema);
// exports.default = new ibuErrorDoc();
module.exports = ibuErrorDoc;

// Some test's to show schema validator working
//testobj.filename = 'testdoc.xml';
//
//testobj.save(function(err){
//  console.log(err.errors.filename);
//});
//
//console.log(testobj);
