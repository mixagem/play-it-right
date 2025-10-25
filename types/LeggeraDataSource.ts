/**
 * Child records present in Leggera MainformDetails records.\
 * \
 * Collections mainform -> (elements) sub-collection\
 * Applications mainform -> (collections) & (fonts) sub-collections\
 * Cloud mainform -> (images) sub-collection
 */
export interface MainformDetailsDataSource {
    elements: string,
    collections: string,
    fonts: string,
    images: string
}

/**
 * Table headers available througout Leggera. 
 * 
 * Elements mainform: name, collectionLabel, id 
 *  
 * Collections mainform: name, applicationLabel, details \
 * elements sub-collection: name, id
 * 
 * Applications mainform - name, details \
 * collections: name \
 * fonts sub-collection: id, details 
 *  
 * Cloud mainform: name, applicationLabel, lastEdit \
 * images: name, id
 *  
 * Wizard mainform:name, applicationLabel
 */
export interface MainformListDataSource {
    name: string,
    id: string,
    collection: string,
    details: string,
    applicationLabel: string,
    extension: string,
    collectionLabel: string,
    lastEdit: string
}