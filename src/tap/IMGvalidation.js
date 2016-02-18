/*

 This module tests exif metadata against the standards set forth in UT Libraries' digitization standards (https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581).

 */

var exif = require('exiftool');
var fs   = require('fs');

fs.readFile(filename, function (err, data) {
  var status = [];
  if (err){
    status.push("Can't read file");
  }
  else {
    exif.metadata(data, function (err, metadata) {
      if (err)
        throw err;
      else {
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
          // Test for Document Imaging
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
          // Test for Maps, Drawings, and Oversize Materials
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
        }

        if (status.length == 0){
          status.push('Success');
        }
      }
    });
    return status;
  }
});
