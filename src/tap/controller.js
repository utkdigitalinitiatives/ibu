'use strict';
// import status from './status';
//import abduction from './abduction';
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// import ingest from './ingestion';
const fs = require('fs');
//import db from './schema';

// function img(abductionExport, callback){
//   console.log('abductionCallBack: ', abductionExport);
//   callback = 'success';
//   return(null, callback);
// };
let gravity = './test/';
let Promise = require('bluebird');

function controller(){
  //  abduction(gravity);
   ingestionPrep();
};

function ingestionPrep(status){
  if(fs.existsSync('./test/staging')){
      console.log('Already Exist');
      return status;
  }else{
    fs.mkdir('./test/staging', (err)=> {
        if(err) {
          console.log(err);
          status = err;
          return status;
        }else{
          console.log('directory Created');
          return status;
          };
      });
  };
};


export default controller;
