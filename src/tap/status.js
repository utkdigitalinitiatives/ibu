/**
 * 160309 coding by Cricket Deane for DLI project "sprint"
 * to be posted as status.js in https://github.com/utkdigitalinitiatives/ibu
 * path: /src/tap/status.js
 *
 *
 * status.js
 *
 * 
 *
 * The inputs (described in detail below) are command line arguments type string.
 *
 * The output is a single multiline string, suitable for sending to a file or
 * printing on the screen. 
 *
 * status.js expects the following command line:
 * node status.js filename error1 [error2 error3 ...errorN]
 *
 * command line example:
 * node status.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens" 
 *
 * function translateArgs(array) expects the following array to be passed:
 * filename, error1, [error2, error3, ...errorN]
 *
 * function call example:
 * returnString= tranlsateArgs(myargv);
 * where myargv is an ordered array of strings, [filename, error1, error2, ... errorN]:
 
  var myargv = [ "0012_000251_000028_0001.jp2" //filename
                 ,"Cannot read file"           //error1 
				 ,"Incorrect file format"      //error2 
				 ,"no kittens"                 //errorN
				 ];
 * 
 * Example of ErrorReport (output):
 
 
 Filename: 0012_000251_000028_0001.jp2
 Validation Errors:
         1.  The image file cannot be read.
         2.  The image file is not in the correct file format.
         3.  no kittens : This error is not found on the standard error list.
		 
		
 * The values in the standardError array are values from
 *   1. IMGvalidation.js
 *   2. XMLvalidation.js
 * 
 */

 
 function translateArgs(myargv){

var standardError = {
	"Success" : "The image file passes all validation tests."
	,"Cannot read file" : "The image file cannot be read."
	,"Cannot read exif data" : "The exif data in the image file cannot be read."
	,"Successfully read file" : "The image file is readable."
	,"Successfully read exif" : "The exif data in the image file is readable."
	,"Incorrect file format" : "The image file is not in the correct file format."	
	,"Incorrect PPI" : "The image file has incorrect PPI."
    ,"Wrong Color Depth" : "The image file has the wrong color depth."
	,"More than 16 Bit Depth" : "The image file has a bit depth greater than 16."
	,"Not color" : "The image file is not color."
	,"Not 600 PPI" : "The image file is not 600 PPI."
    ,"No material type description declared." : "The image file has no material type description declared." 
	,"XML: too many collection titles" : "The mods file contains too many collection titles."
	,"XML: too many MS/AR numbers" : "The mods file contains too many MS/AR numbers."
	,"XML: verify dateCreated values" : "The mods file lacks verification of dateCreated values."
	,"XML: too many dateIssued elements" : "The mods file contains too many dateIssued values."
	,"XML: problems with digitalOrigin" : "The mods file has problems with the digitalOrigin value."
	,"XML: too many extent elements" : "The mods file contains too many extent values."
	,"XML: please verify identifier[@type=filename]" : "Please verify identifier[@type=filename]."
	,"XML: please verify physicalDescription/form" : "Please verify physicalDescription/form value."
	,"XML: please verify internetMediaType" : "Please verify intenetMediaType value."
	,"XML: please verify typeOfResource" : "Please verify typeOfResource value."
	,"XML: please verify languageOfCataloging/languageTerm" : "Please verify languageOfCataloging/languageTerm value."
	,"XML: please check the number of note[@type=ownership]" : "Please check the number of note[@type=ownership] values."
	,"XML: please check the number of recordOrigin elements" : "Please check the number of recordOrigin elements."
	,"XML: please check the number of recordContentSource elements" : "Please check the number of recordOrigin elements."
	,"XML: please check the number of location/physicalLocation elements" : "Please check the number of location/physicalLocation elements."
	,"XML: please check the accessCondition element" : "Pease check the accessCondition value."
	,"XML: too many shelfLocator elements" : "The mods file contains too many shelfLocator values."
	,"XML: please add a titleInfo/title element" : "Please add a titleInfo/title element."
	};


var rawValue  = "";
var engValue  = "";
var filename  = myargv[0];

var retString = "\nFilename: "+filename+"\nValidation Errors:";
var errorCount = 0;
var myargvLen=myargv.length;


var iargv = 1;//counter for args that list errors (argv[iargv])
while (iargv<myargvLen){
	
	errorCount=errorCount+1;	
	rawValue= myargv[iargv];
	engValue=standardError[rawValue];
	if (!engValue){
		engValue  = rawValue +" : This error is not found on the standard error list.";
	}
	retString = retString+"\n\t "+errorCount+".  "+engValue;
	iargv=iargv+1;
}
	 
return(retString);
 }//end function translateArgs(myargv)

