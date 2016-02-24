
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

.controller('MapCtrl', ['$http','$ionicModal','RouteService', 'UserService', 'PointService', '$scope', '$ionicLoading', '$compile', 'leafletData', '$cordovaGeolocation', function($http, $ionicModal, RouteService, UserService, PointService, $scope, $ionicLoading, $compile, leafletData, $cordovaGeolocation) {

  var isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;
  angular.extend($scope, {
     markers : {}
  });
  document.addEventListener("deviceready", updateUserLocMarker, false);
  function updateUserLocMarker (map) {

    if(!isCordovaApp) {
      navigator.geolocation.getCurrentPosition(function(position){
      $ionicLoading.hide();

        if(map) {
          map.panTo({
            lat : position.coords.latitude,
            lng : position.coords.longitude
          });
        }
        $scope.markers.userMarker = {
          lat : position.coords.latitude,
          lng : position.coords.longitude,
          message : 'You are here'
        };
      }, function(err){
        console.log(err);
      }, {
        timeout : 5000,
        enableHighAccuracy : true
      });
    } else {
      $cordovaGeolocation
        .getCurrentPosition({timeout : 10000, enableHighAccuracy : true})
        .then(function (position) {
          $ionicLoading.hide();
          if(map.panTo) {
            map.panTo({
              lat : position.coords.latitude,
              lng : position.coords.longitude
            });
          }
          $scope.markers.userMarker = {
          lat : position.coords.latitude,
          lng : position.coords.longitude,
          message : 'You are here'
        };
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
        enable : ['click', 'locationfound', 'dblclick', 'dragend', 'moveend', 'zoomend'],
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
    historyIcon: {
      type: 'extraMarker',
      icon: 'fa-camera',
      markerColor: 'yellow',
      shape : 'star',
      prefix : 'fa'
    }
  });
  $scope.findCenter = function(){
    leafletData.getMap().then(function(map){
    $scope.show($ionicLoading);
      updateUserLocMarker(map);
    });
  };

  $scope.$on('leafletDirectiveMap.map.locationfound', function(event, args){
    $ionicLoading.hide();
    var leafEvent = args.leafletEvent;
    $scope.center.autoDiscover = false;
    $scope.markers.userMarker = {
      lat : leafEvent.latitude,
      lng : leafEvent.longitude,
      message : 'You are here &nbsp&nbsp<i class="fa fa-chevron-right"></i>'
    };

    PointService.getPointsInRadius(1800, leafEvent.latitude, leafEvent.longitude)
      .then(function(data){
        for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
          var bikeNum = 'bike' + i;
          $scope.markers[bikeNum] = {
            lat : data.data.geoJSONBikeShare.features[i].properties.lat,
            lng : data.data.geoJSONBikeShare.features[i].properties.long,
            icon: $scope.bikeShareIcon,
            properties : data.data.geoJSONBikeShare.features[i].properties
          };
        }
        for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
          var historyNum = 'history' + j;
          $scope.markers[historyNum] = {
            lat : data.data.geoJSONHistory.features[j].properties.lat,
            lng : data.data.geoJSONHistory.features[j].properties.long,
            icon: $scope.historyIcon,
            properties : data.data.geoJSONHistory.features[j].properties
          };
        }
      });

  });

  $scope.$on('leafletDirectiveMap.map.dragend', function(event, args){
    $scope.center.autoDiscover = false;
    $scope.markers = {
      userMarker : $scope.markers.userMarker
    };
    leafletData.getMap().then(function(map){
      // $scope.show($ionicLoading);
      var bounds = map.getBounds();
      PointService.getPointsInView(bounds._northEast.lat,bounds._southWest.lat, bounds._northEast.lng, bounds._southWest.lng)
        .then(function(data){
          for(var i = 0; i < data.data.geoJSONBikeShare.features.length; i++){
            var bikeNum = 'bike' + i;
            $scope.markers[bikeNum] = {
              lat : data.data.geoJSONBikeShare.features[i].properties.lat,
              lng : data.data.geoJSONBikeShare.features[i].properties.long,
              icon: $scope.bikeShareIcon,
              properties : data.data.geoJSONBikeShare.features[i].properties
            };
          }
          for(var j = 0; j < data.data.geoJSONHistory.features.length; j++){
            var historyNum = 'history' + j;
            $scope.markers[historyNum] = {
              lat : data.data.geoJSONHistory.features[j].properties.lat,
              lng : data.data.geoJSONHistory.features[j].properties.long,
              icon: $scope.historyIcon,
              properties : data.data.geoJSONHistory.features[j].properties
            };
          }
        });
    });
  });

  //SPINNER ONLOAD ANIMATION
  $scope.show = function() {
    $ionicLoading.show({
      template: '<p>Loading, please wait...</p><ion-spinner icon="spiral"></ion-spinner>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  $scope.$on('leafletDirectiveMap.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      $scope.center.autoDiscover = false;
  });

  $scope.$on('leafletDirectiveMarker.map.click', function(event, args){
      var leafEvent = args.leafletEvent;
      var marker = args.markerName;

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
