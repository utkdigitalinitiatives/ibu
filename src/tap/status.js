/**
 * 16028 chd 
 *
 * status.js
 *
 * 
 * Because I have no definite information of final input and output formats,
 * this is a command line program written in the simplest way possible.
 *
 * The inputs (described in detail below) are command line arguments type string.
 *
 * The output is a single multiline string, suitable for sending to a file or
 * printing on the screen. 
 *
 * command line example:
 * node status.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens"  
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
		 
		 
 */



/* 
 * February 26, 2016
 * coding by Cricket Deane for DLI project "sprint"
 * to be posted as status.js in https://github.com/utkdigitalinitiatives/ibu
 * path: /src/tap/status.js
 *
 * command line example:
 * node status.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens"
 *
 * status.js expects the following command line:
 * node status.js filename error1 [error2 error3 ...errorN]
 * 
 * standard errors are translated to reader friendly code.
 * non-standard errors are included in the output with "This error is not on the list."
 *
 * function call example:
 * returnString= tranlsateArgs(myargv);
 *
 * where myargv is the array filename error1 [error2 error3 ...errorN]
 * filename and error1 are required.
 * if there is only one error to report, that error should be a success message.
 *
 * The values in the standardError variable are test values.
 * These should be replaced with real values when available.
 */


/******************************************************
 * argv block                                         *
 ******************************************************/
var process = require('process');
var myargv = process.argv;
/******************************************************
 * end argv block                                     *
 ******************************************************/

 var returnString = translateArgs(myargv);
 //r printString = returnString;
 //console.log(returnString);
 console.log(returnString);
 
 function translateArgs(myargv){

var standardError = {
	"Success" : "The image file passes all validation tests."
	,"Cannot read file" : "The image file cannot be read."
	,"Cannot read exif data" : "The exif data in the image file cannot be read."
	,"Successfully read file" : "The image file is readable."
	,"Successfully read exif" : "The exif data in the image file is readable."
	,"Incorrect file format" : "The image file is not in the correct file format."	
	,"Incorrect PPI" : "The image file has incorrect PPI."
	,"More than 16 Bit Depth" : "The image file has a bit depth greater than 16."
	,"Not color" : "The image file is not color."
	,"Not 600 PPI" : "The image file is not 600 PPI."
	};


var rawValue  = "";//argv[3];///"Incorrect PPI";//test without while_outer
var engValue  = "";
var filename  = myargv[2];///imgFile;

var retString = "\nFilename: "+filename+"\nErrorReport:";
var errorCount =0;
var myargvLen=myargv.length;


var iargv = 3;//counter for args that list errors (argv[iargv])
while (iargv<myargvLen){//while_outer
	
	errorCount=errorCount+1;	
	rawValue= myargv[iargv];
	engValue=standardError[rawValue];
	if (!engValue){
		engValue  = rawValue +" : This error is not found on the standard error list.";
	}
	retString = retString+"\n\t "+errorCount+".  "+engValue;
	iargv=iargv+1;
}//end while_outer
	 
return(retString);
 }//end function translateArgs(myargv)

