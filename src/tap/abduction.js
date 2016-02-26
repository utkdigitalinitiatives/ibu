"use strict";
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
//console.log('fs: ', process.cwd() );
// Find File List within a folder
module.exports = function() {
  deliveryDirectory();
  setTimeout(waiting, 3000);
};

function deliveryDirectory(){
  
  fs.readdir(gravity , function (err, files) {
      if (err) {
          throw err;
      }
      files.map(function (file) {
          return path.join(gravity, file);
      }).filter(function (file) {
          return fs.statSync(file).isFile();
      }).forEach(function (file) {
        if(path.extname(file)=='.xml'){
          //console.log("MODS %s (%s)", file, path.extname(file));
          fileArray.push(file);
        }else if(path.extname(file)=='.tif'||path.extname(file)=='.jp2'){
          fileArray.push(file);
          //console.log("Image %s (%s)", file, path.extname(file));
        };
      });
  });
};

function waiting(){
  console.log('x: ', fileArray.length);
  if(fileArray.length>0){
  process.exit();
  };
  setTimeout(waiting, 3000);
};
