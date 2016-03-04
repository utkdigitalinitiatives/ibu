'use strict';
// import status from './status';
import abduction from './abduction';
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
target = '/home/vagrant/imagetest';
parentpid = 'islandora:test2';
namespace = 'test2';
model = 'basic';
 import ingest from './ingestion';

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
   abduction(gravity);
   ingestionPrep();
   ingestion(target,parentpid,namespace,model);
};

function ingestionPrep(status){
  if(fs.existsSync('./test/staging')){
      // console.log('Already Exist');
      return status;
  }else{
    fs.mkdir('./test/staging', (err)=> {
        if(err) {
          console.log(err);
          status = err;
          return status;
        }else{
          // console.log('directory Created');
          return status;
          };
      });
  };
};


export default controller;
