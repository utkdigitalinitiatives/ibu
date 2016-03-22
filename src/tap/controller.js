const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
/*eslint-enable*/
// import * as status from './status';
const abduction = Promise.promisify(require('./abduction'));
// let abduction = require('abduction');
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// let target = '/home/vagrant/imagetest';
// let parentpid = 'islandora:test2';
// let namespace = 'test2';
// let model = 'basic';
// import ingest from './ingestion';
import ingestionPrep from './ingestionPrep';
// import config from '../config/index';

// const gravity = config.production.rootPath;
let overallStatus = 'failing';
/**
 * pitching Checks if there are any errors in the database
 * @method pitching is a Promise
 * @param  {promise} resolve Successful value
 * @param  {promise} reject  Failure value
 * @return {[type]}         [description]
 */
function pitching(resolve, reject) {
  let ErrorLog = [];
  let pH = 0;

  const stream = IbuErrorDoc.find({})
    .select('filename filePathXML filePathIMG XMLerrors IMGerrors').stream();

  stream.on('data', (wort) => {
    if ((wort.XMLerrors.length <= 0) || (wort.IMGerrors.length <= 0)) {
      if ((wort.filePathXML !== '') && (wort.filePathIMG !== '')) {
        // Passing!
      } else {
        const missing = (wort.filePathXML === '' ? 'MODS' : 'Image');
        ErrorLog.push(`${String(wort.filename)} missing${missing}`);
        pH++;
      }
    } else {
      ErrorLog.push(`${String(wort.filename)} ${wort.XMLerrors} ${wort.IMGerrors}`);
      pH++;
    }
  }).on('error', (err) => {
    return reject(err);
  }).on('close', () => {
    if (pH > 0) {
      overallStatus = 'failing';
      return reject(overallStatus);
    } else {
      overallStatus = 'Success';
      return resolve(overallStatus);
    }
  });
}



// ingestion(target,parentpid,namespace,model);

// ES6 generator waiting on a recursive function to procceed
// Function timed loops until it finds a 'success'
// 'success' from pitch
function checkIfDone() {
  if (overallStatus === 'success') {
    step.next();
  } else if (overallStatus === 'failing') {
    setTimeout(() => {
      // console.log('Trying again.');
      // checkIfDone();
      step.next();
    }, 3000);

  } else {
    setTimeout(() => {
      checkIfDone();
    }, 3000);
  }
}


function *steps() {

  setTimeout(function () {
    // console.log(abduction());
    abduction().then((resolve) => {
      console.log('done? ', resolve);
    }).catch((err)=>{
      console.log(err);
    });
    // step.next();
  }, 1000);
  yield 0;
  // xmlvalid();
  // imgvalid;
  setTimeout(() => {
    // console.log('next.');
    checkIfDone();
  }, 3000);
  yield 1;
  setTimeout(() => {
    if (ingestionPrep() === 'success') {
      step.next();
    } else {
      // console.log('Else');
    }
    // checkIfDone();
  }, 3000);
  yield 2;
  yield 3;
  yield 4;
  yield 5;
}

const step = steps();

function controller() {
  step.next();
  // console.log(step.next().value);
}

export default controller;
