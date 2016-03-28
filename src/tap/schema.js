'use strict';
/**
 * [schema defines validation schemas for Mongo
 * documents being inserted into db:ibu collection:ibuerrors]
 *
 */
 // Mongoose connection to MongoDB
const mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ibuErrorSchema = new Schema({
  filename: {
    type: String,
    trim: true,
    unique: true,
  },
  filePathXML: {
    type: String,
    trim: true,
  },
  filePathIMG: {
    type: String,
    trim: true,
  },
  digitalcollection: {
    type: String,
    trim: true,
  },
  expectedNumObjects: {
    type: String,
    trim: true,
  },
  IMGerrors: {
    type: Array,
  },
  XMLerrors: {
    type: Array,
  },
  postErrorProcessing: {
    type: String,
  },
  indexed: {
    type: String,
    trim: true,
  },
  created: {
    type: Date, default: Date.now,
  },
});
/*,
* validate: {
*   validator: function(v){
*     return /^[^.]+$/.test(v);
*/

let ibuErrorDoc = mongoose.model('ibuErrorDoc', ibuErrorSchema);
// exports.default = new ibuErrorDoc();
module.exports = ibuErrorDoc;

// Some test's to show schema validator working
// testobj.filename = 'testdoc.xml';
//
// testobj.save(function(err){
//  console.log(err.errors.filename);
// });
//
// console.log(testobj);
