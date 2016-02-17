let recursive = require('recursive-readdir');

/**
 * [abduction description]
 * @param  {[type]} input [Folder to scan]
 * @return {[type]}       [2 Arrays of file locations]
 *
 */

let fileLocation = 'build/';

function abduction(input) {
  recursive(fileLocation, ['ignore.cs', '*.js', '*.jade'], function (err, files) {
     // Files is an array of filename
     console.log(files);
     return files;
   });

};


export default abduction;
