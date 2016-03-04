/**
 * 160304 coding by Cricket Deane for DLI project "sprint"
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
 * where myargv is the array:
 
  var myargv = [ "0012_000251_000028_0001.jp2"
                 ,"Cannot read file" 
				 ,"Incorrect file format" 
				 ,"no kittens"
				 ];
 * 
 * Example of ErrorReport:
 
 
 Filename: 0012_000251_000028_0001.jp2
 ErrorReport:
         1.  The image file cannot be read.
         2.  The image file is not in the correct file format.
         3.  no kittens : This error is not found on the standard error list.
		 
		
 * The values in the standardError array are values from
 *   1. IMGvalidation.js
 *   2. XMLvalidation.js
 * 
 */


/******************************************************
 * argv block                                         *
 ******************************************************/
var process = require('process');
var argv = process.argv;
/******************************************************
 * end argv block                                     *
 ******************************************************/
 
 var myargv=[];
 var i  = 0;
 var ct = 2; 
 while (ct < argv.length){
	 myargv[i] = argv[ct];
	 //console.log ("myargv["+i+"]="+myargv[i]);
	 i  = i  +1;
	 ct = ct +1;
 }
 

 var returnString = translateArgs(myargv);
 console.log(returnString);
 
 function translateArgs(myargv){

var standardError = {"Cannot read file" :   "The application cannot read the file."
                  ,"Successfully read file" :   "The application successfully read the file."

				  ,"xml00" :   "The mods file contains too many collection titles."
                  ,"xml01" :   "The mods file contains too many MS/AR numbers."
                  ,"xml02" :   "Please verify dateCreated elements and attributes."
                  ,"xml03" :   "The mods file contains too many dateIssued elements."
                  ,"xml04" :   "The mods file hass problems with digitalOrigin."
                  ,"xml05" :   "The mods file contains too many extent elements."
                  ,"xml06" :   "Please verify identifier[@type=filename] in the mods file."
                  ,"xml07" :   "Please verify physicalDescription/form  in the mods file."
                  ,"xml08" :   "Please verify internetMediaType in the mods file."
                  ,"xml09" :   "Please verify typeOfResource in the mods file."
                  ,"xml10" :   "Please verify languageOfCataloging/languageTerm in the mods file."
                  ,"xml11" :   "Please check the number of note[@type=ownership] values in the mods file."
                  ,"xml12" :   "Please check the number of recordOrigin elements in the mods file."
                  ,"xml13" :   "Please check the number of recordContentSource elements in the mods file."
                  ,"xml14" :   "Please check the number of location/physicalLocation elements in the mods file."
                  ,"xml15" :   "Please check the text of accessCondition (rights) in the mods file."
                  ,"xml16" :   "Please verify the value of shelfLocator in the mods file."
                  ,"xml17" :   "Please verify the value of titleInfo/title in the mods file."
        ,"Incorrect file format" : "The image file has an incorrect file format."
        ,"Incorrect PPI" : "The image file has an incorrect PPI value."
        ,"Wrong Color Depth" : "The image file has the wrong color depth value."
        ,"Not color" : "The image file is not color."
        ,"No material type description declared." : "The image file lacks a declaration of material type description."
        ,"Success" : "The image file passes all validation tests."
};
				  
				  


var rawValue  = "";//argv[3];///"Incorrect PPI";//test without while_outer
var engValue  = "";
var filename  = myargv[0];///imgFile;

var retString = "\nFilename: "+filename+"\nErrorReport:";
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

