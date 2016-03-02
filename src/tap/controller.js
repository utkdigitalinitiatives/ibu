'use strict';
// import status from './status';
import abduction from './abduction';
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// import ingest from './ingestion';
const fs = require('fs');

// function img(abductionExport, callback){
//   console.log('abductionCallBack: ', abductionExport);
//   callback = 'success';
//   return(null, callback);
// };

function controller(){
  Promise.all([
    abduction,
    ingestionPrep
  ]).then(function(values){
      let abduct = values[0];
      let ingestPrep= values[1];
      console.log(abduct, ingestPrep);
  });
  // function xml(callback){console.log('xml');};
  // function img(callback){console.log('img');};
  // function drush(callback){console.log('drush');};
  // function cleanup(callback){console.log('cleanup');};
};

    // takeAction.next().value;
    // if(imgvalid=='success') {
  //   takeAction.next().value};
  //   }else{console.log(loadFileList)};
  // if(xmlvalid=='success') {
  //   takeAction.next().value};
  //   }else{console.log(loadFileList)};
  // if(ingestionPrep=='success') {
  //   takeAction.next().value};
  //   }else{console.log(loadFileList)};
  // if(ingest=='success') {
  //   takeAction.next().value};
  //   }else{console.log(loadFileList)};
// };

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
