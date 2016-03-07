/**
 * ingestion.js
 * expects:  
 * 1. path of directory (target)
 * 2. parentpid
 * 3. namespace
 * 4. model
 *   (note: basic image,large image,audio,video, collection, pdf, binary -- all require
 * the "ibsp" in the command string.)
 * output:
 *  log of drush run
 * errors:
 *  if drush not installed
 *  if target does not exist
 *  if parentpid incorrect
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
/*
target = String(param[2]);
parentpid = String(param[3]);
namespace = String(param[4]);
model = String(param[5]);
*/
// enable db
//const IbuErrorDoc = require('./schema');
//const db = require('../config/db');

var status=[];

function ingestion(target,parentpid,namespace,model) {
  var fs=require('fs');
  /*
  // test target
  fs.exists('/var/www/drupal',function(exists){
    if(!exists){
       $errmessage = 'target does not exist';
       //status.push("$errmessage");
       return $errmessage;
    }
  });
  // test parentpid
  if(parentpid.indexOf(':') > -1) {
    $errmessage = 'parentpid is not correct';
    //console.log($errmessage);
    //status.push("$message");
    return $errmessage;
  }// end if
  */
  // build command pieces
  //detect drupal home
  // two drupalhomes one for testing on vagrant and one for server installation
  fs.exists('/var/www/drupal',function(exists){
    if(exists){
      var drupalhome = '/var/www/drupal';
      //console.log('yes');
    }else{
      var drupalhome = '/vhosts/dlwork/web/collections';
      //console.log("no");
    }
  });
  //var drupalhome = '/vhosts/dlwork/web/collections';
  //console.log('drupalhome = ',drupalhome);
  // serveruri is the location of the drupal_home on the drupal server
  var serveruri = 'http://localhost';

  //var serveruri = 'http://dlwork.lib.utk.edu/dev/';
  //console.log('serveruri = ',serveruri);
  //console.log('parentpid = ',parentpid);
  // namespace
  //console.log('namespace = ',namespace);
  // target is the local directory holding the ingest files
  //console.log('target = ',target);
  // make mongo connection
  /*
  var mongoose = require('mongoose');
  mongoose.connect('mongodb://localhost/ibu');
  var conn = mongoose.connection;
  */
  //
  var $message = '';
  var $errmessage = '';
  var contentmodel = '';
  if ((model)&& (model==='basic')) {
    contentmodel = 'islandora:sp_basic_image';
  }   
  if ((model)&&(model==='large')) {
    contentmodel = 'islandora:sp_large_image_cmodel';
  }
  console.log('model = ',model);
  // execute first drush command 
  var exec = require('child_process').exec;
  // test for drush existance
  var cmdtest = String('whereis drush')
  exec(cmdtest, function(error, stdout, stderr) {
     // command output is in stdout
     var output = `stdout:${stdout}`;
     //console.log(`stdout:${stdout}`);
     // test command log, stdout, for success indication
     if(output.indexOf('bin/drush') > -1) {
       $errmessage = 'drush installed';
       console.log($errmessage);
       //status.push("$message");
     }// end if
     else {
       $errmessage = 'drush not installed';
       //console.log($message);
       status.push("$errmessage");
       //exit if drush not installed
       return $errmessage;
     }//end else
  });//end exec
  // prepare first drush command
  var cmd = String('drush -r '+drupalhome+' -v -u 1 --uri='+serveruri+' ibsp --content_models='+contentmodel+' --type=directory --parent='+parentpid+' --namespace='+namespace+' --target='+target );
  // show assembled command
  console.log('cmd=',cmd);
  if ((target !='')&&(contentmodel !='')&&(parentpid !='')&&(namespace !='')) {
    // execute first drush command 
    exec(cmd, function(error, stdout, stderr) {
     // drush command output is in stderr
     var output1 = `stderr:${stderr}`;
     console.log('output1=',output1);
     // test command log, stdout, for success indication
     if(output1.indexOf('SetId:') > -1) {
       $message = 'ingest prep drush command success';
       console.log($message);
       // start second command
      var cmd2 = String('drush -r '+drupalhome+' -v -u 1 --uri='+serveruri+' islandora_batch_ingest');
      console.log('cmd2=',cmd2);
      //$message = 'hold';
      // execute second drush command 
      exec(cmd2, function(error, stdout, stderr) {
        // command output is in stderr
        var output2 = `stderr:${stderr}`;
        //console.log(`stdout:${stdout}`);
        // test command log, stdout, for success indication
        if(output2.indexOf('Processing complete;') > -1) {
          $message = 'ingest drush command success';
          console.log($message);
          status.push("$message");
          //return $message;
        }// end if
        else {
          $message = 'second ingest command failed!';
          console.log($message);
          status.push("$message");
          return $message;
        }//end else
      }); // end exec
     }// end if
     else {
       $message = 'first ingest command failed';
       console.log($message);
       status.push("$message");
       return $message;
     }//end else
    });// end exec
  }// end if
  else {
     $message = 'parameters for first command missing, ingest not started.';
     console.log($message);
     status.push("$message");
     return $message;
  }// end else
  return $message;
}// end function
//ingestion(target,parentpid,namespace,model);
export default ingestion;

