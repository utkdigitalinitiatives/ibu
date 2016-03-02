let Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const path = require('path');

const mongoose = require('mongoose');
let ibuErrorDoc = require('./schema');
let db = require('../config/db');

// TEMP
//ibuErrorDoc.collection.drop('ibuerrordoc');

module.exports = function abduction(gravity){
  filelistings(gravity);
};

function saveToDB(file){
  let ext = path.extname(file);
  // console.log( path.basename(file, path.extname(file) ) );
  if(ext!=''){
    //console.log('Found Records', ext, path.basename(file, path.extname(file)));
    ibuErrorDoc.count({'filename': path.basename(file, path.extname(file)) }, (count) => {
        console.log('Count: ',count);
        if(count>0){
            console.log('if');
            ibuErrorDoc.findOne({ fileName: path.basename(file, path.extname(file)) },
              function(err, doc){
                console.log('doc: ',doc);
                if( ext=='xml' ){doc.filePathXML= path.resolve(file);};
                if( (ext=='tif')||(ext=='jp2') ){doc.filePathIMG= path.resolve(file);};
                doc.filename = path.basename(file, path.extname(file));
                doc.update();
              });
        }else{
          console.log('else ', ext);
          if(ext=='.xml'){
            console.log('xml');
            let xmlfileFoundInFolder = new ibuErrorDoc ({
                filename: path.basename(file, path.extname(file)),
                filePathXML: path.resolve(file)
              });
            xmlfileFoundInFolder.save(function (err) {if (err)
                console.log ('Error on save!');
              });
          };

          if( (ext=='.tif')||(ext=='.jp2') ){
            console.log('img');
            let tiffileFoundInFolder = new ibuErrorDoc ({
              filename: path.basename(file, path.extname(file)),
              filePathIMG: path.resolve(file)
            });
            tiffileFoundInFolder.save(function (err) {if (err)
              console.log ('Error on save!');
              });
          };
        };
      });
    };
};

    // ibuErrorDoc.findOneAndUpdate({_id: id }, { $set: {
    //   _id: id,
    //   filename: file,
    //   extentionName: ext
    // }},{upset: true},
    // function(err){
    //   if(err) {
    //     throw err;
    //   }
    // });

  //   let lookup =  {'_id': path.resolve(file)};
  //   console.log(ibuErrorDoc.find(lookup));
  // if(ibuErrorDoc.find(lookup) ){
  //   // console.log('found');
  //   ibuErrorDoc.findOneAndUpdate(lookup, fileFoundInFolder);
  // }else{
  //   console.log('New');
  //   fileFoundInFolder.save(function (err) {if (err) console.log ('Error on save!')});
  // };
  // fileFoundInFolder.save(function (err) {if (err)
  //    console.log ('Error on save!');
  //    ibuErrorDoc.findOneAndUpdate();
  //  });


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
        if( (readFiles+readDirrectories)===files.length) {
          //saveToDB('complete');
        };
      };
    });
  });
};
