# Ingestion Batch Utility

[![Join the chat at https://gitter.im/utkdigitalinitiatives/ibu](https://badges.gitter.im/utkdigitalinitiatives/ibu.svg)](https://gitter.im/utkdigitalinitiatives/ibu?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
Sprint to Ingestion Batch Utility for automating, validating Objects and ingestion
![IBU](http://i.imgur.com/wTI6m0G.png)
NOT A WORKING REPO<br/>
This is a proof of concept only

###Full Description of what this does:
  Takes files (either through drag and drop or from syncing a folder) and automates the process
  of import then validation then renaming files then processes during ingestion.

##Front End Development
###Phase 1: Proof of concept
Website Layout <br/>
Front End: <br/>
List of Pending Collections folders (example: \\central\arc3\prod3\seth\) <br/>
List Cuurently processing folders (example: \\central\arc3\prod3\seth\delivery) <br/>
db.ibuerrors.find({ postErrorProcessing: "Concatenated Errors in a string"}); <br/>

###Phase 2:

###At a glance
*Assumptions being made: samba share's directory structure is regular, AdminDB collection(s) already exist, metadata (MODS) will eventually move to the same delivery directory as the TIF|JPG, we're __only__ talking about basic|large image processing, and __several__ other unarticulated assumptions.*


####A. What ibu looks for

1. ibu will be looking at directories that follow this pattern:

	```shell
	foo_collection/
	  work/
		Park_files/
		recrop_straighten/
	  delivery/
		0012_001234_000200_0000.xml
		0012_001234_000200_0000.tif
		0012_001234_000201_0000.xml
		0012_001234_000201_0000.tif

	bar/
	  work/
		bridger_folders1-7/
		Paul_folders8-12/
	  delivery/
		bar001.jpg
		bar002.jpg
	```

2. ibu (maybe?) has a processing model that tracks `delivery` subdirectories; when XML files are present in a delivery directory, then.... *Note:* ibu will ignore `bar/delivery/` until there are XML files present.
3. **Question**: Wouldn't it be better if ibu was filename agnostic?
  * Instead of having people name things according to AdminDB, ibu would
    * Step 1: match an XML file to a TIF file
      * /d1/area3/prod3/adams/adams1.tif
      * github.com/utkcataloging/adams/cleanedmetadata/modsxml/adams1.xml
    * Step 2: Query the XML for the MS or AR number
        * /relatedItem[@type='host']/identifier = MS. 2306
    * Step 3: Look at AdminDB for the AdminDB number and the last file created
        * AdminDB Number = 759
    * Step 4: Add the new file name to AdminDB
        * 0012_000759_000201_0000
    * Step 5: Rewrite filenames to:
        * 0012_000759_000201_0000.tif
        * 0012_000759_000201_0000.xml
    * Step 6: If needed write the reference to the XML itself:
        * /identifier[@type='local']
    * Justification:  take out the human error

####B. What ibu might do
3. ibu copies (moves?) the paired (or just XML?) files from `foo_collection/delivery` to a separate processing area; i.e. `/gwork/ibu/rendering-plant/`.
  * a move is faster than a copy and will prevent duplicate processing

4. ibu starts the following checks:
	* XML
		* schema validity? (pass|fail)
		  * (xmllint --noout --schema http://www.loc.gov/standards/mods/v3/mods-3-5.xsd *.xml)-example
		* syntactically correct AdminDB identifier (`/mods:mods/mods:identifier[@type='local']` = `\d{4}_\d{6}_\d{6}_\d{4}`) (pass|fail)
		* create our own free standing schema that is based on our own [metadata application profile](https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary)
      * Wouldn't it be better to test against it?  It's more specific.  More specifically test whether required fields are present.
	* Image
		* TIF
			* Is it a multi-page TIF; i.e. are there embedded thumbnails? (if true then apply processing to remove extraneous embedded images)
			* Is there compression? (if true then decompress?)
			* Resolution? (pass|fail)
			* Bit depth? (pass|fail)
			* From newly [updated standards document](https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581):
				* What is pixel dimensions / spatial resolution?
				* Master file format?
				* Color?
				* Bit-depth?
		* JPG
			* What kind of compression has been applied? (depending, decompress?)
			* Resolution? (pass|fail)
			* Bit depth? (pass|fail)
			* ???
    * **Question**: Instead of using Fedora as a guide for content type, would it make since to reference newly updated standards document? That would require a check higher up the list, but would be more accurate.
      * Instead of simply handling "LargeImage", you'd be forced to choose a material type:
        * Map, Drawing, Oversized Original
          * Check for 8 bit color-depth
          * Check for 400 PPI
          * Check Grey-scale or Color
          * Can be TIFF or JP2
        * Photograph
          * Check for 16 bit color depth
          * Check for 600 PPI
          * Check for Color
          * Must be TIFF
        * Photographic Still Film up to 4 x 5
          * Check for 16 bit color depth
          * Check for 4000 PPI
          * Check for Grey-scale or Color
          * Must be TIFF
        * Photographic Still Film Larger than 4" x 5"
          * Check for 16 bit color depth
          * Check for 2000 PPI
          * Check for Color or Grey-scale
          * Must be TIFF
        * Reproduction of Artwork
          * Check for 16 bit color depth
          * Can we check for **12000 Pixels on longside???**
          * Must be Color
          * Must be TIFF

5. ibu will run drush ingest scripts for file pairs that pass the above validity checks.

##Task Breakdown/Signup:
| Task                                   |  Person |        File        |
| -------------------------------------- | ------- | ------------------ |
| Continuous Effective Technical Writing |  Keila  |      README.md     |
|                Abduction               |   Don   |     abduction.js   |
|             XML Validation             | Bridger |   XMLvalidation.js |
|             Image Validation           |  Mark   |   IMGvalidation.js |
|               Ingestion                |  Paul   |   ingestion.js     |
|                 Status                 | Cricket |     status.js      |

##Inputs & Outputs

###XMLvalidation.js
  Input: **String**  (*'/d1/delivery/MODs-file.xml'* )<br/>
  Output: ***Array*** ( [Success] **OR** [Error Message 1 , Error Message 2, Error...] <hr>
###IMGvalidation.js
  Input: **String**  (*'/d1/delivery/Object-file.tif'* )<br/>
  Output: ***Array*** ( [Success] **OR** [Collection, Filename, Error Message 1 , Error Message 2, Error...] <hr>
###ingestion.js
  Input: **String**  (*'/d1/delivery/'* ) the complete target directory<br/>
  Input: **String**  (*'collections:heilman'* ) the collection parent pid<br/>
  Input: **String**  (*'heilman'* ) the namespace of the collection<br/>
  Input: **String**  (*'basic'* ) the content model - either "basic" or "large"<br/>
  Output: ***Array*** ( [Success] **OR** [Error Message 1 , Error Message 2, Error...] <hr>
###status.js
  Input: ***Array***  (*[Error, Error, Errors]* )<br/>
  Output: ***Array*** ( [Full Error Message 1 , Full Error Message 2, Full Error...] )
<hr>

###Sample Data for MongoShell from terminal:
>mongoimport --db ibu --collection ibuerrordocs --drop --file src/tap/InsertDummyData.json

There are sample XML files, pulled from the Adams collection, in `ibu/test`. Some of them have been invalidated. 
**Question:** Does it make sense to keep the XML and IMG files in sync? There are excellent reasons for changing these, randomizing them, etc., but is there any reason to _not_ keep files from the same collections in `test/`? 

##Resources
* This is not important but useful
	* [README.md Markdown Formatting](https://guides.github.com/features/mastering-markdown/)
* [2016 Updated Digitization Standards for Text and Still Image](https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581)
* [UT Libraries Metadata Application Profile](https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary) aka UTK Data Dictionary

**Fedora Install**
```bash
  >sudo -i
  >curl --silent --location https://rpm.nodesource.com/setup_5.x | bash -
  >yum install -y nodejs
  >yum install git-all
  >exit
  >cd ibu
  >npm i
  >npm i -g babel-cli
  >npm install -g n
  >sudo n stable
```


**FreeBSD Install**
```bash
   > sudo pkg install node-5.5.0
   > sudo pkg install www/npm
   > npm install
   > npm start      
```
__Note:__ Runnning a `pkg search node` will let you know the latest version of the package.
