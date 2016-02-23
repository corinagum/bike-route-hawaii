
angular.module('starter.controllers', ['ngCordova'])

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

.controller('MapCtrl', ['$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', function($ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation) {
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  angular.extend($scope, {
     markers : {}
  });
  document.addEventListener("deviceready", updateUserLocMarker, false);
  function updateUserLocMarker (map) {

    if(!isCordovaApp) {
      // DO WE NEED TO ADD A TIMEOUT? SEE LINE 62
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
    } else {
      $cordovaGeolocation
          .getCurrentPosition({timeout : 1000, enableHighAccuracy : true})
          .then(function (position) {
            if(map.panTo) {
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
          }, function(err) {
            console.log(err);
          });
    }
  }
  angular.extend($scope, {
     honolulu: {
         lat: 21.3,
         lng: -157.8,
         zoom: 13
     },
     events: {
      map : {
        enable : ['click', 'locationfound'],
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
     },
     bikeShareIcon: {
       type: 'extraMarker',
       icon: 'fa-bicycle',
       markerColor: 'green-light',
       prefix: 'fa',
       shape: 'circle'
     },
     HistoryIcon: {
       type: 'extraMarker',
       icon: 'fa-camera',
       markerColor: 'yellow',
       shape : 'star',
       prefix : 'fa'
      }
  });

  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){
      updateUserLocMarker(map);
    });
  };

  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = false;
    $scope.markers.userMarker = {
      lat : leafEvent.latitude,
      lng : leafEvent.longitude,
      message : 'You are here'
    };

    PointService.getPointsInRadius(18000, leafEvent.latitude, leafEvent.longitude)
      .then(function(data){
        for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
          var bikeNum = 'bike' + i;
          $scope.markers[bikeNum] = {
            lat : data.data.geoJSONBikeShare.features[i].properties.lat,
            lng : data.data.geoJSONBikeShare.features[i].properties.long,
            icon: $scope.bikeShareIcon
          };
        }
        for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
          var historyNum = 'history' + i;
          $scope.markers[historyNum] = {
            lat : data.data.geoJSONHistory.features[j].properties.lat,
            lng : data.data.geoJSONHistory.features[j].properties.long,
            icon: $scope.historyIcon
          };
        }
      });
  });

  $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      $scope.center.autoDiscover = false;
  });

//////// BEGINNIG of MODAL ////////

$ionicModal.fromTemplateUrl('filter-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  //////// END of MODAL ////////



  }]);
