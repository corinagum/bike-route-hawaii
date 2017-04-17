var fs = require('fs');

var stations = require('./stationInitial.js');

for(var i=0; i<stations.length; i++){
	stations[i].type = "BikeShare";
	stations[i].photolink = "https://s3-us-west-2.amazonaws.com/bikesharesites/stationPhotosSpring17/" + stations[i].site_id + '.jpg'
	// stations[i].fid = null;
	// stations[i].geolink = null;
	// sitelink[i].sitelink = null;
	// stations[i].photolink = null;
	// stations[i].photolink = null;
	// stations[i].photolink = null;
	// stations[i].photolink = null;

}

// {
// 	"lastClicked": null,
//     "id": 391,
//     "type": "BikeShare",
//     "name": "Paki and Kalakaua",
//     "description": "Station located on the gravel shoulder on the west side of Paki Avenue to the north of the intersection with Kalakaua.",
//     "info": "On-Street in Place of Parking",
//     "fid": 0,
//     "site_id": "0027_011",
//     "street": "Paki Avenue",
//     "side": "W",
//     "lat": 21.2609380183713,
//     "long": -157.81827587802,
//     "geolink": "https://www.google.com/maps/@21.2607781,-157.8181971,3a,75y,331.63h,59.46t/data=!3m6!1e1!3m4!1s5GecKEKkbvn9xE21RYW_tw!2e0!7i13312!8i6656",
//     "sitelink": null,
//     "photolink": "https://s3-us-west-2.amazonaws.com/bikesharesites/stationPhotos/0985_003.jpg",
//     "upDownVote": null,
//     "votesCounter": null,
//     "safetyCounter": null,
//     "createdAt": "2016-02-29T22:11:46.561Z",
//     "updatedAt": "2016-02-29T22:11:46.561Z"
// }

fs.writeFile('./www/assets/stationsSpring17.js', JSON.stringify(stations), function(){
    console.log("overwrote file");
  });