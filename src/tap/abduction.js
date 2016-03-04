const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const IbuErrorDoc = require('./schema');
/*eslint-disable*/
const db = require('../config/db');
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
                setTimeout(saveToDB(file), 100);
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
                setTimeout(saveToDB(file), 100);
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
                () => {
                  // Recursive Function for data crashes
                  setTimeout(saveToDB(file), 100);
                });
            } else if ((doc.filePathIMG === '') && ((ext === '.tif')) || (ext === '.jp2')) {
              IbuErrorDoc.findByIdAndUpdate(doc._id, { $set: { filePathIMG: path.resolve(file) } },
                () => {
                  // Recursive Function for data crashes
                  setTimeout(saveToDB(file), 100);
                });
            }
          }).on('error', () => {
            // Recursive Function for data crashes
            setTimeout(saveToDB(file), 100);
          }).on('close', () => {
            // console.log('Done');
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
function filelistings(gravity) {
  let readDirrectories = 0;
  fs.readdir(gravity, (err, files) => {
    if (err) {
      return console.err(err);
    }
    if (!files.length) {
      return console.log('No files to show');
    }
    return files.map((file) => { //eslint-disable-line
      return path.join(gravity, file);
    }).filter((file) => {
      if (fs.statSync(file).isFile() === false) {
        readDirrectories++;
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

/**
 * Serch directory for Image & MODS file and saves to db
 * @param  {[type]} gravity - The directory to search
 * @return {[type]} db      - ported to the database
 */
module.exports = function abduction(gravity) {
  filelistings(gravity);
};
