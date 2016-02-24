"use strict";

let recursive = require('recursive-readdir');
const fs = require('fs');

/**
 * [abduction description]
 * @param  {[type]} input [Folder to scan]
 * @return {[type]}       [2 Arrays of file locations]
 *
 */

let fileLocation = 'build/';
let search = 'delivery';
let pump = '../../test';

var path = require('path');

console.log('fs: ',process.cwd());
// Find File List within a folder
module.exports = function() {
  let gravity = '../../test';
  console.log('It fired');
  console.log(filesInDirectory());
};

function filesInDirectory(callback){
  let something;
  recursive('../../test/', function (err, files) {
     // Files is an array of filename
     console.log(files);
     something = files;
     callback(null, something);
     //return files;
   });
};

function deliveryDirectory(pump){
  recursive(pump, function (err, files) {
     // Files is an array of filename
     console.log(files);
     return files;
   });
};
