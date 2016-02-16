# Ingestion Batch Utility
Sprint to Ingestion Batch Utility for automating, validating Objects and ingestion
![IBU](http://i.imgur.com/wTI6m0G.png)
<br/>:bangbang: **Don't fork!** :bangbang:<br/>
NOT A WORKING REPO<br/>
This is a proof of concept only

###Full Description of what this does:
  Takes files (either through drag and drop or from syncing a folder) and automates the process
  of import then validation then renaming files then processes during ingestion.

##How to approach:
Clone > Make your Edits > Commit to Master > Sync


##High Level Overview:

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
 
3. ibu copies (moves?) the paired (or just XML?) files from `foo_collection/delivery` to a separate processing area; i.e. `/gwork/ibu/rendering-plant/`.

4. ibu starts the following checks:
	* XML
		* schema validity? (pass|fail)
		* syntactically correct AdminDB identifier (`/mods:mods/mods:identifier[@type='local']` = `\d{4}_\d{6}_\d{6}_\d{4}`) (pass|fail)
		* ???
	* Image
		* TIF 
			* Is it a multi-page TIF; i.e. are there embedded thumbnails? (if true then apply processing to remove extraneous embedded images)
			* Is there compression? (if true then decompress?)
			* Resolution? (pass|fail)
			* Bit depth? (pass|fail)
			* ???
		* JPG
			* What kind of compression has been applied? (depending, decompress?)
			* Resolution? (pass|fail)
			* Bit depth? (pass|fail)
			* ???


##Task Breakdown/Signup:
| Task                                   | Person |
| -------------------------------------- | ------ |
| Continuous Effective Technical Writing | Keila  |


##Resources
* This is not important but useful
	* [README.md Markdown Formatting](https://guides.github.com/features/mastering-markdown/)
* [2016 Updated Digitization Standards for Text and Still Image](https://wiki.lib.utk.edu/pages/viewpage.action?pageId=11927581)


