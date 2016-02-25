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
//console.log(modsIn);
var modsObj = parser.toJson(modsIn, options = {object: true});

// fileKey for mods/identifier[@local] comparisons and interacting with db
// @TODO what about multiple identifier[@type='filename']s?
var fileID = String(jp.query(modsObj, '$.mods.identifier[?(@.type=="filename")]["$t"]'));
var fileKey = fileID.slice(0, -4);

// abstract (optional and repeatable)
// MS/AR collection title test (req'd if available, non-repeating)
if (jp.query(modsObj, '$.mods.relatedItem[?(@.displayLabel=="Collection")].titleInfo.title') > 1) {
  console.log('Too many collection titles');
  status.push('Too many collection titles');
}
// MS/AR collection identifier test (req'd if available, non-repeating)
if (jp.query(modsObj, '$.mods.relatedItem[?(@.displayLabel=="Collection")].identifier') > 1) {
  console.log('Too many MS/AR identifiers');
  status.push('Too many MS/AR identifiers');
}
// originInfo/dateCreated test (required and repeatable)
// @TODO clean up this test; should be at least 1 dateCreated w/ no keyDate
if (!jp.query(modsObj, '$.mods.originInfo.dateCreated[0][?(@.keyDate)]')) {
  console.log('Missing originInfo/dateCreated');
  status.push('Missing originInfo/dateCreated');
} else {
  console.log('Has an originInfo/dateCreated');
}
// originInfo/dateCreated[@keyDate][@point='start'] (req'd, non-repeating)
// @TODO combine [@qualifier] test here?
if (!jp.query(modsObj, '$.mods.originInfo.dateCreated[?(@.keyDate && @.point=="start")]' || jp.query(modsObj, '$.mods.originInfo.dateCreated[?(@.keyDate && @.point=="start")]') > 1)) {
  console.log('Too many keyDate starting points');
} else {
  console.log('keyDate test passed');
}
// originInfo/dateCreated[@keyDate][@qualifier] (req'd if available, non-repeating)

// originInfo/dateIssued (optional, non-repeating)
// @TODO logic problem
if (!jp.query(modsObj, '$.mods.originInfo.dateIssued') <= 1) {
  console.log('Too many dateIssued elements');
}
// physicalDescription/digitalOrigin (required, non-repeating)
if (jp.query(modsObj, '$.mods.physicalDescription.digitalOrigin') > 1) {
  console.log('Too many digitalOrigin elements');
}
// physicalDescription/extent (optional, non-repeating)
// @TODO logic problem
if (!jp.query(modsObj, '$.mods.physicalDescription.extent') <= 1) {
  console.log('Too many physicalDescription/extent elements');
}
// identifier[@type='filename'] and identifier[@type='local'] (@type='filename': req'd and repeatable; @type='local': req'd if available, repeatable)
// also identifier[@type='opac']
// we have a problem in the identifier[@type='filename'] fails
//if (jp.query(modsObj, '$.mods.identifier[?(.@type=="filename")]' == 1))

// physicalDescription/form (required and repeatable)
if (!jp.query(modsObj, '$.mods.physicalDescription.form')); {
  console.log('Missing physicalDescription/form');
}
// genre (optional and repeatable)
// host title relatedItem[@type='host']/titleInfo/title (optional and repeatable)
// physicalDescription/internetMediaType (required, non-repeating)
if (jp.query(modsObj, '$.mods.physicalDescription.internetMediaType') > 1) {
  console.log('Too many internetMediaTypes');
}
// typeOfResource (required, non-repeating)
var typeRes = jp.query(modsObj, '$.mods.typeOfResource');
if ((typeRes > 1) || (typeRes = 0)) {
  console.log('Problems with typeOfResource');
}
// language/languageTerm (optional, repeatable)
// recordInfo/languageOfCataloging (required, non-repeating)
var langTerm = jp.query(modsObj, '$.mods.recordInfo.languageOfCataloging.languageTerm["$t"]');
if (String(langTerm) != "eng") {
  console.log('Verify languageOfCataloging/languageTerm');
}
if ((langTerm > 1) || (langTerm < 1)) {
  console.log('Problems with languageTerm');
}
// name/namePart
// name[@authority]
// name/namePart/role/roleTerm
// ...
// publisher



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
  console.log('message :' + message);
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
