const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
let indexed = 1;
let totalProcessed = 0;
let error = [];
let fileList = [];
import config from '../config/index';
let gravity = config.development.rootPath;

function saveToDB(file) {
  const ext = path.extname(file);
  let filename = path.basename(file, ext);
  let FILEPATH = path.resolve(file);
  let FILENAMESTRING = { 'filename': filename };
  let filePathIMG;
  let filePathXML;
  if (ext !== '') {
       IbuErrorDoc.count(FILENAMESTRING)
        .exec((err, number) => {
          if (number === 0) {
            if (ext === '.xml') {
              const xmlfileFoundInFolder = new IbuErrorDoc({
                filename: filename,
                filePathXML: FILEPATH,
                expectedNumObjects: indexed,
                filePathIMG: '',
                postErrorProcessing: '',
              });
              xmlfileFoundInFolder.save((xmlSaveErr) => {
                if (xmlSaveErr) {
                  // console.log(xmlSaveErr);
                  setTimeout(saveToDB(file), 1000);
                } else {
                  totalProcessed++;
                }
              });
            } else if ((ext === '.tif') || (ext === '.jp2')) {
              const tiffileFoundInFolder = new IbuErrorDoc({
                filename: filename,
                filePathIMG: FILEPATH,
                expectedNumObjects: indexed,
                filePathXML: '',
                postErrorProcessing: '',
              });
              tiffileFoundInFolder.save((tifUpdateErr) => {
                if (tifUpdateErr) {
                  // console.log(tifUpdateErr);
                  setTimeout(saveToDB(file), 1000);
                } else {
                  totalProcessed++;
                }
              });
            } else {
              console.log('Outside Scope', indexed, totalProcessed);
              totalProcessed++;
            }
          } else {
            const stream = IbuErrorDoc.find(FILENAMESTRING)
            .select('_id filename filePathXML filePathIMG expectedNumObjects').stream();
            stream.on('data', (doc) => {
              if (ext === '.xml') {
                if (doc) {
                  doc.filePathXML = FILEPATH;
                  doc.expectedNumObjects = indexed;
                  doc.save();
                  totalProcessed++;
                }
              } else if ((ext === '.tif') || (ext === '.jp2')) {
                if (doc) {
                  doc.filePathIMG = FILEPATH;
                  doc.expectedNumObjects = indexed;
                  doc.save();
                  totalProcessed++;
                }
              }
            }).on('error', err => {
              throw new Error(error);
            }).on('close', () => {
              totalProcessed++;
            });
          }
        });
  }
}

function filelistings() {
  fs.readdirAsync(gravity, (err, files) => {
    let fileLength = files.length;
    if (err) {
      return console.log(err);
    }
    indexed = files.length;
    if (!files.length) {
      return console.log('No files to show');
    }
    return files.map((file) => { //eslint-disable-line
      return path.join(gravity, file);
    }).filter((file) => {
      if (fs.statSync(file).isFile() === false) {
        totalProcessed++;
      }
      return fs.statSync(file).isFile();
    }).forEach((file, fileLength) => {
      if (path.extname(file) === '.tif' || path.extname(file) === '.jp2' ||
      path.extname(file) === '.xml') {
        // saveToDB(file);
        fileList.push(file);
      }
    });
  });
}

function checkIfDone(resolve) {
  if (error.length > 0) {
    const errors = error.toString();
    return Promise.reject();
  }
  if ((fileList.length + totalProcessed !== 0) ||
      (fileList.length > totalProcessed)) {
    for (let i = 0; i < fileList.length; i++) {
      saveToDB(fileList[i]);
    }
  } else {
    setTimeout(checkIfDone, 4000);
  }
  return resolve = 'Success';
}

module.exports = function abduction() {
  filelistings();
  return Promise.resolve(checkIfDone());
};
