let recursive = require('recursive-readdir');

/**
 * [abduction description]
 * @param  {[type]} input [Folder to scan]
 * @return {[type]}       [2 Arrays of file locations]
 * @param  {[type]} findFolder Within /d1/something find *./delivery
 *
 */

let fileLocation = './';
let fileList = new Array();
function abduction(files) {
  recursive(fileLocation, ['ignore.cs', '*.js', '*.jade', 'node_modules/*', '.git/*'], function (err, files) {
     // Files is an array of filename
    //  console.log(i, ' is ' ,files);
    fileList = files;

    // return files;
   });
    console.log(fileList);
};


export default abduction;
