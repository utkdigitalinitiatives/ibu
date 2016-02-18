//import status from './status';
import abduction from './abduction';
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

export default controller;
