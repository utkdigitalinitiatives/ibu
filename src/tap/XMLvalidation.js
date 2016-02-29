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
                  1,   //dateIssued (optional, non-repeating)
                  1,   //digitalOrigin (req'd, non-repeating)
                  1,   //physicalDescription/extent (optional, non-repeating)
                  1,   //identifier[@type='filename'] (req'd, repeatable)
                  1,   //physicalDescription/form (req'd, repeatable)
                  1,   //physicalDescription/internetMediaType (req'd, non-repeating)
                  1,   //typeOfResource (req'd, non-repeating)
                  1,   //languageOfCataloging/languageTerm (req'd, non-repeating)
                  1,   //note[@type='ownership'] (optional, non-repeating)
                  1,   //recordInfo/recordOrigin (req'd, non-repeating)
                  1,   //recordInfo/recordContentSource (optional, non-repeating)
                  1,   //location/physicalLocation (req if avail, non-repeating)
                  1,   //rights! (required, non-repeating)
                  1,   //shelfLocator (optional, non-repeating)
                  1    //titleInfo/title (required, repeatable)

                 ];
var xmlErrors = ["XML: too many collection titles",
                 "XML: too many MS/AR numbers",
                 "XML: verify dateCreated values",
                 "XML: too many dateIssued elements",
                 "XML: problems with digitalOrigin",
                 "XML: too many extent elements",
                 "XML: please verify identifier[@type=\'filename\']",
                 "XML: too many form elements",
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

xmlValues[0] = jp.query(modsObj, '$.mods.relatedItem[?(@.displayLabel=="Collection")].titleInfo.title').length;
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
  if((i==0) && ((xmlValues[i]>(xmlTargets[i])+1))) {
    console.log(`XML: Collection titles: ${xmlValues[i]} didn\'t match the expected value of ${xmlTargets[i]}`);
  }
  if((i==1) && (xmlValues[i]>1)) {
    console.log(`XML: MS/AR identifier(s): ${xmlValues[i]} didn\'t match the expected value of ${xmlTargets[i]}`);
  }
  if((i==2) && (xmlValues[i]>xmlTargets[i])) {
    console.log(`XML: dateCreated error: ${xmlValues[i]} didn\'t match the expected value of ${xmlTargets[i]}`);
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


// fileKey for mods/identifier[@local] comparisons and interacting with db
// should accommodate multiple identifier[@type='filename']s now; this takes the first
// TODO this should incorporate a simple adminDB formatting validity check
var fileID = jp.query(modsObj, '$.mods.identifier[?(@.type=="filename")]["$t"]');
var fileKey = String(fileID[0]).slice(0, -4);
console.log('fileID: ' + fileID);
console.log('fileKey: ' + fileKey);

// originInfo/dateCreated* test (required and repeatable)
// TODO should be at least 1 dateCreated w/ no keyDate
// dateCreated[no attributes] = 1 (required, repeatable)
// dateCreated[@keyDate][@point='start'] = 1 (req'd, non-repeating)
// dateCreated[@keyDate][@qualifier] <= 1 (optional, non-repeating)

// TODO identifier testing
// identifier[@type='filename'], [@type='local'], [@type='opac']
// identifier[@type='filename'] is the only req'd, all repeatable

// genre (optional and repeatable)
// host title relatedItem[@type='host']/titleInfo/title (optional and repeatable)

// language/languageTerm (optional, repeatable)
// recordInfo/languageOfCataloging (required, non-repeating)

// name/namePart (optional, repeatable)
// name[@authority] (optional, repeatable)
// name/namePart/role/roleTerm (req'd if available, repeatable)
// name[@type] (optional, repeatable)

// subjects (all optional, all repeatable)
// thumbnail (req'd if applicable, non-repeating)
// title_initial_article, titleInfo/nonSort: articles in the title element (req'd if applicable, repeatable)
// title_of_part, titleInfo/partName (req'd if applicable, repeatable)
