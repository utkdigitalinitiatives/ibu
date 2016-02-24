/**
 * status.js
 * chd 160218
 *
 * status: 
 * function inputs:  
 *    0. I do not have final information on what the inputs will be.
 *    1. error.txt array of strings from XMLvalidataion  
 *    2. error.txt array of strings from IMGvalidataion  
 *    3. error.txt array of strings from Controller_validataion  
 * function outputs:  
 *    0. I do not have final information on what the outputs will be. 
 *    1. errorReport.txt flat file written to a directory or sent to Controller
 *    2. errorLog.txt flat file written to a directory or sent to Controller
 * function purpose:  
 *    1. Translate shortform input messages to English Language format for errorReport.txt
 *    2. Send shortform input messages to errorLog format for errorLog.txt
 *
 * This file uses the module nodejs\node_modules\abbrev that is already installed as part of node.js.
 *
 *
 * @return {[type]} [description]
 */



var abbrev = require('./abbrev.js')
var assert = require("assert")
var util = require("util")

console.log("TAP version 13")
var count = 0

//This needs a function to process command line arguments in the argv[] array
//  argv[0] = name of the program (the first command line argument)
//  argv[1] = second command line argument
//  argv[2] = third command line argument

function test (list, expect) {
  count++
  var actual = abbrev(list)
  assert.deepEqual(actual, expect,
    "abbrev("+util.inspect(list)+") === " + util.inspect(expect) + "\n"+
    "actual: "+util.inspect(actual))
  actual = abbrev.apply(exports, list)
  assert.deepEqual(abbrev.apply(exports, list), expect,
    "abbrev("+list.map(JSON.stringify).join(",")+") === " + util.inspect(expect) + "\n"+
    "actual: "+util.inspect(actual))
  console.log('ok - ' + list.join(' '))
}

//The values in "list" come from the current version of the file IMGvalidation.js.
//These are not final values.
test([ "Success"
	,"Cannot read file"
	,"Cannot read exif data"
	,"Successfully read file"
	,"Successfully read exif"
	,"Incorrect file format"
	,"Incorrect PPI"
	,"More than 16 Bit Depth"
	,"Not color"
	,"Not 600 PPI" ],
	{         
	'Success': 'The image file passes all validation tests.'
	,'Cannot read file': 'The image file cannot be read.'
	,'Cannot read exif data': 'The exif data in the image file cannot be read.'
	,'Successfully read file': 'The image file is readable.'
	,'Successfully read exif': 'The exif data in the image file is readable.'
	,'Incorrect file format': 'The image file is not in the correct file format.'
	,'Incorrect PPI': 'The image file has incorrect PPI.'
	,'More than 16 Bit Depth': 'The image file has a bit depth greater than 16.'
	,'Not color': 'The image file is not color.'
	,'Not 600 PPI':	'The image file is not 600 PPI.'	
	})
/* ************************************************ **
test([ "ruby", "ruby", "rules", "rules", "rules" ],
{ rub: 'ruby'
, ruby: 'ruby'
, rul: 'rules'
, rule: 'rules'
, rules: 'rules'
})
** ************************************************ */

console.log("1..%d", count)
