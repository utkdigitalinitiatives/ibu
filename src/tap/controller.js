//import status from './status';
import abduction from './abduction';
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

export default controller;
