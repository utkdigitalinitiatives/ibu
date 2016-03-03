let Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');
const mongoose = require('mongoose');
let ibuErrorDoc = require('./schema');
let db = require('../config/db');
/**
 * Serch directory for Image & MODS file and saves to db
 * @param  {[type]} gravity - The directory to search
 * @return {[type]} db      - ported to the database
 */
module.exports = function abduction(gravity){
  filelistings(gravity);
};
/**
 * [saveToDB description]
 * @param  {Object} file - File from fs
 * @return {*}      - None
 */
function saveToDB(file){
  let ext = path.extname(file);
  if(ext!=''){
    /**
     * Using Mongoose count to see if file exist
     * @param  {string|object|*} { 'filename': path.basename(file,
     * path.extname(file)) - Searching for the current file's name
     * @fires exec - Numbers function to eval if update/save is needed and runs
     * @param {number} - number of files found with this same filename (1 or 0)
     * @return {*}  - No Return
     */
    ibuErrorDoc.count({ 'filename' : path.basename(file, path.extname(file))})
      .exec(function numbers(err, number){
        if(number==0){
            if(ext=='.xml'){
              let xmlfileFoundInFolder = new ibuErrorDoc ({
                  filename: path.basename(file, path.extname(file)),
                  filePathXML: path.resolve(file),
                  filePathIMG: ""
                });
              xmlfileFoundInFolder.save(function (err) {
                if (err){
                  // console.log(err);
                  setTimeout(saveToDB(file), 100);
                  };
                });
            };

            if( (ext=='.tif')||(ext=='.jp2') ){
              let tiffileFoundInFolder = new ibuErrorDoc ({
                filePathIMG: path.resolve(file)
              }, {upsert: true});
              tiffileFoundInFolder.update(function (err) {
                if (err){
                  // console.log(err);
                  setTimeout(saveToDB(file), 100);
                };
              });
            };
      }else{
        let stream = ibuErrorDoc.find({ 'filename' : path.basename(file, path.extname(file))})
          .select('_id filename filePathXML filePathIMG').stream();
          stream.on('data', function(doc){
            if((doc.filePathXML=="") && (ext=='.xml')){
              ibuErrorDoc.findByIdAndUpdate(doc._id, { $set: {filePathXML: path.resolve(file)} },
                (err)=>{
                  setTimeout(saveToDB(file), 100);
                });
            }else if((doc.filePathIMG=="") && ((ext=='.tif'))||(ext=='.jp2')){
              ibuErrorDoc.findByIdAndUpdate(doc._id, { $set: {filePathIMG: path.resolve(file)} },
                (err)=>{
                  setTimeout(saveToDB(file), 100);
                });
            };
          }).on('error', function(err){
            setTimeout(saveToDB(file), 100);
            //console.err(err);
          }).on('close', function(){
            // console.log('Done');
          });
      };//if 0 / ELSE
    });//exec
  };
};

/**
 * [filelistings description]
 * @param  {string} gravity - Directory passed by controller.js
 * @param  {object} !files.length - Evaluate if the folders are empty
 * @param  {string} path.join(gravity, file) - Returns Full path of file
 * @param  {string} onlyFiles - Returns only files (no directories)
 * @fires .forEach - SaveToDB
 */
function filelistings(gravity){
  let readDirrectories = 0;
  fs.readdir(gravity, (err, files) => {
    if(err){ console.err(err)};
    if (!files.length) {
      return console.log('No files to show');
    };
    return files.map(function (file) {
      return path.join(gravity, file);
    }).filter(function onlyFiles(file) {
      if(fs.statSync(file).isFile()== false){
        readDirrectories++;
      };
      return fs.statSync(file).isFile();
    }).forEach(function (file) {
      if(path.extname(file)=='.tif'||path.extname(file)=='.jp2'|| path.extname(file)=='.xml') {
        saveToDB(file);
      };
    });
  });
};
