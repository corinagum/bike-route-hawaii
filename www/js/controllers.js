
angular.module('starter.controllers', ['ngCordova'])

.controller('DashCtrl', function($scope) {})

.controller('ChatsCtrl', function($scope, Chats) {
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

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
})

.controller('MapCtrl', ['$http','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', function($http, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation) {
  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  angular.extend($scope, {
     markers : {}
  });
  document.addEventListener("deviceready", updateUserLocMarker, false);
  function updateUserLocMarker (map) {

    if(!isCordovaApp) {
      // DO WE NEED TO ADD A TIMEOUT? SEE LINE 62
      navigator.geolocation.getCurrentPosition(function(position){
      $ionicLoading.hide();

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
      ng: -157.8,
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
    console.log("FIND CENTERRRRR");
    $scope.show($ionicLoading);
    leafletData.getMap().then(function(map){
      updateUserLocMarker(map);
    });
  };

  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    console.log("locationFOUND");
    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = false;
    $scope.markers.userMarker = {
      lat : leafEvent.latitude,
      lng : leafEvent.longitude,
      message : 'You are here',
      zoom : 13
    };

    PointService.getPointsInRadius(1800, leafEvent.latitude, leafEvent.longitude)
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

  //SPINNER ONLOAD ANIMATION
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading please wait suckaaas!...</p><ion-spinner></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.$on('leafletDirectiveMap.map.click', function(event, args){

      var leafEvent = args.leafletEvent;
      $scope.center.autoDiscover = false;

  });
  }]);
