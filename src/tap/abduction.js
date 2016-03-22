const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
let index = 100;
let totalProcessed = 0;
let readDirrectories = 0;
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
    const FILENAME = { filename: path.basename(file, path.extname(file)) };
    if (ext !== '') {
      /**
       * Using Mongoose count to see if file exist
       * @param  {string|object|*} { 'filename': path.basename(file,
       * path.extname(file)) - Searching for the current file's name
       * @fires exec - Numbers function to eval if update/save is needed and runs
       * @param {number} - number of files found with this same filename (1 or 0)
       * @return {*}  - No Return
       */
       IbuErrorDoc.count(FILENAME)
        .exec((err, number) => {
          if (number === 0) {
            if (ext === '.xml') {
              const xmlfileFoundInFolder = new IbuErrorDoc({
                filename: path.basename(file, path.extname(file)),
                filePathXML: path.resolve(file),
                filePathIMG: '',
              });
              xmlfileFoundInFolder.save((xmlSaveErr) => {
                if (xmlSaveErr) {
                  // Recursive Function for data crashes
                  setTimeout(saveToDB(file), 2000);
                } else {
                  totalProcessed++;
                }
              });
            } else if ((ext === '.tif') || (ext === '.jp2')) {
              const tiffileFoundInFolder = new IbuErrorDoc({
                filename: path.basename(file, path.extname(file)),
                filePathIMG: path.resolve(file),
                filePathXML: '',
              }, { upsert: true });
              tiffileFoundInFolder.save((tifUpdateErr) => {
                if (tifUpdateErr) {
                  // Recursive Function for data crashes
                  setTimeout(saveToDB(file), 2000);
                } else {
                  totalProcessed++;
                }
              });
            }
          } else {
          /**
           * Find Existing db object(s) and stram a stream
           * @param  {string|object|*} { 'filename': path.basename(file,
           * path.extname(file)) - Searching for the current file's name
           * @lends .stream -Creates a stream
           */
            const stream = IbuErrorDoc.find(FILENAME)
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
                IbuErrorDoc.findByIdAndUpdate(doc._id, { $set: { filePathXML: path.resolve(file) } },
                  (err) => {
                    console.log('Find ID Update xml', err);
                    // Recursive Function for data crashes
                    setTimeout(saveToDB(file), 2000);
                  });
              } else if ((doc.filePathIMG === '') && ((ext === '.tif')) || (ext === '.jp2')) {
                IbuErrorDoc.findByIdAndUpdate(doc._id, { $set: { filePathIMG: path.resolve(file) } },
                  (err) => {
                    console.log('Find ID Update img', err);
                    // Recursive Function for data crashes
                    setTimeout(saveToDB(file), 2000);
                  });
              }
            }).on('error', (err) => {
              throw new Error(error);
              // throw err;
              // console.warn(err);
            }).on('close', () => {
              // console.log('Closing: ', index, totalProcessed);
              totalProcessed++;
              if (index === totalProcessed) {
                // console.log('Triggered');
              }
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
    if (err) {
      return console.log(err);
    }
    index = files.length;
    if (!files.length) {
      return console.log('No files to show');
    }
    return files.map((file) => { //eslint-disable-line
      return path.join(gravity, file);
    }).filter((file) => {
      if (fs.statSync(file).isFile() === false) {
        readDirrectories++;
        totalProcessed++;
      }
      return fs.statSync(file).isFile();
    }).forEach((file) => {
      if (path.extname(file) === '.tif' || path.extname(file) === '.jp2' ||
      path.extname(file) === '.xml') {
        saveToDB(file);
      }
    });
  });
}

function checkIfDone() {
  console.log('checking');
  if (error.length > 0) {
    console.log('errors everywhere!');
    return Promise.reject(error);
   //  throw new Error('Errors Everywhere in Abduction');
  }
  console.log(index, totalProcessed);
  if (index !== totalProcessed) {
    console.log('Again');
    setTimeout(checkIfDone, 1000);
    // console.log('success');
  } else {
    console.log('Gottem haha');
    return 'success';
  }
}
/**
 * Serch directory for Image & MODS file and saves to db
 * @param  {[type]} gravity - The directory to search
 * @return {[type]} db      - ported to the database
 */
module.exports = function abduction(resolve) {
     filelistings();
    let answer = setTimeout(checkIfDone, 3000);
    return answer;
};
