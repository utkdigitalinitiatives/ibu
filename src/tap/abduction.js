"use strict";

let recursive = require('recursive-readdir');
const fs = require('fs');

/**
 * [abduction description]
 * @param  {[type]} input [Folder to scan]
 * @return {[type]}       [2 Arrays of file locations]
 *
 */

let search = 'delivery';
let gravity = './test/';
let path = require('path');
let fileArray = [];

console.log('fs: ', process.cwd() );

// Find File List within a folder
module.exports = function() {
  fileArray = deliveryDirectory();
};

function deliveryDirectory(){
  recursive(gravity, ['*.txt'], function (err, files) {
      // Files is an array of filename
      console.log(files);
      return files;
    });
 };
