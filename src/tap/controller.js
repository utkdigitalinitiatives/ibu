const fs = require('fs');
const IbuErrorDoc = require('./schema');

/*eslint-disable*/
const db = require('../config/db');
/*eslint-enable*/

// import * as status from './status';
import abduction from './abduction';
// import imgvalid from './IMGvalidation';
// import xmlvalid from './XMLvalidation';
// target = '/home/vagrant/imagetest';
// parentpid = 'islandora;test2';
// namespace = 'test2';
// model = 'basic';
let target = '/home/vagrant/imagetest';
let parentpid = 'islandora:test2';
let namespace = 'test2';
let model = 'basic';
import ingest from './ingestion';

const gravity = './test/';
let steps = 0;
function ingestionPrep(status) {
  if (fs.existsSync('./test/staging')) {
      // console.log('Already Exist');
    return status;
  } else { //eslint-disable-line
    fs.mkdir('./test/staging', (err) => {
      if (err) {
        console.log(err);
        return err;
      } else { //eslint-disable-line
          // console.log('directory Created');
        return status;
      }
    });
  }
}

function pitching() {
  let ErrorLog = [];
  let pH = 0;

  let stream = IbuErrorDoc.find({})
    .select('filename filePathXML filePathIMG XMLerrors IMGerrors').stream();
  stream.on('data', (wort) => {

    if ((wort.XMLerrors.length <= 0) || (wort.IMGerrors.length <= 0)) {
      if ((wort.filePathXML !== '') && (wort.filePathIMG !== '')) {
        // Passing!
      } else {
        let missing = (wort.filePathXML==='' ? 'MODS' : 'Image');
        ErrorLog.push(`${String(wort.filename)} missing${missing}`);
        pH++; // pH level is high!
      }
    } else {
      ErrorLog.push(`${String(wort.filename)} ${wort.XMLerrors} ${wort.IMGerrors}`);
      pH++;
      // pH level is high!
      // Construct an array of List[fileNames][errors]
      // Run Status();
    }
  }).on('error', (err) => {
    console.log(err);
  }).on('close', () => {
    console.log(ErrorLog);
    if (pH > 0) {
      console.log('pH level is too high: Status fired!');
    } else {
      // Go to next function
    }
  });
}
function controller() {
  abduction(gravity);
  pitching();
  ingestionPrep();
  // ingestion(target,parentpid,namespace,model);
}


export default controller;
