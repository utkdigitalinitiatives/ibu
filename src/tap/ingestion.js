/**
 * ingestion.js
 * expects:  
 * 1. path of directory (target)
 * 2. parentpid
 * 3. namespace
 * 4. model
 *   (note: basic image,large image,audio,video, collection, pdf, binary -- all require
 * the "ibsp" in the command string, book requires the "ibbp" part in the drush command.)
 * output:
 *  log of drush run
 * errors:
 *  if parameters missing
 *  if first command did not run
 *  if first command did run but did not prep ingest
 *  if first command ran with a good ingest but second command did not run
 *   (only if first command ran successfully)if second ran but did not ingest
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
target = String(param[2]);
parentpid = String(param[3]);
namespace = String(param[4]);
model = String(param[5]);

var status=[];

function ingestion(target,parentpid,namespace,model) {
  // build command pieces
  // two drupalhomes one for testing on vagrant and one for server installation
  var drupalhome = '/var/www/drupal';
  //var drupalhome = '/vhosts/dlwork/web/collections';
  console.log('drupalhome = ',drupalhome);
  // serveruri is the location of the drupal_home on the drupal server
  var serveruri = 'http://localhost/';

  //var serveruri = 'http://dlwork.lib.utk.edu/dev/';
  console.log('serveruri = ',serveruri);
  console.log('parentpid = ',parentpid);
  // namespace
  console.log('namespace = ',namespace);
  // target is the local directory holding the ingest files
  console.log('target = ',target);
  // make mongo connection
  /*
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/ibu');
  var conn = mongoose.connection;
  */
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
  var cmd = String('drush -r '+drupalhome+' -v -u=1 --uri='+serveruri+' ibsp --content_models='+contentmodel+' --type=directory --parent='+parentpid+' --namespace='+namespace+' --target='+target );
  // show assembled command
  console.log('cmd=',cmd);
  if ((target !='')&&(contentmodel !='')&&(parentpid !='')&&(namespace !='')) {
    exec(cmd, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     // test command log for success indication
     // test for substr in stdout
     if(stdout.indexOf('Command dispatch complete') > -1) {
       $message = 'ingest prep drush command success';
       console.log($message);
       status.push("$message");
       //return $message;
     }// end if
     else {
       $message = 'first ingest command failed!';
       console.log($message);
       status.push("$message");
       return $message;
     }//end else
    });// end exec
  }// end if
  else {
     console.log('parameters for first command missing, ingest not started.\n');
     $message = 'parameters for first command missing, ingest not started.';
     status.push("$message");
     return $message;
  }// end else
  // exec second drush command
  var cmd2 = String('drush -r '+drupalhome+'-v -u=1 --uri='+serveruri+' islandora_batch_ingest');
  console.log('cmd2=',cmd2);
  if ($message = 'ingest prep drush command success') { 
    exec(cmd2, function(error, stdout, stderr) {
     // command output is in stdout
     console.log(stdout);
     // test command log for success indication
     // test for substr in stdout
     $message = 'ingest drush command success';
     console.log($message);
     status.push($message);
    });
  }// end if
  return $message;
}// end function
//export default ingestion;
ingestion(target,parentpid,namespace,model);

