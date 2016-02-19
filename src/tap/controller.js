//import status from './status';
import abduction from './abduction';
<<<<<<< HEAD
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// import ingest from './ingestion';

/**
 * [abduction Search for './delivery' and Get Complete File List]
 * @return {[String]} [Array of Strings]
 */
// Developement testing

let fileList = [];

function controller() {
  console.log('controller fired');

  fileList = abduction();

  let imgStatus = imgvalid(fileList);
  let xmlStatus = xmlvalid(fileList);
  // status();

  if(imgStatus[2]!='success'||xmlStatus[2]!='success'){
    console.log('Failed? '+imgStatus[2]);
  }else if(imgStatus[2]==='success'&&xmlStatus[2]==='success'){
    console.log('Success! '+'['+imgStatus[2]+', '+xmlStatus[2]+']');
  }else{
    console.log('What just happened? Is this even possible?');
  }
};

function imgvalid(input){
  console.log('IMAGES: '+input);
  let results = ['fileName', 'fileType', 'success'];
  return results;
};

function xmlvalid(input){
  console.log('XML: '+input);
  let results = ['fileName', 'fileType', 'success'];
  return results;
};

function status(input){
  console.log('Status: '+input);
  let results = ['fileName', 'error message is as follows', 'what to do with this'];
  return results;
};
=======
//import imgvalid from './IMGvalidation';
//import xmlvalid from './XMLvalidation';
//import ingest from './ingestion';
let status = 'sucess';
let fileList = [];

function controller(input) {

  /**
   * [someFunction description]
   * @return {[type]} [description]
   */

  fileList = abduction(fileList);

  console.log(abduction(fileList));

  // let imageValidationStatus = imgvalid(let Imgstatus[]);
  //xmlvalid();
  // if(status==='sucess'){
  //  ingest();
    // function cleanup(){
       // Remove Files from original folder
    //  };
  // };



    console.log('controller '+input);
  };

  // Mock Function input output
  // function imgvalid(){};
  // function xmlvalid(){};
  // function ingest(){};
  // function status(){};
>>>>>>> origin/master

export default controller;
