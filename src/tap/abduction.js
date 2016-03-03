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
     * @fires exec -
     * @param {number} - number of files found with this same filename (1 or 0)
     * @return {*}  - Returns nothing
     */
    ibuErrorDoc.count({ 'filename' : path.basename(file, path.extname(file))})
      .exec((err, number)=>{
        if(number==0){
            if(ext=='.xml'){
              let xmlfileFoundInFolder = new ibuErrorDoc ({
                  filename: path.basename(file, path.extname(file)),
                  filePathXML: path.resolve(file),
                  filePathIMG: ""
                });
              xmlfileFoundInFolder.save(function (err) {if (err)
                  setTimeout(saveToDB(file), 1000);
                });
            };// xml new
            if( (ext=='.tif')||(ext=='.jp2') ){
              let tiffileFoundInFolder = new ibuErrorDoc ({
                filePathIMG: path.resolve(file)
              }, {upsert: true});
              tiffileFoundInFolder.update(function (err) {if (err)
                setTimeout(saveToDB(file), 1000);
                });
              };
      }else{
        let stream = ibuErrorDoc.find({ 'filename' : path.basename(file, path.extname(file))})
          .select('_id filename filePathXML filePathIMG').stream();
          stream.on('data', function(doc){
            if((doc.filePathXML=="") && (ext=='.xml')){
              ibuErrorDoc.findByIdAndUpdate(doc._id, { $set: {filePathXML: path.resolve(file)} }, (err,foo)=>{console.log(err,foo);});
            }else if((doc.filePathIMG=="") && ((ext=='.tif'))||(ext=='.jp2')){
              ibuErrorDoc.findByIdAndUpdate(doc._id, { $set: {filePathIMG: path.resolve(file)} }, (err,foo)=>{console.log(err,foo);});
            };
          }).on('error', function(err){
            console.err(err);
          }).on('close', function(){
            // console.log('Done');
          });
      };//if 0 / ELSE
    });//exec
  };
};

/**
 * [filelistings description]
 * @param  {[type]} gravity [description]
 * @return {[type]}         [description]
 */
function filelistings(gravity){
  let readFiles = 0;
  let readDirrectories = 0;
  fs.readdir(gravity, (err, files) => {
    if(err) throw err;
    if (!files.length) {
      return console.log('No files to show');
    };
    return files.map(function (file) {
      return path.join(gravity, file);
    }).filter(function (file) {
      if(fs.statSync(file).isFile()== false){
        readDirrectories++;
      };
      return fs.statSync(file).isFile();
    }).forEach(function (file) {
      readFiles++;
      if(path.extname(file)=='.tif'||path.extname(file)=='.jp2'|| path.extname(file)=='.xml') {
        saveToDB(file);
      };
    });
  });
};
