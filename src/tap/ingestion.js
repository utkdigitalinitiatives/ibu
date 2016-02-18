/**
 * ingestion.js
 * expects:  
 * 1. path of directory
 * 2. namespace
 * 3. model
 * output:
 *  log of drush run
 */
 // 
// build command pieces
// serveruri is the location of the drupal_home on the drupal server
let drupalhome = '/vhosts/digital/web/collections';
let serveruri = 'http://dlwork.lib.utk.edu/dev/';
var contentmodel = '';
 if ((model)&& (model==='basic')) {
   contentmodel = 'islandora:sp_basic_image';
 }   
 if ((model)&&(model==='large')) {
   contentmodel = 'islandora:sp_Large_image';
 }
let parentpid = '';
// namespace
let namespace = '';
// target is the local directory holding the ingest files
let target = '';
// execute drush command
var exec = require('child_process').exec;
var cmd = 'drush -r '.drupalhome.'-v -u=1 --uri='.serveruri.' ibsp --content_models='.contentmodel.' --type=directory --parent='.parentpid.' --namespace='.namespace.' --target='target;
if (target!='') {
exec(cmd, function(error, stdout, stderr) {
  // command output is in stdout
  console.log(error);
});
}
