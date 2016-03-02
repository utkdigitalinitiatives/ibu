
const fs = require('fs');
const path = require('path');

// Mongoose connection to MongoDB
const mongoose = require('mongoose');
let gravity = './test/';
const dbUri = 'mongodb://localhost:27017/fileList';
mongoose.connect(dbUri);

let userSchema = new mongoose.Schema({
      filename: { type: String, trim: true },
      extentionName: { type: String, trim: true },
      error: [ String ]
    });

let ibuErrorDoc = mongoose.model('filelistings', userSchema);
mongoose.connection.collections['filelistings'].drop();

mongoose.connection.on('connected', function () {
});
mongoose.connection.on('error',function (err) {
  console.log(err.stack);
});
mongoose.connection.on('disconnected', function () {
  console.log('Mongoose default connection disconnected');
});

let status = '';

function abduction(callback) {
    let readFiles = 0;
    let readDirrectories = 0;
    if(status=='success'){
      callback = status;
      return callback;
    };
    fs.readdir(gravity, function (err, files) {
      if (!files.length) {
        return console.log('No files to show');
      };
      files.map(function (file) {
        return path.join(gravity, file);
      }).filter(function (file) {
        if(fs.statSync(file).isFile()== false){
          readDirrectories++;
        }
        return fs.statSync(file).isFile();
      }).forEach(function (file) {
        readFiles++;
        if(path.extname(file)=='.tif'||path.extname(file)=='.jp2'|| path.extname(file)=='.xml'){
          saveToDB(file);
          if( (readFiles+readDirrectories)===files.length) {
            // console.log('Ready to Exit Read');
           status = 'success';
           abduction(status);
          };
        };
      });
    });
};

//   let get_files = function (cb) {
//     fs.readdir(gravity, function (err, files) {
//         if (!files.length) {
//             return console.log('No files to show');
//         }
//         let file_dict = {};
//         let file_index = 0;
//
//         function file(i) {
//             let filename = files[i];
//             fs.stat(gravity + filename, function (err, stat) {
//                 if (stat.isDirectory() || filename[0] == '.') {
//                     // do nothing, skip these dictionaries and dot files
//                 } else {
//                     ++file_index;
//                     file_dict[file_index] = filename;
//                 };
//
//                 if (++i == files.length) {
//                     console.log('right before returning');
//                     console.log(file_dict);
//                     return cb(file_dict);
//                 } else {
//                     // continue getting files
//                     return file(i);
//                 };
//             });
//         }
//         return file(0);
//     });
// }
// get_files(function (v) { console.log(v); });



function saveToDB(file){
  let fileFoundInFolder = new ibuErrorDoc ({
      filename: path.resolve(file),
      extentionName: path.extname(file)
    });
  fileFoundInFolder.save(function (err) {if (err) console.log ('Error on save!')});
};

function saveErrorToDB(errors){
  let errorArray = new ibuErrorDoc ({
      error: errors
    });
  errorArray.save(function (err) {if (err) console.log ('Trying to write to a db it has no access to! Error on save!')});
};

export default abduction;
