const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
/*eslint-enable*/
// import * as status from './status';
import abduction from './abduction';
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// let target = '/home/vagrant/imagetest';
// let parentpid = 'islandora:test2';
// let namespace = 'test2';
// let model = 'basic';
// import ingest from './ingestion';

const gravity = './test/';

function ingestionPrep(resolve, reject) {
  if (fs.existsSync('./test/staging')) {
    return resolve('success');
  } else { //eslint-disable-line
    fs.mkdir('./test/staging', (err) => {
      if (err) {
        return reject(err);
      } else { //eslint-disable-line
        return resolve('success');
      }
    });
  }
}


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
    let message;
    if (pH > 0) {
      // message = reject(Error(ErrorLog));
      message = 'success';
    } else {
      message = 'success';
    }
  }).then(resolve(message));
}

// ingestion(target,parentpid,namespace,model);

function controller() {
  abduction(gravity);
  Promise.race([pitching])
  .then(console.log)
  .catch(function(num) { console.log('catch: ', num); });
}

export default controller;
