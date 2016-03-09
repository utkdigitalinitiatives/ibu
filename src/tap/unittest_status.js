/* chd 160307 unittest function call to status
 * command line example:
 * node status.js 0012_000251_000028_0001.jp2 "Cannot read file" "Incorrect file format" "no kittens" 
 *
 * see http://www.scriptol.com/javascript/include.php
 * I used this one the most: * see http://www.scriptol.com/javascript/include.php
 * 
 *
 */

/* import translateArgs from './tstatus.js'; */

var vm = require('vm');
var fs = require('fs');
var Fname = "./status.js"

vm.runInThisContext(fs.readFileSync(Fname));


var ErrorArray = ["0012_000251_000028_0001.jp2"
            ,"Cannot read file" 
			,"Incorrect file format" 
			,"no kittens" ];
			

var returnString = translateArgs(ErrorArray);
 console.log(returnString);
