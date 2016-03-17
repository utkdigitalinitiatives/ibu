/**
 * [XMLvalidation evaluates an MODS XML file and ensures it meets standards set here: https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary]
 * @param {[String]} input [MODS XML filename]
 * @return {[Array]}       [Success] or [Filename, Error 1, Error 2, Error 3, ...]
 * inputs
 * outputs
 */

var fs = require('fs');
var parser = require('xml2json');
var jp = require('jsonpath');
var status = [];

const IbuErrorDoc = require('./schema');
const db = require('../config/db');

//let stream = IbuErrorDoc.find().stream();
let stream = IbuErrorDoc.find({}).where({"XMLerrors":[]}).where({"filePathXML":{$exists:true,$ne:""}}).stream();

function findmesome(){
  stream.on('data', function(doc) {
    startProcessing(doc.filePathXML)
  }).on('error', function(err) {
    console.log('err: ' + err);
  }).on('close', function() {

  });


}



//IbuErrorDoc.find({ filename: "9733.2309.4609.0.xml"}.exec( function(x) {console.log('x output: ' + x)}))

function fileRead(err, data) {
  var message;
  if (err) {
    message = 'Cannot read file';
    console.log('Cannot read file');
  }
  else {
    message = 'Successfully read file';
    console.log('Successfully read file');
  }
  console.log('message :' + message);
  postResults(message, data);
}

function postResults(x, data) {
  switch(x) {
    case 'Cannot read file':
      console.log('CANNOT');
      break;
    case 'Successfully read file':
      console.log('CAN');
      //readMODS(data);
      //return data;
      break;
  }
}

function startProcessing(file) {
  var modsIn = fs.readFileSync(file, 'utf8');
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
// fix this for cricket (xml##); not strings
  var xmlErrors = ["xml00",   //XML: too many collection titles
                   "xml01",   //XML: too many MS/AR numbers
                   "xml02",   //XML: please verify dateCreated elements and attributes
                   "xml03",   //XML: too many dateIssued elements
                   "xml04",   //XML: problems with digitalOrigin
                   "xml05",   //XML: too many extent elements
                   "xml06",   //XML: please verify identifier[@type=filename]
                   "xml07",   //XML: please verify physicalDescription/form
                   "xml08",   //XML: please verify internetMediaType
                   "xml09",   //XML: please verify typeOfResource
                   "xml10",   //XML: please verify languageOfCataloging/languageTerm
                   "xml11",   //XML: please check the number of note[@type=ownership]
                   "xml12",   //XML: please check the number of recordOrigin elements
                   "xml13",   //XML: please check the number of recordContentSource elements
                   "xml14",   //XML: please check the number of location/physicalLocation elements
                   "xml15",   //XML: please check the accessCondition element
                   "xml16",   //XML: please verify shelfLocator
                   "xml17"    //XML: please verify titleInfo/title

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
  xmlValues[17] = jp.query(modsObj, '$.mods.titleInfo..title').length;

  console.log('IF:xmlValues:  ' + xmlValues + ' length: ' + xmlValues.length);
  console.log('IF:xmlTargets: ' + xmlTargets + ' length: ' + xmlTargets.length);

  for(i=0; i < xmlValues.length; i++) {
    // collection titles
    if((i==0) && (xmlValues[i]>xmlTargets[0]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // MS/AR numbers
    if((i==1) && (xmlValues[i]>xmlTargets[0]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // dateCreated
    if((i==2) && (xmlValues[i]<xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    } else if ((i==2) && ((xmlValues[i]==xmlTargets[i]) || (xmlValues[i]>xmlTargets[i]))) {
      for(n=0; n<xmlValues[i]; n++) {
        if((n==0) && ((!modsObj.mods.originInfo.dateCreated[n].keyDate) && (!modsObj.mods.originInfo.dateCreated[n].point))) {
          //console.log('first dateCreated is okay');
        } else if((n>0) && ((!modsObj.mods.originInfo.dateCreated[n].keyDate) && (!modsObj.mods.originInfo.dateCreated[n].point))) {
          // will push an error for every problematic dateCreated
          status.push(`${xmlErrors[i]}`);
        }
      }
    }
    // dateIssued
    if((i==3) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // digitalOrigin
    if((i==4) && (xmlValues[i]>xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // extent
    if((i==5) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // identifier[@type='filename']
    // TODO verify value(s) here?
    if((i==6) && (xmlValues[i]==0)) {
      status.push(`${xmlErrors[i]}`);
    }
    // physicalDescription/form
    if((i==7) && (xmlValues[i]<xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // physicalDescription/internetMediaType
    if((i==8) && (xmlValues[i]!==xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // typeOfResource
    if((i==9) && (xmlValues[i]!==xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // languageOfCataloging/languageTerm
    if((i==10) && (xmlValues[i]!==xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // note[@type='ownership']
    if((i==11) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // recordInfo/recordOrigin
    if((i==12) && (xmlValues[i]!==xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // recordInfo/recordContentSource
    if((i==13) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // location/physicalLocation
    if((i==14) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // rights!!
    if((i==15) && (xmlValues[i]!==xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
    // shelfLocator
    if((i==16) && (xmlValues[i]>xmlTargets[i]+1)) {
      status.push(`${xmlErrors[i]}`);
    }
    // titleInfo/title
    if((i==17) && (xmlValues[i]<xmlTargets[i])) {
      status.push(`${xmlErrors[i]}`);
    }
  }
}

//startProcessing(filename, fileRead);

export default findmesome;

// rename startProcessing function
