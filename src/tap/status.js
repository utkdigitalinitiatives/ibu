/**
 * status.js
 *
 * translationTable7.js for status.js
 * 
 * Because I have no definite information of final input and output formats,
 * this is a command line program written in the simplest way possible.
 *
 * The inputs (described in detail below) are command line arguments type string.
 *
 * The output is a single multiline string, suitable for sending to a file or
 * printing on the screen.  
 * 
 */

/* 
 * February 26, 2016
 * coding by Cricket Deane for DLI project "sprint"
 * to be posted as translationTable7.js in https://github.com/utkdigitalinitiatives/ibu
 * path: /src/tap/translationTable7.js
 *
 * command line example:
 * node translationTable7.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens"
 *
 * translationTable7.js expects the following command line arguments:
 * node translationTable7.js filename error1 [error2 error3 ...errorN]
 * 
 * standard errors are translated to reader friendly code.
 * non-standard errors are included in the output with "This error is not on the list."
 *
 * The return value is a multiline string, defined as returnString.
 * 
 */


/******************************************************
 * argv block                                         *
 * console.log=(`argv_dot_length= argvLen is toxic`); *
 ******************************************************/
var process = require('process');


var argv = process.argv; //you have to do this.

var cmdLine = "";
var myargv =[];  //declare an array
var i = 0;  //declare an integer variable

var argvLen = argv.length;
while (i<argvLen){
	myargv[i]=process.argv[i];
	cmdLine = cmdLine +" "+myargv[i];
	i = i+1;
	}

var myargvLen=myargv.length;
console.log("myargvLen= "+myargvLen)
console.log("argvLen= "+argvLen)
console.log("cmdLine="+cmdLine);
/******************************************************
 * end argv block                                     *
 ******************************************************/

 var returnString = translateArgs(myargv);
 var printString = returnString;
 console.log(printString);
 
 function translateArgs(myargv){

var a=[ "Success" 
	,"Cannot read file" 
	,"Cannot read exif data" 
	,"Successfully read file" 
	,"Successfully read exif" 
	,"Incorrect file format" 	
	,"Incorrect PPI" 
	,"More than 16 Bit Depth" 
	,"Not color"
	,"Not 600 PPI"
	];

var b=["The image file passes all validation tests."
	,"The image file cannot be read."
	,"The exif data in the image file cannot be read."
	,"The image file is readable."
	,"The exif data in the image file is readable."
	,"The image file is not in the correct file format."
	,"The image file has incorrect PPI."
	,"The image file has a bit depth greater than 16."
	,"The image file is not color."
	,"The image file is not 600 PPI."	
	];


var rawValue  = "";//argv[3];///"Incorrect PPI";//test without while_outer
var engValue  = "";
var filename  = myargv[2];///imgFile;

var retString = filename+" Errors:";

var icount    = 0;
var errorFound =0;
var errorCount =0;

var iInner = 0;
var iOuter = 0;

var iargv = 3;//counter for args that list errors (argv[iargv])
//console.log(`got to here 108`);
//console.log(`BEGIN while_outer\n================================`);
while (iargv<myargvLen){//while_outer	
	rawValue= argv[iargv];
	icount = 0; //reset each time...duh...

while(icount<a.length){//while_inner
	errorFound = 0;
	if (rawValue === a[icount]) {
	    engValue = engValue+ "\n\t"+b[icount];
		break;
		}//end if
	else{
		engValue = engValue+"\n\t"+rawValue+": This error is not on the list.";
		break;
	    }//end else
	iInner=iInner+1;
	icount = icount+1;
	}//end while_inner
iargv = iargv+1;
}//end while_outer
//console.log(`=====================================\nEND while_outer`)
	
	///console.log(cmdLine);
retString = retString+engValue; 
return(retString);
 }//end function translateArgs(myargv)

