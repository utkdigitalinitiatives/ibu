/**
 * [XMLvalidation evaluates an MODS XML file and ensures it meets standards set here: https://wiki.lib.utk.edu/display/DLP/UTK+Data+Dictionary]
 * @param {[String]} input [MODS XML filename]
 * @return {[Array]}       [Success] or [Filename, Error 1, Error 2, Error 3, ...]
 *
 */

/**
 * a list of paths for vars ([O)ptional|(R)equired]-[(Y)es|(N)o Repeatable?])
 *
 * abstract = modsIn["mods"]["abstract"] (O-Y)
 * coll = modsIn["mods"]["relatedItem"]["displayLabel"]["Collection"]["type"]["host"]["titleInfo"]["title"](R-N; Req'd if available)
 * collIdentifier = modsIn["mods"]["relatedItem"]["displayLabel"]["Collection"]["type"]["host"]["identifier"](R-N; Req'd if available)
 * dateCreated = modsIn["mods"]["originInfo"]["dateCreated"](R-R)
 * dateCreatedKey = modsIn["mods"]["originInfo"]["dateCreated"]["encoding"]["edtf"]["keyDate"]["yes"]["point"]["start"](R-N)
 * dateQualifier = modsIn["mods"]["originInfo"]["dateCreated"]["keyDate"]["yes"]["qualifier"]["..."](R-N; Req'd if available)
 * datePublication = modsIn["mods"]["originInfo"]["dateIssued"](O-N)
 * digitalOrigin = modsIn["mods"]["physicalDescription"]["digitalOrigin"](R-N)
 * extent = modsIn["mods"]["physicalDescription"]["extent"](O-N)
 * identifierFile = modsIn["mods"]["identifier"]["type"]["file"](R-Y)
 * identifierLocal = modsIn["mods"]["identifier"]["type"]["local"]...
 *
 */
