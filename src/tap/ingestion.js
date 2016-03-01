/**
 * ingestion.js
 * expects:  
 * 1. path of directory (target)
 * 2. parentpid
 * 3. namespace
 * 4. model
 *   (note: basic image,large image,audio,video, collection, pdf, binary -- all require
 * the "ibsp" in the command string, book requires the "ibbp" part in the drush command.)
 * 
 * output:
 *  if second command is successful: "success"
 *  
 * errors:
 *  if parameters missing  "parameters missing, ingest failed" 
 *  if first command did not return success   "prep ingest command failed"
 *  (only if first command ran successfully)
 *     if second ran but did not ingest   "second ingest command failed"
 *
 * @param target directory path
 * @param parentpid 
 * @param namespace
 * @param model
 * @return $message
 *
 */
// for testing 
//
var param = process.argv;
console.log('hi');
target = String(param[3]);
parentpid = String(param[4]);
namespace = String(param[5]);
model = String(param[6]);

var status=[];

function ingestion(target,parentpid,namespace,model) {
  // build command pieces
  // serveruri is the location of the drupal_home on the drupal server
  var drupalhome = '/vhosts/dlwork/web/collections';
  console.log('drupalhome = ',drupalhome);
  var serveruri = 'http://dlwork.lib.utk.edu/dev/';
  console.log('serveruri = ',serveruri);
  console.log('parentpid = ',parentpid);
  // namespace
  console.log('namespace = ',namespace);
  // target is the local directory holding the ingest files
  console.log('target = ',target);
  //
  var $message = 'ingest did not happen';
  var contentmodel = '';
  if ((model)&& (model==='basic')) {
    contentmodel = 'islandora:sp_basic_image';
  }   
  if ((model)&&(model==='large')) {
    contentmodel = 'islandora:sp_Large_image';
  }
  console.log('model = ',model);
  // execute first drush command 
  var exec = require('child_process').exec;
  var cmd = String('drush -r '+drupalhome+'-v -u=1 --uri='+serveruri+' ibsp --content_models='+contentmodel+' --type=directory --parent='+parentpid+' --namespace='+namespace+' --target='+target );
  // show assembled command
  console.log('cmd=',cmd);
  if ((target !='')&&(contentmodel !='')&&(parentpid !='')&&(namespace !='')) {
    exec(cmd, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     // test command log for success indication
     // test for substr in stdout
     if(stdout.indexOf('SetID:') > -1) {
       $message = 'prep success';
       console.log($message);
       status.push("$message");
       //return $message;
     }// end if
     else {
       $message = 'prep ingest command failed!';
       console.log($message);
       status.push("$message");
       return $message;
     }//end else
    });// end exec
  }// end if
  else {
     // this could be broken down here into individual error messages for the actual parameters that are missing,
     // but since the parameter passing is handled programatically, this might work.
     console.log('parameters missing, ingest failed');
     $message = 'parameters missing, ingest failed';
     status.push("$message");
     return $message;
  }// end else
  // exec second drush command
  var cmd2 = String('drush -r '+drupalhome+'-v -u=1 --uri='+serveruri+' islandora_batch_ingest');
  console.log('cmd2=',cmd2);
  if ($message == 'prep success') { 
    exec(cmd2, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     // test command log for success indication
     // test for substr in stdout
     if(stdout.indexOf('Processing Complete;') > -1) {
       $message = 'success';
       console.log($message);
       status.push("$message");
       //return $message;
     }// end if
     else {
       $message = 'second ingest command failed';
       console.log($message);
       status.push("$message");
       return $message;
     }//end else
    });
  }// end if
  return $message;
}// end function
//export default ingestion;
ingestion(target,parentpid,namespace,model);

