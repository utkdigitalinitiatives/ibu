/**
 * [XMLvalidation evaluates an MODS XML file and ensures it meets standards set here: https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary]
 * @param {[String]} input [MODS XML filename]
 * @return {[Array]}       [Success] or [Filename, Error 1, Error 2, Error 3, ...]
 *
 */

var fs = require('fs');
var parser = require('xml2json');
var status = [];
var filename = process.argv;
filename = String(filename[2]);

startProcessing(filename, fileRead);

function startProcessing(file, callback) {
  fs.readFile(file, 'utf8', callback);
}

function fileRead(err, data) {
  var message;
  if (err) {
    message = 'Cannot read file';
  }
  else {
    message = 'Successfully read file';
  }
  console.log('message :' + message);
  postResults(message, data);
}

function postResults(x, data) {
  switch(x) {
    case 'Cannot read file':
      console.log('CANNOT');
      break;
    case 'Successfully read file':
      console.log('READ');
      console.log('typeof data: ' + typeof data);
      // data is still XML at this point
      //console.log(data);
      //readMODS(data);
      return data;
      break;
  }
}

//var dataS = parser.toJson(data);
//console.log('typeof dataS: ' + dataS);
//console.log('dataS: ' + dataS);

