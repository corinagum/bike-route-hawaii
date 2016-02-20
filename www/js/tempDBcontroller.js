angular.module('starter.controller', [])
  .controller('DBcontroller', ['$scope', 'PointService', function($scope, PointService){

    $scope.getPoints = function(){
      PointService.getPoints()
        .then(function(data){
          var geoJSON = {
            "type" : "FeatureCollection",
            "features" : []
          };
          for(var i=0; i<data.results.length; i++){
            var point = {
              "type": "Feature",
              "geometry": {
                "type": "Point",
                "coordinates": [ data.results[i].long, data.results[i].lat, 0]
              },
              "properties" : data.results[i]
            };
            geoJSON.features.push(point);
          }
        });
    };

  }]);