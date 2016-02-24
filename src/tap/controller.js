'use strict';

//import status from './status';
let abduction = require('./abduction');

// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// import ingest from './ingestion';

let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ibu');
let conn = mongoose.connection;


/**
 * [abduction Search for './delivery' and Get Complete File List]
 * @return {[String]} [Array of Strings]
 * @return {dataBaseCollection} [Single String of collection name]
 */


function controller() {
  console.log('Fired');
  var dataBaseCollection = abduction();
  console.log(dataBaseCollection);
  // console.log('abduction: '+abduction+' type of: '+ typeof abduction);
  // let imgStatus = imgvalid(dataBaseCollection);
  // let xmlStatus = xmlvalid(dataBaseCollection);
  //
  // if(imgStatus[2]!='success'||xmlStatus[2]!='success'){
  //   console.log('Failed? '+imgStatus[2]);
  // }else if(imgStatus[2]==='success'&&xmlStatus[2]==='success'){
  //   console.log('Success! '+'['+imgStatus[2]+', '+xmlStatus[2]+']');
  // }else{
  //   console.log('What just happened? Is this even possible?');
  // }
};
controller();
//export default controller;
