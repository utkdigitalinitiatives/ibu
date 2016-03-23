const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
let indexed = -10;
let totalProcessed = 0;
let error = [];

import config from '../config/index';
let gravity = config.development.rootPath;
/*eslint-enable*/
/**
 * Find and Update database document Or create a new one
 * @param  {Object} file - File(s) from fs
 * @return {*}      - None
 */
function saveToDB(file) {
  const ext = path.extname(file);
  let filename = path.basename(file, ext);
  let FILEPATH = path.resolve(file);
  let FILENAMESTRING = { filename: filename };
  let filePathIMG;
  let filePathXML;
  // console.log(ext, filename, FILEPATH, FILENAMESTRING);
  if (ext !== '') {
      /**
       * Using Mongoose count to see if file exist
       * @param  {string|object|*} { 'filename': path.basename(file,
       * path.extname(file)) - Searching for the current file's name
       * @fires exec - Numbers function to eval if update/save is needed and runs
       * @param {number} - number of files found with this same filename (1 or 0)
       * @return {*}  - No Return
       */
       IbuErrorDoc.count(FILENAMESTRING)
        .exec((err, number) => {
          if (number === 0) {
            if (ext === '.xml') {
              const xmlfileFoundInFolder = new IbuErrorDoc({
                filename: filename,
                filePathXML: FILEPATH,
                indexed,
                filePathIMG,
              });
              xmlfileFoundInFolder.save((xmlSaveErr) => {
                if (xmlSaveErr) {
                  setTimeout(saveToDB(file), 2000);
                } else {
                  totalProcessed++;
                }
              });
            } else if ((ext === '.tif') || (ext === '.jp2')) {
              const tiffileFoundInFolder = new IbuErrorDoc({
                filename: filename,
                filePathIMG: FILEPATH,
                indexed,
                filePathXML: null,
              });
              tiffileFoundInFolder.save((tifUpdateErr) => {
                if (tifUpdateErr) {
                  // Recursive Function for data crashes
                  setTimeout(saveToDB(file), 2000);
                } else {
                  totalProcessed++;
                }
              });
            } else {
              // Formats outside of scope
              indexed--;
              totalProcessed++;
            }
          } else {
          /**
           * Find Existing db object(s) and stram a stream
           * @param  {string|object|*} { 'filename': path.basename(file,
           * path.extname(file)) - Searching for the current file's name
           * @lends .stream -Creates a stream
           */
            const stream = IbuErrorDoc.find(FILENAMESTRING)
            .select('_id filename filePathXML filePathIMG').stream();
            /**
             * Stream is
             * @constructor
             * @param  {object} 'data' -Sent from IbuErrorDoc.find
             * @param  {function} streamOn -Seperates MODS & IMG for Updating
             * @param  {function} close -Closes stream
             * @return {function} saveToDB -Recursive Call in case of a data crash
             */
            stream.on('data', (doc) => {
              if ((doc.filePathXML === '') && (ext === '.xml')) {
                IbuErrorDoc.findByIdAndUpdate(doc._id, { $set: {
                  filePathXML: FILEPATH, indexed,
                } },
                  (err) => {
                    // console.log('Find ID Update xml', err);
                    // Recursive Function for data crashes
                    setTimeout(saveToDB(file), 2000);
                  });
                totalProcessed++;
              } else if ((doc.filePathIMG === '') && ((ext === '.tif')) || (ext === '.jp2')) {
                IbuErrorDoc.findByIdAndUpdate(doc._id, { $set: {
                  filePathIMG: FILEPATH, indexed,
                } },
                  (err) => {
                    // console.log('Find ID Update img', err);
                    // Recursive Function for data crashes
                    setTimeout(saveToDB(file), 2000);
                  });
                totalProcessed++;
              }
            }).on('error', (err) => {
              throw new Error(error);
              // throw err;
              // console.warn(err);
            }).on('close', () => {
              console.log('Closing: ', indexed, totalProcessed);
              // totalProcessed++;
              // if (indexed === totalProcessed) {
              //   // console.log('Triggered');
              // }
            });
          }
        });
    }
}

/**
 * Recersive Index of a specified directory and sends to db save function
 * @param  {string} gravity - Directory passed by controller.js
 * @constructor fs.readir -Recursive files/folders list
 * @param  {object} !files.length - Evaluate if the folders are empty
 * @param  {string} path.join(gravity, file) - Returns Full path of file
 * @param  {string} onlyFiles - Returns only files (no directories)
 * @fires .forEach - SaveToDB
 */
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
        saveToDB(file);
      }
    });
  });
}

function checkIfDone(resolve) {
  if (error.length > 0) {
    let errors = error.toString();
    return Promise.reject();
  }
  if (indexed !== totalProcessed) {
    // console.log('Again');
    setTimeout(checkIfDone, 1000);
    // console.log('success');
  } else {
    return Promise.resolve('success');
  }
}

module.exports = function abduction() {
  filelistings();
  let answer = checkIfDone();
  return Promise.resolve(answer);
};
