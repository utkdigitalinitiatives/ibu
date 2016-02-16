# Ingestion Batch Utility
Sprint to Ingestion Batch Utility for automating and validating Objects for ingestion
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
I bit more higher level.

###At a glance
> Files[1] -> import into a submission form[2] -> validates all fields have been
>  imported or filled in[3] -> validates Obj(image) requirements[4] -> gives user
>  feedback (pass or error)[5] -> upon success exports Mods/Tiff into temp directory
>  with new file names (standTitleSubject.tiff standTitleSubject.xml)[6] -> server
>  runs Drush commands to ingest both files[7]

I'm thinking these are steps within another broader step
	Step 1 >
	  Special Collections makes collection entry in Admin DB for MS or AR physical collection
	
	  AdminDB makes unique identifier for collection
	
	Step 2 >
	  DPS uses admindb name to scan individual items
	
	  using an increment of admindb name for each image
	
	  Read first file in directory
	
	  break apart file name to find collection
	
	    * are there spaces in file name
	
	    * check filename length
	
	Step 3 >
	
	  use identify/mogrify to check image
	
	    * check for compression -- remove compression
	
	    * check for pixel dimensions units -- inches versus mm versus cm
	
	    * check for multi-page tiffs -- delete thumbnail




##Task Breakdown/Signup:
| Task                                   | Person |
| -------------------------------------- | ------ |
| Continuous Effective Technical Writing | Keila  |


##Resources
This is not important but useful
[README.md Markdown Formatting](https://guides.github.com/features/mastering-markdown/)
