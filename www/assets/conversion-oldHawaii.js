var toConvert = require('./old-hawaii.js');
var fs = require('fs');
function convert (theArray){
  for(var i = 0; i < theArray.features.length; i++){
    var properties = theArray.features[i].properties;
    var whatever = properties.description.split('<br>');
    properties.description = whatever;
  }
  return theArray;
}
// console.log(convert(toConvert).features);
var writeThis = convert(toConvert).features;
// console.log(writeThis);
fs.writeFile('./www/assets/oldHawaiiData.js', JSON.stringify(writeThis, null, 2), 'utf-8', function(err){
  if(err) throw err;
});