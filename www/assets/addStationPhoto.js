var fs = require('fs');

fs.readdir('./www/assets/stationPhotos', function(err,files){
  var stations = require('./stations.js');
  stations.forEach(function(current){
    if(files.indexOf(current.site_id + '.jpg') !== -1){
      current.photolink = "./../assets/stationPhotos/" + current.site_id + '.jpg';
    }
  });
  console.log(stations);

  fs.writeFile('./www/assets/stations.js', JSON.stringify(stations), function(){
    console.log("overwrote file");
  });
});

// consol
// fs.writeFile('./www/assets/oldHawaiiData.js', JSON.stringify(writeThis, null, 2), 'utf-8', function(err){
//   if(err) throw err;
// });