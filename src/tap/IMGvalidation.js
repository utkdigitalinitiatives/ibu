var exif = require('exiftool');
var fs   = require('fs');
var status = [];

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

function postStatus(x){
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
    postStatus(status);
  }
  if (status.length == 0){
    status.push('Success');
    postStatus(status);
  }
}

fs.readFile(filename, fileRead);
