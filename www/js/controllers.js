
angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})

.controller('GalleryCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('GalleryDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.galleryId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', ['RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', function(RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData) {


  function updateUserLocMarker (map) {
    navigator.geolocation.getCurrentPosition(function(position){
      if(map) {
        map.panTo({
          lat : position.coords.latitude,
          lng : position.coords.longitude
        });
      }
      angular.extend($scope, {
         markers : {
          userMarker : {
            lat : position.coords.latitude,
            lng : position.coords.longitude,
            message : 'You are here'
          }
        }
      });
    });
  }
  updateUserLocMarker();
  angular.extend($scope, {
     honolulu: {
         lat: 21.3,
         lng: -157.8,
         zoom: 13
     },
     events: {
      map : {
        enable : ['click'],
        logic : 'broadcast'
      }
     },
     layers: {
         baselayers: {
             osm: {
                 name: 'OpenStreetMap',
                 url: 'https://{s}.tiles.mapbox.com/v3/examples.map-i875mjb7/{z}/{x}/{y}.png',
                 type: 'xyz'
             }
         }
     },
     defaults: {
         scrollWheelZoom: false
     },
     center : {
      autoDiscover : true
     }
  });

  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){
      updateUserLocMarker(map);
    });
  };
  $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      console.log(leafEvent);
      $scope.center.autoDiscover = false;
  });

      $scope.radiusBikeShareLayer = null;
      $scope.radiusHistoryLayer = null;

        // TRYING TO SEND API REQUEST USING LATLNG FROM LOCATIONFOUND - NICK
        // PointService.getPointsInRadius(1800,21.27081933812041,-157.81002044677734)
        //   .then(function(data){
        //     $scope.radiusBikeShareLayer = L.geoJson(data.data.geoJSONBikeShare, {
        //     onEachFeature: function (feature, layer){
        //       layer.bindPopup(feature.properties.description);
        //       layer.setIcon(L.ExtraMarkers.icon({
        //         icon: 'fa-bicycle',
        //         markerColor: 'green-light',
        //         shape: 'circle',
        //         prefix: 'fa'
        //         }));
        //       }
        //     }).addTo(map);
        //     $scope.radiusHistoryLayer = L.geoJson(data.data.geoJSONHistory, {
        //       onEachFeature: function (feature, layer){
        //         layer.bindPopup(feature.properties.description);
        //         layer.setIcon(L.ExtraMarkers.icon({
        //           icon: 'fa-camera',
        //           markerColor: 'yellow',
        //           shape : 'star',
        //           prefix : 'fa'
        //         }));
        //       }
        //     }).addTo(map);
        //   });

    // USER'S VIEW OPTIONS
    // var tileOptions = {
    //   "Street" : googleStreets,
    //   "Satellite" : googleSat,
    //   "Hybrid" : googleHybrid
    // };
  }]);
