/**
 * [IMGvalidation evaluates a large image and ensures it meets standards set here: https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581]
 * @param  {[String]} input [Image filename]
 * @return {[Array]}       [Success] or [Collection, Filename, Error 1, Error 2, Error 3, ...]
 *
 */

var exif = require('exiftool');
var fs   = require('fs');
var status = [];
//var filename = './test_images/freshman-record_1986_0001.tif';
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ibu');
var conn = mongoose.connection;

function fileRead(err, data){
  var message;
  if (err){
    message = "Cannot read file";
  }
  else {
    message = "Successfully read file";
  }
  postResults(message, data);
}

function postResults(x, data) {
  switch(x){
    case "Cannot read file":
      status.push(x);
      postStatus(status);
      break;
    case "Cannot read exif data":
      status.push(x);
      postStatus(status);
      break;
    case "Successfully read file":
      exif.metadata(data, testExif);
      break;
    case "Successfully read exif":
      readExif(data);
      break;
  }
}

function postStatus(x, y){
  var mongoDoc = {"file":filename, "collection":y,"IMGerrors":x};
  console.log(mongoDoc);
  conn.collection('ibuerrors').insert(mongoDoc);
  return x;
}

function testExif(err, metadata){
  var message;
  if(err){
    message = "Cannot read exif data";
  }
  else {
    message = "Successfully read exif";
  }
  postResults(message, metadata);
}

function readExif(metadata) {
  var collection;
  if(metadata['keywords']){
    collection = metadata['keywords'];
  }
  else {
    collection = "No collection";
  }
    switch(metadata['description']) {
    // Test for Book Imaging
    case 'Book Imaging':
      // Is it a TIFF or a JP2
      if (metadata['format'] != 'image/tiff' || metadata['fileType'] != 'TIFF' || metadata['fileTypeExtension'] != 'tif' || metadata['fileTypeExtension'] != 'jp2') {
        status.push("Incorrect file format")
      }
      // Is it 400 PPI
      if (metadata['xResolution'] != '400' && metadata['yResolution'] != '400') {
        status.push("Not 400 PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("More than 16 Bit Depth")
      }
      // Is it Color
      if (metadata['colorSpaceData'] == 'RGB') {
        status.push("Not color")
      }
      break;
    case 'Document Imaging':
      // Is it a TIFF or a JP2
      if (metadata['format'] != 'image/tiff' || metadata['fileType'] != 'TIFF' || metadata['fileTypeExtension'] != 'tif' || metadata['fileTypeExtension'] != 'jp2') {
        status.push("Incorrect file format")
      }
      // Is it 400 PPI
      if (metadata['xResolution'] != '400' && metadata['yResolution'] != '400') {
        status.push("Not 400 PPI")
      }
      // Is it 16 Bit Depth
      if (metadata['bitsPerSample'] == '8 8 8') {
        status.push("More than 16 Bit Depth")
      }
      // Is it Color
      if (metadata['colorSpaceData'] == 'RGB') {
        status.push("Not color")
      }
      break;
    //Test for Maps, Drawings, and Oversize Materials
    case 'Maps, Drawings, Over-sized Original':
      break;
    // Test for Photographs
    case 'Photographs':
      break;
    // Test for Small Negatives
    case 'Photographic Still Film up to 4" x 5"':
      break;
    // Test for Larger Negatives
    case 'Photographic Still Film Larger than 4" x 5"':
      break;
    // Test for Artwork Reproduction
    case 'Reproduction of Artwork':
      break;
  }
  if (status.length >= 1){
    status.splice(0, 0, metadata['keywords'], filename);
    postStatus(status, collection);
  }
  if (status.length == 0){
    status.push('Success');
    postStatus(status, collection);
  }
}

function startProcessing (file, callback){
  fs.readFile(file, callback);
}

startProcessing(filename, fileRead);
