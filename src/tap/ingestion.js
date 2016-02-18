/**
 * ingestion.js
 * expects:  
 * 1. path of directory
 * 2. parentpid
 * 3. namespace
 * 4. model
 * output:
 *  log of drush run
 *
 * @param target directory path
 * @param parentpid 
 * @param namespace
 * @param model
 * @return $message
 *
 */
function ingestion(target,parentpid,namespace,model) {
  // build command pieces
  // serveruri is the location of the drupal_home on the drupal server
  let drupalhome = '/vhosts/digital/web/collections';
  let serveruri = 'http://dlwork.lib.utk.edu/dev/';
  let parentpid = '';
  // namespace
  let namespace = '';
  // target is the local directory holding the ingest files
  let target = '';
  var $message = 'ingest did not happen';
  var contentmodel = '';
  if ((model)&& (model==='basic')) {
    contentmodel = 'islandora:sp_basic_image';
  }   
  if ((model)&&(model==='large')) {
    contentmodel = 'islandora:sp_Large_image';
  }
  // execute first drush command 
  var exec = require('child_process').exec;
  var cmd = 'drush -r '.drupalhome.'-v -u=1 --uri='.serveruri.' ibsp --content_models='.contentmodel.' --type=directory --parent='.parentpid.' --namespace='.namespace.' --target='target;
  if (target!='') {
    exec(cmd, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     $message = 'ingest success';
    });
  }// end if
  // exec second drush command
  var exec2 = require('child_process').exec;
  var cmd2 = 'drush -r '.drupalhome.'-v -u=1 --uri='.serveruri.' islandora_batch_ingest';
  if (target!='') {
    exec2(cmd2, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     $message = 'ingest success';
    });
  }// end if
  return $message;
}// end function
export default ingestion;
