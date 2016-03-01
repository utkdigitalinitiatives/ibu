/**
 * [XMLvalidation evaluates an MODS XML file and ensures it meets standards set here: https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary]
 * @param {[String]} input [MODS XML filename]
 * @return {[Array]}       [Success] or [Filename, Error 1, Error 2, Error 3, ...]
 *
 */

var fs = require('fs');
var parser = require('xml2json');
var jp = require('jsonpath');
var status = [];
var filename = process.argv;
filename = String(filename[2]);

var modsIn = fs.readFileSync(filename, 'utf8');
var modsObj = parser.toJson(modsIn, options = {object: true});

var xmlValues = [];
// only testing for fields that are required and/or non-repeating
var xmlTargets = [0,   //collTitle (req if avail, non-repeating)
                  0,   //ms_arID (req if avail, non-repeating)
                  2,   //dateCreated*
                  0,   //dateIssued (optional, non-repeating)
                  1,   //digitalOrigin (req'd, non-repeating)
                  0,   //physicalDescription/extent (optional, non-repeating)
                  1,   //identifier[@type='filename'] (req'd, repeatable)
                  1,   //physicalDescription/form (req'd, repeatable)
                  1,   //physicalDescription/internetMediaType (req'd, non-repeating)
                  1,   //typeOfResource (req'd, non-repeating)
                  1,   //languageOfCataloging/languageTerm (req'd, non-repeating)
                  0,   //note[@type='ownership'] (optional, non-repeating)
                  1,   //recordInfo/recordOrigin (req'd, non-repeating)
                  0,   //recordInfo/recordContentSource (optional, non-repeating)
                  0,   //location/physicalLocation (req if avail, non-repeating)
                  1,   //rights! (required, non-repeating)
                  0,   //shelfLocator (optional, non-repeating)
                  1    //titleInfo/title (required, repeatable)

                 ];
var xmlErrors = ["XML: too many collection titles",
                 "XML: too many MS/AR numbers",
                 "XML: verify dateCreated values",
                 "XML: too many dateIssued elements",
                 "XML: problems with digitalOrigin",
                 "XML: too many extent elements",
                 "XML: please verify identifier[@type=\'filename\']",
                 "XML: please verify physicalDescription/form",
                 "XML: please verify internetMediaType",
                 "XML: please verify typeOfResource",
                 "XML: please verify languageOfCataloging/languageTerm",
                 "XML: please check the number of note[@type=\'ownership\']",
                 "XML: please check the number of recordOrigin elements",
                 "XML: please check the number of recordContentSource elements",
                 "XML: please check the number of location/physicalLocation elements",
                 "XML: please check the accessCondition element",
                 "XML: too many shelfLocator elements",
                 "XML: please add a titleInfo/title element"

                 ];

xmlValues[0] = jp.query(modsObj, '$.mods.relatedItem[?(@.displayLabel=="Collection")].titleInfo..title').length;
xmlValues[1] = jp.query(modsObj, '$.mods.relatedItem[?(@.displayLabel=="Collection")].identifier').length;
xmlValues[2] = jp.query(modsObj, '$.mods.originInfo.dateCreated.*').length;
xmlValues[3] = jp.query(modsObj, '$.mods.originInfo.dateIssued').length;
xmlValues[4] = jp.query(modsObj, '$.mods.physicalDescription.digitalOrigin').length;
xmlValues[5] = jp.query(modsObj, '$.mods.physicalDescription.extent').length;
xmlValues[6] = jp.query(modsObj, '$.mods.identifier[?(@.type=="filename")]').length;
xmlValues[7] = jp.query(modsObj, '$.mods.physicalDescription.form').length;
xmlValues[8] = jp.query(modsObj, '$.mods.physicalDescription.internetMediaType').length;
xmlValues[9] = jp.query(modsObj, '$.mods.typeOfResource').length;
xmlValues[10] = jp.query(modsObj, '$.mods..languageOfCataloging.languageTerm').length;
xmlValues[11] = jp.query(modsObj, '$.mods.note[?(@.type=="ownership")]').length;
xmlValues[12] = jp.query(modsObj, '$.mods.recordInfo.recordOrigin').length;
xmlValues[13] = jp.query(modsObj, '$.mods.recordInfo.recordContentSource').length;
xmlValues[14] = jp.query(modsObj, '$.mods.location.physicalLocation').length;
xmlValues[15] = jp.query(modsObj, '$.mods.accessCondition').length;
xmlValues[16] = jp.query(modsObj, '$..shelfLocator').length;
xmlValues[17] = jp.query(modsObj, '$.mods.titleInfo[*].title').length;

console.log('xmlValues:  ' + xmlValues + ' length: ' + xmlValues.length);
console.log('xmlTargets: ' + xmlTargets + ' length: ' + xmlTargets.length);

for(i=0; i < xmlValues.length; i++) {
  // collection titles
  if((i==0) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // MS/AR numbers
  if((i==1) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // dateCreated
  // TODO asdfasdf
  if((i==2) && (xmlValues[i]>xmlTargets[i])) {
    console.log(`XML: dateCreated error: ${xmlValues[i]} didn\'t match the expected value of ${xmlTargets[i]}`);
    if(!jp.query(modsObj, '$.mods.originInfo.dateCreated[?(@.keyDate=="yes")]')) {
      console.log('dateCreated is here');
    } else {
      console.log('problems finding dateCreated');
    }
  }
  // dateIssued
  if((i==3) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // digitalOrigin
  if((i==4) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // extent
  if((i==5) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // identifier[@type='filename']
  // TODO verify value(s) here?
  if((i==6) && (xmlValues[i]==0)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // physicalDescription/form
  if((i==7) && (xmlValues[i]==0)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // physicalDescription/internetMediaType
  if((i==8) && (xmlValues[i]!==1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // typeOfResource
  if((i==9) && (xmlValues[i]!==1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // languageOfCataloging/languageTerm
  if((i==10) && (xmlValues[i]!==1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // note[@type='ownership']
  if((i==11) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // recordInfo/recordOrigin
  if((i==12) && (xmlValues[i]!==1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // recordInfo/recordContentSource
  if((i==13) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // location/physicalLocation
  if((i==14) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // rights!!
  if((i==15) && (xmlValues[i]!==1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // shelfLocator
  if((i==16) && (xmlValues[i]>1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // titleInfo/title
  if((i==17) && (xmlValues[i]<1)) {
    console.log(`XML: ${xmlErrors[i]}`);
  }
  // else {
  //  if(xmlValues[i]!=xmlTargets[i]) {
  //    console.log(`oops! Error Message: \"${xmlErrors[i]}\"\n ${xmlValues[i]} didn\'t match the expected value of ${xmlTargets[i]}`);
  //  }
  //}
}

startProcessing(filename, fileRead);

function startProcessing(file, callback) {
  fs.readFile(file, 'utf8', callback);
}

function fileRead(err, data) {
  var message;
  if (err) {
    message = 'Cannot read file';
  }
  else {
    message = 'Successfully read file';
  }
  //console.log('message :' + message);
  postResults(message, data);
}

function postResults(x, data) {
  switch(x) {
    case 'Cannot read file':
      console.log('CANNOT');
      break;
    case 'Successfully read file':
      //readMODS(data);
      return data;
      break;
  }
}

//var fileID = jp.query(modsObj, '$.mods.identifier[?(@.type=="filename")]["$t"]');
//var fileKey = String(fileID[0]).slice(0, -4);
//console.log('fileID: ' + fileID);
//console.log('fileKey: ' + fileKey);

