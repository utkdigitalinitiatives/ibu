/**
 * [schema defines validation schemas for Mongo documents being inserted into db:ibu collection:ibuerrors]
 *
 *
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ibuErrorSchema = Schema({
  filename: {
    type: String,
    validate: /^[^.]+$/,
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
  }
});

var ibuErrorDoc = mongoose.model('ibuErrorDoc', ibuErrorSchema);
exports.testErrorDoc = new ibuErrorDoc();

// Some test's to show schema validator working
//testobj.filename = 'testdoc.xml';
//
//testobj.save(function(err){
//  console.log(err.errors.filename);
//});
//
//console.log(testobj);

