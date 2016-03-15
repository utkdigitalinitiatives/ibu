/* chd 160315 unittest function call to status()
 *
 * command line example:
 * using default ErrorArray inside the script.
 * node unittest_status.js 
 *
 * command line example:
 * using argument list on the command line.
 * node unittest_status.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens" 
 *
 *
 * reference: http://www.scriptol.com/javascript/include.php
 * 
 *
 */


var process = require('process');
var argv = process.argv;
var ErrorArray=[];
	if (argv.length > 2) { /*build ErrorArray from command_line*/
		var i  = 0;
		var ct = 2; 
		while (ct < argv.length){
			ErrorArray[i] = argv[ct];
			//console.log ("ErrorArray["+i+"]="+ErrorArray[i]);
			i  = i  +1;
			ct = ct +1;
		}/*end while*/
 
	}else {/*use default ErrorArray values*/
		ErrorArray = ["0012_000251_000028_0001.jp2"
            ,"Cannot read file" 
			,"Incorrect file format" 
			,"no kittens" ];
			
	}/*end if-else*/


var vm = require('vm');
var fs = require('fs');
var Fname = "./status.js"

vm.runInThisContext(fs.readFileSync(Fname));

var returnString = status(ErrorArray);
 console.log(returnString);
