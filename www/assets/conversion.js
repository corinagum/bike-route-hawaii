var toConvert = require('./bikeShareReformat.js');
var fs = require('fs');
function convert (theArray){
  for(var i = 0; i < theArray.features.length; i++){
    var properties = theArray.features[i].properties;
    var whatever = properties.description.split('<br>');
    properties.type = "BikeShare";
    properties.fid = whatever[2].split("FID")[1].trim();
    properties.long = whatever[3].split("Long_")[1].trim();
    properties.lat = whatever[4].split("Lat")[1].trim();
    properties.site_id = whatever[5].split("Site_ID")[1].trim();
    properties.name = whatever[6].split("Name")[1].trim();
    properties.info = whatever[7].split("Type_").join('').trim();
    properties.street = whatever[8].split("Street").join('').trim();
    properties.side = whatever[9].split("Side").join('').trim();
    properties.description = whatever[10].split("Info").join('').trim();
    properties.geolink = whatever[11].split("Streetview").join('').trim();
  }
  return theArray;
}
// console.log(convert(toConvert).features);
var writeThis = convert(toConvert).features;
// console.log(writeThis);
fs.writeFile('./www/assets/bikeSharedata.js', JSON.stringify(writeThis, null, 2), 'utf-8', function(err){
  if(err) throw err;
});