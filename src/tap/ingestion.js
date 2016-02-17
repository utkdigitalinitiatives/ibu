/**
 * ingestion.js
 */
 // 

 //---- example  file reader
var fs = require('fs');


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + ".");
    process.exit(-1);
}

var path = process.argv[2];

fs.readdir(path, function(err, items) {
    console.log(items);

    for (var i=0; i<items.length; i++) {
        console.log(items[i]);
    }
});
// execute drush command
var exec = require('child_process').exec;
var cmd = 'drush ';

exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
});
