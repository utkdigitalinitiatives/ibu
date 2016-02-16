# Ingestion Batch Utility
Sprint to Ingestion Batch Utility for automating and validating Objects for ingestion
![IBU](http://i.imgur.com/wTI6m0G.png)
<br/>:bangbang: **Don't fork!** :bangbang:<br/>
NOT A WORKING REPO<br/>
This is a proof of concept only

##How to approach:
Clone > Make your Edits > Commit to Master > Sync


##High Level Overview:
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
  
    * check for compression
    
    * check for pixel dimensions units
    
    * check for multi-page tiffs
    

etc........ START HERE!

##Task Breakdown/Signup:
| Task                                   | Person |
| -------------------------------------- | ------ |
| Continuous Effective Technical Writing | Keila  |


##Resources
This is not important but useful
[README.md Markdown Formatting](https://guides.github.com/features/mastering-markdown/)
